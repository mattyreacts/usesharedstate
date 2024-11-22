import { useState, useEffect, useCallback } from 'react';
import EventEmitter from 'events';

interface SharedStateStore {
    [index: string]: {
        [index: string]: {
            emitter: EventEmitter,
            value: any
        }
    }
}

const state: SharedStateStore = {};
/**
 * React hook to share state values across multiple components
 * @param initalState The inital value of the state variable
 * @param key The name of the variable
 * @param context a named context for partitioning shared state in the application
 * @returns value and setter
 */
export function useSharedState<T = string>(initalState: T, key: string, context: string = 'default'): [T, (value: T) => void] {
    if (!state[context])
        state[context] = {};
    if (!state[context][key]) {
        state[context][key] = {
            emitter: new EventEmitter(),
            value: initalState
        };
    }

    const [value, setValue] = useState<T>(state[context][key].value);

    useEffect((): undefined | (() => void) => {
        if(!state[context] || !state[context][key])
            return;
        const emitter = state[context][key].emitter;
        emitter.on('change', setValue);
        return () => emitter.off('change', setValue);
    }, []);

    const _setValue = useCallback((value: T) => {
        if(!state[context] || !state[context][key])
            return;
        if(state[context][key].value === value)
            return;
        state[context][key].value = value;

        const emitter = state[context][key].emitter;
        emitter.emit('change', value);
    }, []);

    return [value, _setValue];
}

/**
 * Gets the current value of a state variable
 * @param key The name of the variable
 * @param context The context the varible exists in
 * @returns The value
 */
export function getStateValue<T = string>(key: string, context: string = 'default'): T {
    if(!state[context])
        return null!;

    if(!state[context][key])
        return null!;

    return state[context][key].value;
}

/**
 * Sets a value in the shared state
 * @param value The value to set the variable to
 * @param key The name of the variable
 * @param context The context the varible exists in
 */
export function setStateValue<T = string>(value: T, key: string, context: string = 'default'): void {
    if(!state[context] || !state[context][key])
        return;
    if(state[context][key].value === value)
        return;
    state[context][key].value = value;

    const emitter = state[context][key].emitter;
    emitter.emit('change', value);
}

/**
 * Cleans all variable from a context
 * @param context The context to clear
 */
export function clearContext(context: string = 'default'): void {
    if(!state[context])
        return;

    const keys = Object.keys(state[context]);
    keys.map(key => {
        state[context][key].emitter = null!;
        state[context][key].value = null;
        delete state[context][key];
    });

    delete state[context];
}