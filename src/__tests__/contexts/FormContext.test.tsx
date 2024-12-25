import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from '../../contexts/FormContext';
import { act } from 'react-dom/test-utils';

const TestComponent = () => {
  const { state, updateField, resetForm } = useForm();

  return (
    <div>
      <input
        type="text"
        onChange={(e) => updateField('test', {
          value: e.target.value,
          isValid: e.target.value.length > 0
        })}
        data-testid="input"
      />
      <button onClick={resetForm} data-testid="reset">Reset</button>
      <div data-testid="value">{state.fields.test?.value}</div>
    </div>
  );
};

describe('FormContext', () => {
  it('updates field values', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    await act(async () => {
      const input = screen.getByTestId('input');
      await user.type(input, 'test');
    });

    expect(screen.getByTestId('value')).toHaveTextContent('test');
  });

  it('resets form state', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    await act(async () => {
      const input = screen.getByTestId('input');
      await user.type(input, 'test');
      await user.click(screen.getByTestId('reset'));
    });

    expect(screen.getByTestId('value')).toBeEmptyDOMElement();
  });
});
