import { createContext } from 'react';

type RadioButtonContextProps =
  | undefined
  | {
      onChange(newValue: string): void;
      groupValue: string;
    };

export const RadioButtonContext = createContext<RadioButtonContextProps>(
  undefined
);
