import { useContext } from "react";
import { createContext, type Dispatch, type SetStateAction } from "react";
import {type ProviderProps} from '@react-spectrum/s2';

export type ThemeOptions = Exclude<ProviderProps['colorScheme'], undefined>

export type ThemeContextType = {
  theme: ThemeOptions,
  setTheme: Dispatch<SetStateAction<ThemeOptions>>
}

export const themeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(themeContext);
  if (context === null) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }

  return context;
};
