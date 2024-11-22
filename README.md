# useSharedState
## Description
An easy to use React hook to share state variables across components in the tree.
The hook returns a value and a setter the same as the useState hook.
Contexts can be specified to partition the state varibales.

## Installation
`npm install @mattyreacts/usesharedstate`

## API
### useSharedState<T = string>(initialState: T, key: string, context: string = 'default')
The hook to use to access the shared variable and to use for state changes

#### Parameters
| Name         | Type      | Description                                                                                                                             | Required | Default   |
|--------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|-----------|
| initialState | &lt;T&gt; | The initial value to set the variable to. If this variable has already been set by a previous component then this is ignored.           | Yes      | -         |
| key          | string    | The name of the variable in the shared context.                                                                                         | Yes      | -         |
| context      | string    | The name of the context to partition the shared state variables.                                                                        | No       | 'default' |

#### Returns
[value: T, (value: T) => void]

#### Example
ComponentA and ComponentB share a state value. Updating one will change the other.
```ts
import { useSharedState } from "@mattyreacts/usesharedstate";
import React from "react";
import { createRoot } from 'react-dom/client';

function ComponentA(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input value={value} onChange={handleValueChange} />
    );
}

function ComponentB(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input value={value} onChange={handleValueChange} />
    );
}

function Container(): React.JSX.Element {
    React.useEffect(() => {
        return () => clearContext('Test');
    }, []);

    return (
        <>
            <ComponentA />
            <ComponentB />
        </>
    );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<Container />);
```

An array with two values.
1. The current state value
2. A setter function to change the state value and trigger a rerender on all componentst that share the state value

### getStateValue<T = string>(key: string, context: string = 'default'): T
A function to get a state value without needing a React component. Useful for retrieving values from a form for example, then uploading the values using a fetch call.

#### Parameters
| Name    | Type   | Description                                                      | Required | Default   |
|---------|--------|------------------------------------------------------------------|----------|-----------|
| key     | string | The name of the variable in the shared context.                  | Yes      | -         |
| context | string | The name of the context to partition the shared state variables. | No       | 'default' |

#### Returns
value: T
The state value of the shared variable

#### Example
Clicking the button logs the current input value to the console
```ts
import { useSharedState, getStateValue } from "@mattyreacts/usesharedstate";
import React from "react";
import { createRoot } from 'react-dom/client';

function ComponentA(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input value={value} onChange={handleValueChange} />
    );
}

function Container(): React.JSX.Element {
    React.useEffect(() => {
        return () => clearContext('Test');
    }, []);

    const handleClick = React.useCallback(() => {
        const value = getStateValue('VariableA', 'Test');
        console.log(value);
    }, []);

    return (
        <>
            <ComponentA />
            <input type="button" onClick={handleClick} value="Click" />
        </>
    );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<Container />);
```

### setStateValue<T = string>(value: T, key: string, context: string = 'default')
A function to be able to set a shared state value and trigger a rerender on all components that use the shared value.

**NB:** using a key and context pair that has not been created by a component will have no effect. That is, you can only set the value of shared state variables that have already been initialised.

#### Parameters
| Name    | Type      | Description                                                      | Required | Default   |
|---------|-----------|------------------------------------------------------------------|----------|-----------|
| value   | &lt;T&gt; | The value to set the shared variable to.                         | Yes      | -         |
| key     | string    | The name of the variable in the shared context.                  | Yes      | -         |
| context | string    | The name of the context to partition the shared state variables. | No       | 'default' |

#### Example
Clicking the button sets the shared state value to 'test' and updates both inputs
```ts
import { useSharedState, setStateValue } from "@mattyreacts/usesharedstate";
import React from "react";
import { createRoot } from 'react-dom/client';

function ComponentA(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input value={value} onChange={handleValueChange} />
    );
}

function ComponentB(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input value={value} onChange={handleValueChange} />
    );
}

function Container(): React.JSX.Element {
    React.useEffect(() => {
        return () => clearContext('Test');
    }, []);

    const handleClick = React.useCallback(() => {
        setStateValue('test', 'VariableA', 'Test');
    }, []);

    return (
        <>
            <ComponentA />
            <ComponentB />
            <input type="button" onClick={handleClick} value="Click" />
        </>
    );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<Container />);
```