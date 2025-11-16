'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { Plan, Dish, BodyMeasurement, UserProfile, Variation, Meal, MealItem, FoodItemData } from '@/lib/types';
import { useCollection, useDoc, useFirebase } from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { 
    addDocumentNonBlocking, 
    deleteDocumentNonBlocking, 
    setDocumentNonBlocking,
    updateDocumentNonBlocking 
} from '@/firebase/non-blocking-updates';
import { useMemoFirebase } from '@/firebase/provider';

// Types
type ConsumedTotals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

type MealsByVariation = {
    [variationId: string]: Meal[];
}

// App Context
interface AppContextType {
    // Auth & Profile
    profile: UserProfile | null;
    isProfileLoading: boolean;
    saveProfile: (profile: Partial<UserProfile>) => void;

    // Plans
    plans: Plan[];
    isPlansLoading: boolean;
    activePlan: Plan | undefined;
    setActivePlan: (planId: string) => void;
    updatePlanVariations: (planId: string, newVariations: Variation[]) => void;

    // Dishes
    dishes: Dish[];
    isDishesLoading: boolean;
    saveDish: (dish: Dish) => void;
    deleteDish: (dishId: string) => void;

    // Measurements
    measurements: BodyMeasurement[];
    isMeasurementsLoading: boolean;
    saveMeasurement: (measurement: BodyMeasurement) => void;
    
    // Photos
    photos: any[]; // Replace with EvolutionPhoto[] when implemented with Firestore
    isPhotosLoading: boolean;
    setPhotos: (photos: any[]) => void;

    // Meals
    mealsByVariation: MealsByVariation;
    isMealsLoading: boolean;
    setMealsForVariation: (variationId: string, meals: Meal[]) => void;
    activeVariationId: string | undefined;
    setActiveVariationId: React.Dispatch<React.SetStateAction<string | undefined>>;
    todaysMeals: Meal[];
    toggleMealItemEaten: (mealId: string, itemId: string, newEatenState: boolean) => void;
    consumedTotals: ConsumedTotals;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { user, isUserLoading, firestore } = useFirebase();

    // --- Profile Data ---
    const profileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [user, firestore]);
    const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

    const saveProfile = (newProfileData: Partial<UserProfile>) => {
        if (profileRef) {
            updateDocumentNonBlocking(profileRef, newProfileData);
        }
    };
    
    // --- Plans Data ---
    const plansRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/userGoals`) : null, [user, firestore]);
    const { data: plans, isLoading: isPlansLoading } = useCollection<Plan>(plansRef);

    const setActivePlan = (planId: string) => {
        if (!plans) return;
        plans.forEach(p => {
            const planDocRef = doc(firestore, `users/${user!.uid}/userGoals/${p.id}`);
            updateDocumentNonBlocking(planDocRef, { isActive: p.id === planId });
        });
    };
    
    const updatePlanVariations = (planId: string, newVariations: Variation[]) => {
        if (!user) return;
        const planDocRef = doc(firestore, `users/${user.uid}/userGoals/${planId}`);
        updateDocumentNonBlocking(planDocRef, { variations: newVariations });
    };

    const activePlan = useMemo(() => plans?.find(p => p.isActive), [plans]);

    // --- Dishes Data ---
    const dishesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/customFoods`) : null, [user, firestore]);
    const { data: dishes, isLoading: isDishesLoading } = useCollection<Dish>(dishesRef);

    const saveDish = (dish: Dish) => {
        if (!user) return;
        const dishDocRef = doc(firestore, `users/${user.uid}/customFoods/${dish.id}`);
        setDocumentNonBlocking(dishDocRef, dish, { merge: true });
    };

    const deleteDish = (dishId: string) => {
        if (!user) return;
        const dishDocRef = doc(firestore, `users/${user.uid}/customFoods/${dishId}`);
        deleteDocumentNonBlocking(dishDocRef);
    }

    // --- Measurements Data ---
    const measurementsQuery = useMemoFirebase(() => user ? query(collection(firestore, `users/${user.uid}/bodyMetrics`), orderBy('date', 'asc')) : null, [user, firestore]);
    const { data: measurements, isLoading: isMeasurementsLoading } = useCollection<BodyMeasurement>(measurementsQuery);
    
    const saveMeasurement = (measurement: BodyMeasurement) => {
        if (!user) return;
        // Generate a document ID based on the date to avoid duplicates for the same day
        const docId = new Date(measurement.date).toISOString().split('T')[0];
        const measurementRef = doc(firestore, `users/${user.uid}/bodyMetrics`, docId);
        setDocumentNonBlocking(measurementRef, measurement, { merge: true });
    };

    // --- Photos Data (Placeholder) ---
    // TODO: Implement with Firebase Storage and Firestore
    const [photos, setPhotos] = useState([]); 
    const isPhotosLoading = false;

    // --- Meals Data ---
    const [activeVariationId, setActiveVariationId] = useState<string | undefined>();
    const mealsRef = useMemoFirebase(() => user && activeVariationId ? collection(firestore, `users/${user.uid}/dailyLogs/${activeVariationId}/meals`) : null, [user, firestore, activeVariationId]);
    const { data: rawMeals, isLoading: isMealsLoading } = useCollection<Meal>(mealsRef);
    
    const mealsByVariation = useMemo(() => {
        if (!activeVariationId || !rawMeals) return {};
        return { [activeVariationId]: rawMeals };
    }, [rawMeals, activeVariationId]);

    const setMealsForVariation = (variationId: string, meals: Meal[]) => {
        if (!user) return;
        // This is a complex operation, might need a transaction or batched write in a real scenario
        // For now, we update meal by meal
        meals.forEach(meal => {
            const mealRef = doc(firestore, `users/${user.uid}/dailyLogs/${variationId}/meals/${meal.id}`);
            setDocumentNonBlocking(mealRef, meal, { merge: true });
        });
    };

     useEffect(() => {
        if (activePlan && activePlan.variations.length > 0) {
            const currentVariationStillExists = activePlan.variations.some(v => v.id === activeVariationId);
            if (!currentVariationStillExists) {
                setActiveVariationId(activePlan.variations[0].id);
            }
        }
    }, [activePlan, activeVariationId]);


    const todaysMeals = useMemo(() => (activeVariationId ? mealsByVariation[activeVariationId] || [] : []), [activeVariationId, mealsByVariation]);
    
    const toggleMealItemEaten = (mealId: string, itemId: string, newEatenState: boolean) => {
        if (!activeVariationId || !user) return;
        
        const mealToUpdate = todaysMeals.find(m => m.id === mealId);
        if (!mealToUpdate) return;
        
        const itemToUpdate = mealToUpdate.items.find(i => i.id === itemId);
        if (!itemToUpdate) return;
        
        // This is a deep update. In a real app, you might want to structure data differently
        // or use field transforms. For now, we update the whole meal object.
        const updatedItems = mealToUpdate.items.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, eaten: newEatenState };
                if (updatedItem.type === 'dish') {
                    updatedItem.ingredients = updatedItem.ingredients.map(ing => ({ ...ing, eaten: newEatenState }));
                }
                return updatedItem;
            }
            return item;
        });
        
        const updatedMeal = { ...mealToUpdate, items: updatedItems };
        const mealRef = doc(firestore, `users/${user.uid}/dailyLogs/${activeVariationId}/meals/${mealId}`);
        updateDocumentNonBlocking(mealRef, updatedMeal);
    };
    
    const consumedTotals: ConsumedTotals = useMemo(() => {
        const totals: ConsumedTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        if (!todaysMeals) return totals;

        todaysMeals.forEach(meal => {
            meal.items.forEach(item => {
                if (item.eaten) {
                    if (item.type === 'food') {
                        const multiplier = item.servingSize / 100;
                        totals.calories += item.nutrients.calories * multiplier;
                        totals.protein += item.nutrients.protein * multiplier;
                        totals.carbs += item.nutrients.carbohydrates * multiplier;
                        totals.fat += item.nutrients.fat * multiplier;
                    } else if (item.type === 'dish') {
                        item.ingredients.forEach(ingredient => {
                             if(ingredient.eaten) { // Check if individual ingredient is eaten
                                const multiplier = ingredient.servingSize / 100;
                                totals.calories += ingredient.nutrients.calories * multiplier;
                                totals.protein += ingredient.nutrients.protein * multiplier;
                                totals.carbs += ingredient.nutrients.carbohydrates * multiplier;
                                totals.fat += ingredient.nutrients.fat * multiplier;
                            }
                        });
                    }
                }
            });
        });
        return totals;
    }, [todaysMeals]);


    const value = {
        profile: profile || null,
        isProfileLoading: isUserLoading || isProfileLoading,
        saveProfile,
        plans: plans || [],
        isPlansLoading: isUserLoading || isPlansLoading,
        activePlan,
        setActivePlan,
        updatePlanVariations,
        dishes: dishes || [],
        isDishesLoading: isUserLoading || isDishesLoading,
        saveDish,
        deleteDish,
        measurements: measurements || [],
        isMeasurementsLoading: isUserLoading || isMeasurementsLoading,
        saveMeasurement,
        photos: photos || [],
        isPhotosLoading: isUserLoading || isPhotosLoading,
        setPhotos,
        mealsByVariation,
        isMealsLoading: isUserLoading || isMealsLoading,
        setMealsForVariation,
        activeVariationId,
        setActiveVariationId,
        todaysMeals,
        toggleMealItemEaten,
        consumedTotals,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
