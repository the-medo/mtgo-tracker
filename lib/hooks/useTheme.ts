import { useCallback, useMemo } from 'react';
import useStore from '@/store/store';
import { Theme } from '@/store/appSlice';

const useTheme = () => {
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);
  const toggleTheme = useCallback(() => {
    if (theme === Theme.LIGHT) {
      setTheme(Theme.DARK);
    } else if (theme === Theme.DARK) {
      setTheme(Theme.LIGHT);
    }
  }, [theme, setTheme]);

  return useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);
};

export default useTheme;
