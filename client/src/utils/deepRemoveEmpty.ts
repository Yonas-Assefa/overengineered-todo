export function deepRemoveEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => 
            typeof item === 'object' ? deepRemoveEmpty(item as Record<string, unknown>) : item
        ) as unknown as T;
    }

    const result: Partial<T> = {};
    
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        
        // Skip if value is null or undefined
        if (value === null || value === undefined) {
            continue;
        }
        
        // Recursively clean objects and arrays
        if (typeof value === 'object') {
            const cleanedValue = deepRemoveEmpty(value as Record<string, unknown>);
            // Only add if the cleaned object/array isn't empty
            if (Object.keys(cleanedValue).length > 0) {
                result[key as keyof T] = cleanedValue as T[keyof T];
            }
        } 
        // Add primitive values
        else {
            result[key as keyof T] = value as T[keyof T];
        }
    }
    
    return result;
}