
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { Plan, Dish, BodyMeasurement, UserProfile, Variation, Meal, MealItem, FoodItemData, EvolutionPhoto } from '@/lib/types';
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

// Add new type for historical meals
type HistoricalMeals = {
  [date: string]: Meal[]; // date as key, meals as value
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
    updatePlan: (planId: string, updatedPlan: Partial<Plan>) => void;

    // Dishes
    dishes: Dish[];
    isDishesLoading: boolean;
    saveDish: (dish: Dish) => void;
    deleteDish: (dishId: string) => void;

    // Measurements
    measurements: BodyMeasurement[];
    isMeasurementsLoading: boolean;
    saveMeasurement: (measurement: BodyMeasurement) => void;
    deleteMeasurement: (measurementDate: string) => void;

    // Photos
    photos: EvolutionPhoto[];
    isPhotosLoading: boolean;
    setPhotos: (newPhotos: EvolutionPhoto[]) => void;
    addPhoto: (photo: EvolutionPhoto) => void;
    deletePhoto: (photoId: string, publicId?: string) => Promise<void>;

    // Meals
    mealsByVariation: MealsByVariation;
    isMealsLoading: boolean;
    setMealsForVariation: (variationId: string, meals: Meal[]) => void;
    deleteMeal: (mealId: string) => void;
    updateMealName: (mealId: string, newName: string) => void;
    activeVariationId: string | undefined;
    setActiveVariationId: React.Dispatch<React.SetStateAction<string | undefined>>;
    todaysMeals: Meal[];
    toggleMealItemEaten: (mealId: string, itemId: string, newEatenState: boolean) => void;
    toggleAllMealItemsEaten: (mealId: string, newEatenState: boolean) => void;
    consumedTotals: ConsumedTotals;

    // Add historical meals data
    historicalMeals: HistoricalMeals;
    isHistoricalMealsLoading: boolean;
    loadHistoricalMeals: (variationId: string, startDate: Date, endDate: Date) => Promise<HistoricalMeals>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { user, isUserLoading, firestore } = useFirebase();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isUserLoading && !user) {
            // In a real app, you would redirect to the login page
            // For now, we'll just log to console
            console.log('User not authenticated, redirecting to login');
        }
    }, [user, isUserLoading]);

    // --- Profile Data ---
    const profileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [user, firestore]);
    const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

    // Create initial profile when user logs in for the first time (only if no profile exists)
    useEffect(() => {
        if (user && !isUserLoading && !isProfileLoading && profileRef) {
            // Check if profile already exists
            if (!profile) {
                // Only create basic profile with essential fields
                // Don't set name, age, height, or gender to default values as this may overwrite user data
                const initialProfile: Partial<UserProfile> = {
                    email: user.email || ''
                    // Note: We don't set name, age, height, or gender here to avoid overwriting user data
                };
                
                // Use setDocumentNonBlocking to create the document if it doesn't exist
                setDocumentNonBlocking(profileRef, initialProfile, { merge: true });
            }
        }
    }, [user, profile, isProfileLoading, isUserLoading, profileRef]);

    const saveProfile = (newProfileData: Partial<UserProfile>) => {
        if (profileRef) {
            // Use setDocumentNonBlocking with merge to handle both create and update cases
            setDocumentNonBlocking(profileRef, newProfileData, { merge: true });
        }
    };
    
    // --- Plans Data ---
    const plansRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/userGoals`) : null, [user, firestore]);
    const { data: plans, isLoading: isPlansLoading } = useCollection<Plan>(plansRef);

    const setActivePlan = (planId: string) => {
        if (!plans || !user) return;
        plans.forEach(p => {
            const planDocRef = doc(firestore, `users/${user.uid}/userGoals/${p.id}`);
            updateDocumentNonBlocking(planDocRef, { isActive: p.id === planId });
        });
    };
    
    const updatePlanVariations = (planId: string, newVariations: Variation[]) => {
        if (!user || newVariations.length === 0) return;
        const planDocRef = doc(firestore, `users/${user.uid}/userGoals/${planId}`);
        updateDocumentNonBlocking(planDocRef, { variations: newVariations });
    };
    
    const updatePlan = (planId: string, updatedPlan: Partial<Plan>) => {
        if (!user) return;
        const planDocRef = doc(firestore, `users/${user.uid}/userGoals/${planId}`);
        updateDocumentNonBlocking(planDocRef, updatedPlan);
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

    // Add a function to delete measurements
    const deleteMeasurement = (measurementDate: string) => {
        if (!user) return;
        // Generate the document ID based on the date
        const docId = new Date(measurementDate).toISOString().split('T')[0];
        const measurementRef = doc(firestore, `users/${user.uid}/bodyMetrics`, docId);
        deleteDocumentNonBlocking(measurementRef);
    };

    // --- Photos Data ---
    const photosRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/evolutionPhotos`) : null, [user, firestore]);
    const { data: photos, isLoading: isPhotosLoading } = useCollection<EvolutionPhoto>(photosRef);

    const addPhoto = (photo: EvolutionPhoto) => {
        if (!user) return;
        const photoRef = doc(firestore, `users/${user.uid}/evolutionPhotos/${photo.id}`);
        setDocumentNonBlocking(photoRef, photo, { merge: true });
    };

    const deletePhoto = async (photoId: string, publicId?: string) => {
        if (!user) return;
        
        // Delete from Firestore
        const photoRef = doc(firestore, `users/${user.uid}/evolutionPhotos/${photoId}`);
        deleteDocumentNonBlocking(photoRef);
    };

    const setPhotos = (newPhotos: EvolutionPhoto[]) => {
        // This is for backward compatibility, but we should use addPhoto/deletePhoto instead
        newPhotos.forEach(photo => {
            addPhoto(photo);
        });
    };

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

    // Add function to delete individual meals
    const deleteMeal = (mealId: string) => {
        if (!user || !activeVariationId) return;
        const mealRef = doc(firestore, `users/${user.uid}/dailyLogs/${activeVariationId}/meals/${mealId}`);
        deleteDocumentNonBlocking(mealRef);
    };

    // Add function to update meal name
    const updateMealName = (mealId: string, newName: string) => {
        if (!user || !activeVariationId) return;
        const mealRef = doc(firestore, `users/${user.uid}/dailyLogs/${activeVariationId}/meals/${mealId}`);
        updateDocumentNonBlocking(mealRef, { name: newName });
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

    // New function to toggle all items in a meal at once
    const toggleAllMealItemsEaten = (mealId: string, newEatenState: boolean) => {
        if (!activeVariationId || !user) return;
        
        const mealToUpdate = todaysMeals.find(m => m.id === mealId);
        if (!mealToUpdate) return;
        
        // Update all items in the meal to the new eaten state
        const updatedItems = mealToUpdate.items.map(item => {
          const updatedItem = { ...item, eaten: newEatenState };
          if (updatedItem.type === 'dish') {
            updatedItem.ingredients = updatedItem.ingredients.map(ing => ({ ...ing, eaten: newEatenState }));
          }
          return updatedItem;
        });
        
        // Update the entire meal with all items updated
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

    // --- Historical Meals Data ---
    const [historicalMeals, setHistoricalMeals] = useState<HistoricalMeals>({});
    const [isHistoricalMealsLoading, setIsHistoricalMealsLoading] = useState(false);
  
    // Function to load historical meals for a date range
    const loadHistoricalMeals = async (variationId: string, startDate: Date, endDate: Date) => {
      if (!user) return {};
      
      setIsHistoricalMealsLoading(true);
      try {
        // Create an array of dates between start and end date
        const dates: string[] = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // For each date, we would fetch meals from Firestore
        // This is a simplified implementation - in a real app, you'd batch these requests
        const newHistoricalMeals: HistoricalMeals = {};
        
        // For now, we'll just return an empty object - in a real implementation, you'd fetch from Firestore
        return newHistoricalMeals;
      } catch (error) {
        console.error('Error loading historical meals:', error);
        return {};
      } finally {
        setIsHistoricalMealsLoading(false);
      }
    };

    const value = {
        profile: profile || null,
        isProfileLoading: isUserLoading || isProfileLoading,
        saveProfile,
        plans: plans || [],
        isPlansLoading: isUserLoading || isPlansLoading,
        activePlan,
        setActivePlan,
        updatePlanVariations,
        updatePlan,
        dishes: dishes || [],
        isDishesLoading: isUserLoading || isDishesLoading,
        saveDish,
        deleteDish,
        measurements: measurements || [],
        isMeasurementsLoading: isUserLoading || isMeasurementsLoading,
        saveMeasurement,
        deleteMeasurement,
        photos: photos || [],
        isPhotosLoading: isUserLoading || isPhotosLoading,
        setPhotos,
        addPhoto,
        deletePhoto,
        mealsByVariation,
        isMealsLoading: isUserLoading || isMealsLoading,
        setMealsForVariation,
        deleteMeal,
        updateMealName,
        activeVariationId,
        setActiveVariationId,
        todaysMeals,
        toggleMealItemEaten,
        toggleAllMealItemsEaten,
        consumedTotals,
        historicalMeals,
        isHistoricalMealsLoading,
        loadHistoricalMeals,
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