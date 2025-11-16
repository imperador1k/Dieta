
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Plan, Dish, BodyMeasurement, UserProfile, Variation, Meal } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { EvolutionPhoto } from '@/lib/types';

// Initial mock data, consolidated in one place

const initialPlans: Plan[] = [
    {
        id: 'plan-1',
        name: 'Emagrecimento Intensivo',
        description: 'Focado na perda de gordura, mantendo a massa muscular.',
        isActive: true,
        targets: { calories: 2200, protein: 180, carbs: 200, fat: 70 },
        variations: [
            { id: 'var-1', name: 'Dia de Treino A (Cardio)' },
            { id: 'var-2', name: 'Dia de Treino B (Força)' },
            { id: 'var-3', name: 'Dia de Descanso' },
        ],
    },
    {
        id: 'plan-2',
        name: 'Manutenção Muscular',
        description: 'Plano para manter o peso atual e a composição corporal.',
        isActive: false,
        targets: { calories: 2800, protein: 200, carbs: 300, fat: 90 },
        variations: [
             { id: 'var-4', name: 'Dia Normal' },
        ],
    },
];

const initialDishes: Dish[] = [
    {
        id: 'dish-1',
        name: 'Salada de Frango Grelhado',
        description: 'Uma salada leve e proteica.',
        instructions: 'Grelhe o frango, corte os vegetais, misture tudo.',
        ingredients: [
            { id: 'food-1', fdcId: 171477, description: 'Pechuga de pollo', servingSize: 150, nutrients: { calories: 165, protein: 31, fat: 3.6, carbohydrates: 0 } },
            { id: 'food-2', fdcId: 169246, description: 'Lechuga romana', servingSize: 100, nutrients: { calories: 17, protein: 1.2, fat: 0.3, carbohydrates: 3.3 } },
            { id: 'food-3', fdcId: 168429, description: 'Tomate', servingSize: 50, nutrients: { calories: 18, protein: 0.9, fat: 0.2, carbohydrates: 3.9 } },
        ]
    }
];

const initialProfile: UserProfile = {
    name: 'Utilizador DietaS',
    email: 'user@dietas.app',
    age: 30,
    height: 180,
    gender: 'male',
    avatarUrl: 'https://github.com/shadcn.png'
};

const initialMeasurements: BodyMeasurement[] = [
    { date: "2024-01-15", weight: 80, neck: 40, waist: 90, hips: 100 },
    { date: "2024-02-15", weight: 78.5, neck: 39.5, waist: 88, hips: 98 },
    { date: "2024-03-15", weight: 77, neck: 39, waist: 86, hips: 96 },
    { date: "2024-05-01", weight: 75.5, neck: 38, waist: 85, hips: 95 },
];

const initialPhotos: EvolutionPhoto[] = PlaceHolderImages.map((p, index) => ({
  id: p.id,
  date: new Date(2024, 4, 15 + index * 5).toISOString(),
  imageUrl: p.imageUrl,
  imageHint: p.imageHint,
  weight: 80 - index * 0.5,
  width: 1080,
  height: 1350,
}));

// Types
type MealsByVariation = {
    [variationId: string]: Meal[];
}

// App Context
interface AppContextType {
    // Profile
    profile: UserProfile;
    setProfile: (profile: UserProfile) => void;

    // Plans
    plans: Plan[];
    setPlans: (plans: Plan[]) => void;
    activePlan: Plan | undefined;
    setActivePlan: (planId: string) => void;
    updatePlanVariations: (planId: string, newVariations: Variation[]) => void;

    // Dishes
    dishes: Dish[];
    setDishes: (dishes: Dish[]) => void;
    saveDish: (dish: Dish) => void;

    // Measurements
    measurements: BodyMeasurement[];
    setMeasurements: (measurements: BodyMeasurement[]) => void;
    saveMeasurement: (measurement: BodyMeasurement) => void;
    
    // Photos
    photos: EvolutionPhoto[];
    setPhotos: (photos: EvolutionPhoto[]) => void;

    // Meals
    mealsByVariation: MealsByVariation;
    setMealsByVariation: React.Dispatch<React.SetStateAction<MealsByVariation>>;
    activeVariationId: string | undefined;
    setActiveVariationId: React.Dispatch<React.SetStateAction<string | undefined>>;
    todaysMeals: Meal[];
    toggleMealItemEaten: (mealId: string, itemId: string, newEatenState: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [dishes, setDishes] = useState<Dish[]>(initialDishes);
    const [measurements, setMeasurements] = useState<BodyMeasurement[]>(initialMeasurements);
    const [photos, setPhotos] = useState<EvolutionPhoto[]>(initialPhotos);
    
    // Meals State
    const [mealsByVariation, setMealsByVariation] = useState<MealsByVariation>({});
    const activePlan = plans.find(p => p.isActive);
    const [activeVariationId, setActiveVariationId] = useState<string | undefined>(activePlan?.variations[0]?.id);

    // Reset active variation if active plan changes
     useEffect(() => {
        const newActivePlan = plans.find(p => p.isActive);
        if (newActivePlan) {
            // Check if the current active variation belongs to the new active plan
            const variationExistsInNewPlan = newActivePlan.variations.some(v => v.id === activeVariationId);
            if (!variationExistsInNewPlan) {
                setActiveVariationId(newActivePlan.variations[0]?.id);
            }
        } else {
            setActiveVariationId(undefined);
        }
    }, [plans, activeVariationId]);


    const setActivePlan = (planId: string) => {
        const newPlans = plans.map(p => ({ ...p, isActive: p.id === planId }));
        const newActivePlan = newPlans.find(p => p.isActive);
        setPlans(newPlans);
        // Automatically set the first variation of the new active plan as active
        setActiveVariationId(newActivePlan?.variations[0]?.id);
    };

    const updatePlanVariations = (planId: string, newVariations: Variation[]) => {
        const newPlans = plans.map(p => 
            p.id === planId ? { ...p, variations: newVariations } : p
        );
        setPlans(newPlans);
    };

    const saveDish = (dish: Dish) => {
        const index = dishes.findIndex(d => d.id === dish.id);
        if (index > -1) {
            const newDishes = [...dishes];
            newDishes[index] = dish;
            setDishes(newDishes);
        } else {
            setDishes([...dishes, dish]);
        }
    };
    
    const saveMeasurement = (measurement: BodyMeasurement) => {
        const existingIndex = measurements.findIndex(m => new Date(m.date).toDateString() === new Date(measurement.date).toDateString());
        
        let newMeasurements;
        if (existingIndex > -1) {
            newMeasurements = [...measurements];
            newMeasurements[existingIndex] = measurement;
        } else {
            newMeasurements = [...measurements, measurement];
        }
        
        newMeasurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setMeasurements(newMeasurements);
    }
    
    const todaysMeals = activeVariationId ? mealsByVariation[activeVariationId] || [] : [];
    
    const toggleMealItemEaten = (mealId: string, itemId: string, newEatenState: boolean) => {
        if (!activeVariationId) return;

        const currentMeals = mealsByVariation[activeVariationId] || [];
        
        const updatedMeals = currentMeals.map(meal => {
            if (meal.id === mealId) {
                const updatedItems = meal.items.map(item => {
                    if (item.id === itemId) {
                        const updatedItem = { ...item, eaten: newEatenState };
                        if (updatedItem.type === 'dish') {
                            updatedItem.ingredients = updatedItem.ingredients.map(ing => ({...ing, eaten: newEatenState}));
                        }
                        return updatedItem;
                    }
                    return item;
                });
                // Check if all items in meal are eaten to update meal's top-level eaten status
                const allEaten = updatedItems.every(i => i.eaten);
                return { ...meal, items: updatedItems, eaten: allEaten };
            }
            return meal;
        });

        setMealsByVariation(prev => ({
            ...prev,
            [activeVariationId]: updatedMeals,
        }));
    };

    const value = {
        profile, setProfile,
        plans, setPlans, activePlan, setActivePlan, updatePlanVariations,
        dishes, setDishes, saveDish,
        measurements, setMeasurements, saveMeasurement,
        photos, setPhotos,
        mealsByVariation, setMealsByVariation,
        activeVariationId, setActiveVariationId,
        todaysMeals,
        toggleMealItemEaten,
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
