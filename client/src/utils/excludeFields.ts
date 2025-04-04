export function excludeFields<T extends Record<string, any>>(
    obj: T,
    fields: string[]
  ): Partial<T> {
    console.log("excludeFields - input:", obj);
    console.log("excludeFields - fields to exclude:", fields);
    
    const result = { ...obj };
  
    fields.forEach(field => {
      if (field in result) {
        console.log(`Removing field: ${field}`);
        delete result[field];
      }
    });
  
    console.log("excludeFields - output:", result);
    return result;
  }