export interface BodyCompositionInputs {
    gender: 'male' | 'female';
    height?: number; // in cm
    weight?: number; // in kg
    neck?: number;   // in cm
    waist?: number;  // in cm
    hips?: number;   // in cm, only for female
}

export interface BodyComposition {
    bodyFatPercentage: number;
    fatMass: number;
    leanMass: number;
}

/**
 * Calculates Body Composition using the US Navy method.
 * @param inputs - The user's body measurements.
 * @returns An object with body fat percentage, fat mass, and lean mass, or null if inputs are insufficient.
 */
export function calculateBodyComposition(inputs: BodyCompositionInputs): BodyComposition | null {
    const { gender, height, weight, neck, waist, hips } = inputs;

    if (!height || !weight || !neck || !waist) {
        return null;
    }
    
    let bodyFatPercentage = 0;

    if (gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else { // female
        if (!hips) {
            return null; // Hips are required for female calculation
        }
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    
    if (isNaN(bodyFatPercentage) || !isFinite(bodyFatPercentage) || bodyFatPercentage <= 0) {
        return null;
    }

    const fatMass = (weight * bodyFatPercentage) / 100;
    const leanMass = weight - fatMass;

    return {
        bodyFatPercentage,
        fatMass,
        leanMass,
    };
}
