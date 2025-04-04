export function excludeFields<T extends Record<string, unknown>>(
    obj: T,
    fields: string[]
  ): Partial<T> {
  
    
    const result = { ...obj };
  
    fields.forEach(field => {
      if (field in result) {
        delete result[field];
      }
    });
  
    return result;
  }