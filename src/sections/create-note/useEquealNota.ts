const useEqualNota = () => {
  const isObject = (obj: any) => obj != null && typeof obj === "object";

  const deepEqual = (obj1: any, obj2: any) => {
    if (obj1 === obj2) {
      return true;
    }

    if (isObject(obj1) && isObject(obj2)) {
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < obj1.length; i++) {
          if (!deepEqual(obj1[i], obj2[i])) return false;
        }
        return true;
      }

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) {
        return false;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys1) {
        if (!keys2.includes(key)) {
          return false;
        }

        if (!deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  return {
    deepEqual,
  };
};

export default useEqualNota;
