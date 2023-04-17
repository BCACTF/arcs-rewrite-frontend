import { useEffect, useState } from "react";


const useStorage = <T>(storageKey: string, init: () => T): [T | undefined, (_: T) => void] => {
    const [currVal, setNewStateVal] = useState<T>();
    
    const onClient = typeof window !== "undefined";

    useEffect(() => {
        if (onClient && currVal !== undefined) {
            localStorage.setItem(storageKey, JSON.stringify(currVal));
        }
    }, [currVal, storageKey, onClient]);
    useEffect(() => {
        if (onClient && !currVal) {
            const value = localStorage.getItem(storageKey);
            if (value) setNewStateVal(JSON.parse(value));
            else setNewStateVal(init());
        }
    }, [onClient, storageKey, init, currVal]);

    return [currVal, setNewStateVal];
};

export default useStorage;
