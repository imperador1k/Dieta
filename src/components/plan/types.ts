export interface Plan {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    targets: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    variations: {
        id: string;
        name: string;
    }[];
}
