import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '../helpers/themeContext';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Используйте useTheme внутри ThemeProvider');
  }
  return context;
};