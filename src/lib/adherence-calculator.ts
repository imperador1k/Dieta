import { collection, query, where, getDocs, orderBy, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Meal } from '@/lib/types';

export interface AdherenceDataPoint {
  date: string;
  calories: number;
  target: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Calculate adherence data for a date range
 * @param userId The user ID
 * @param variationId The plan variation ID
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @param dailyTarget The daily nutritional targets
 * @returns Array of adherence data points
 */
export async function calculateAdherenceData(
  userId: string,
  variationId: string,
  startDate: Date,
  endDate: Date,
  dailyTarget: { calories: number; protein: number; carbs: number; fat: number }
): Promise<AdherenceDataPoint[]> {
  const adherenceData: AdherenceDataPoint[] = [];
  
  // Initialize Firebase and get Firestore instance
  const { firestore } = initializeFirebase();
  
  // Create an array of dates between start and end date
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // For each date, fetch meals and calculate consumption
  for (const date of dates) {
    try {
      // Query meals for this specific date and variation
      const mealsCollection = collection(firestore, `users/${userId}/dailyLogs/${variationId}/meals`);
      const mealsQuery = query(
        mealsCollection,
        where('date', '==', date),
        orderBy('createdAt')
      );
      
      const mealsSnapshot = await getDocs(mealsQuery);
      const meals: Meal[] = [];
      
      mealsSnapshot.forEach((doc) => {
        meals.push({ id: doc.id, ...doc.data() } as Meal);
      });
      
      // If no meals found with date field, try to get today's meals from the current variation
      // This is a fallback for when meals don't have a date field yet
      if (meals.length === 0 && date === new Date().toISOString().split('T')[0]) {
        // In this case, we would get today's meals from the context
        // But since we can't access context here, we'll just return empty data
        // In a real implementation, you'd pass today's meals as a parameter
      }
      
      // Calculate total consumption for this day
      const consumption = calculateDailyConsumption(meals);
      
      // Add data point
      adherenceData.push({
        date,
        calories: consumption.calories,
        target: dailyTarget.calories,
        protein: consumption.protein,
        carbs: consumption.carbs,
        fat: consumption.fat
      });
    } catch (error) {
      console.error(`Error fetching meals for date ${date}:`, error);
      // Add a data point with zero values if there was an error
      adherenceData.push({
        date,
        calories: 0,
        target: dailyTarget.calories,
        protein: 0,
        carbs: 0,
        fat: 0
      });
    }
  }
  
  return adherenceData;
}

/**
 * Calculate total consumption from meals
 * @param meals Array of meals
 * @returns Total consumption values
 */
function calculateDailyConsumption(meals: Meal[]) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  meals.forEach(meal => {
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
            if (ingredient.eaten) {
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
}