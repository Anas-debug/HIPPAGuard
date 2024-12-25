import React, { createContext, useContext, useReducer } from 'react';
import { FormState, FormField } from '../types';

interface FormContextType {
  state: FormState;
  updateField: (name: string, field: Partial<FormField>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

type FormAction =
  | { type: 'UPDATE_FIELD'; payload: { name: string; field: Partial<FormField> } }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  fields: {},
  isValid: false,
  isSubmitting: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      const updatedFields = {
        ...state.fields,
        [action.payload.name]: {
          ...state.fields[action.payload.name],
          ...action.payload.field,
        },
      };
      return {
        ...state,
        fields: updatedFields,
        isValid: Object.values(updatedFields).every((field) => field.isValid),
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const updateField = (name: string, field: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { name, field } });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  return (
    <FormContext.Provider value={{ state, updateField, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
