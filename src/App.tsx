import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { FloatingWindow } from '@/components/FloatingWindow';
import { ExpandedWindow } from '@/components/ExpandedWindow';
import { OrbPage } from '@/pages/OrbPage';

function App() {
  const { windowMode, setWindowMode, preferences } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isOrbMode, setIsOrbMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Apply theme to document root
    const applyTheme = () => {
      const root = document.documentElement;
      let theme = preferences.theme;

      if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      root.setAttribute('data-theme', theme);
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preferences.theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme]);

  useEffect(() => {
    setIsMounted(true);
    
    const hash = window.location.hash;
    if (hash === '#/orb') {
      setIsOrbMode(true);
      return;
    }

    if (window.electronAPI) {
      const unsubscribe = window.electronAPI.onWindowModeChanged((mode) => {
        setWindowMode(mode);
      });

      window.electronAPI.getWindowMode().then((mode) => {
        setWindowMode(mode);
      });

      return unsubscribe;
    }
  }, [setWindowMode]);

  if (!isMounted) {
    return null;
  }

  if (isOrbMode) {
    return <OrbPage />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {windowMode === 'compact' ? (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <FloatingWindow />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <ExpandedWindow />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
