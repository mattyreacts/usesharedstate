import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { useSharedState, getStateValue, setStateValue, clearContext } from "../src";
import React from "react";

function ComponentA(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input data-testid="inputa" value={value} onChange={handleValueChange} />
    );
}

function ComponentB(): React.JSX.Element {
    const [value, setValue] = useSharedState<string>('a', 'VariableA', 'Test');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input data-testid="inputb" value={value} onChange={handleValueChange} />
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

afterEach(cleanup);

test('Varible change propogates between components', () => {
    render(<Container />);
    const inputa = screen.getByTestId(/inputa/i) as HTMLInputElement;
    const inputb = screen.getByTestId(/inputb/i) as HTMLInputElement;
    fireEvent.change(inputa, {target: {value: 'test'}});
    expect(inputb.value).toBe('test');
});

test('Variable change from input propogates to store', () => {
    render(<ComponentA />);
    const inputa = screen.getByTestId(/inputa/i) as HTMLInputElement;
    fireEvent.change(inputa, {target: {value: 'test'}});
    const value = getStateValue('VariableA', 'Test');
    expect(value).toBe('test');
});

test('Variable change from setStateValue propogates to both input fields', () => {
    render(<Container />);
    const inputa = screen.getByTestId(/inputa/i) as HTMLInputElement;
    const inputb = screen.getByTestId(/inputb/i) as HTMLInputElement;
    setStateValue('test', 'VariableA', 'Test');

    expect(inputa.value).toBe('test');
    expect(inputb.value).toBe('test');
});

test('Unmounting container clears context', () => {
    render(<Container />);
    cleanup();

    const value = getStateValue('VariableA', 'Test');
    expect(value).toBeNull();
});

function ComponentC(): React.JSX.Element {
    const [value, setValue] = useSharedState('second context', 'VariableA', 'Test2');
    const handleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <input data-testid="inputc" value={value} onChange={handleValueChange} />
    );
}

test(`Set variables with same name on different context does not change both`, () => {
    render(
        <>
            <Container />
            <ComponentC />
        </>);
    const inputa = screen.getByTestId(/inputa/i) as HTMLInputElement;
    fireEvent.change(inputa, {target: {value: 'test'}});
    const value1 = getStateValue('VariableA', 'Test');
    const value2 = getStateValue('VariableA', 'Test2');

    expect(value1).toBe('test');
    expect(value2).toBe('second context');
});

test(`Clear different context leaves 'Test' context intact`, () => {
    render(
        <>
            <Container />
            <ComponentC />
        </>);
    const value2 = getStateValue('VariableA', 'Test2');
    clearContext('Test2');
    const value1 = getStateValue('VariableA', 'Test');
    const value2cleared = getStateValue('VaribaleA', 'Test2');

    expect(value1).toBe('a');
    expect(value2).toBe('second context');
    expect(value2cleared).toBeNull();
});