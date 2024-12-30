import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from '../../contexts/FormContext';
import { act } from 'react-dom/test-utils';

const TestComponent = () => {
  const { state, updateField, resetForm } = useForm();

  return (
    <div>
      <button 
        onClick={() => updateField('testField', { value: 'test', isValid: true })}
        data-testid="update-button"
      >
        Update Field
      </button>
      <button 
        onClick={resetForm}
        data-testid="reset-button"
      >
        Reset Form
      </button>
      <div data-testid="form-state">{JSON.stringify(state)}</div>
    </div>
  );
};

describe('FormContext', () => {
  it('provides initial state', () => {
    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      fields: {},
      isValid: false,
      isSubmitting: false,
    });
  });

  it('updates field state', () => {
    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    act(() => {
      screen.getByTestId('update-button').click();
    });

    const state = JSON.parse(screen.getByTestId('form-state').textContent || '{}');
    expect(state.fields.testField).toEqual({
      value: 'test',
      isValid: true,
    });
  });

  it('resets form state', () => {
    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    act(() => {
      screen.getByTestId('update-button').click();
    });

    act(() => {
      screen.getByTestId('reset-button').click();
    });

    const state = JSON.parse(screen.getByTestId('form-state').textContent || '{}');
    expect(state).toEqual({
      fields: {},
      isValid: false,
      isSubmitting: false,
    });
  });
});
