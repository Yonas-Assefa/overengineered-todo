export function deepRemoveEmpty(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = Array.isArray(obj) ? [] as unknown as Record<string, any> : {};
    
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      
      const value = obj[key];
      
      // Skip if value is null or undefined
      if (value === null || value === undefined) {
        continue;
      }
      
      // Recursively clean objects and arrays
      if (typeof value === 'object') {
        const cleanedValue = deepRemoveEmpty(value);
        // Only add if the cleaned object/array isn't empty
        if (Object.keys(cleanedValue).length > 0) {
          result[key] = cleanedValue;
        }
      } 
      // Add primitive values
      else {
        result[key] = value;
      }
    }
    
    return result;
  }