export function deepRemoveEmpty(obj: Record<string, any>): Record<string, any> {
    console.log("deepRemoveEmpty - input:", obj);
    
    const result: Record<string, any> = Array.isArray(obj) ? [] as unknown as Record<string, any> : {};
    
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      
      const value = obj[key];
      
      // Skip if value is null or undefined
      if (value === null || value === undefined) {
        console.log(`Skipping null/undefined value for key: ${key}`);
        continue;
      }
      
      // Recursively clean objects and arrays
      if (typeof value === 'object') {
        const cleanedValue = deepRemoveEmpty(value);
        // Only add if the cleaned object/array isn't empty
        if (Object.keys(cleanedValue).length > 0) {
          result[key] = cleanedValue;
        } else {
          console.log(`Skipping empty object/array for key: ${key}`);
        }
      } 
      // Add primitive values
      else {
        result[key] = value;
      }
    }
    
    console.log("deepRemoveEmpty - output:", result);
    return result;
  }