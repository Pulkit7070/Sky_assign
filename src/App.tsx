import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { FloatingWindow } from '@/components/FloatingWindow';
import { ExpandedWindow } from '@/components/ExpandedWindow';

function App() {
  const { windowMode, setWindowMode } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Listen for window mode changes from main process
    if (window.electronAPI) {
      const unsubscribe = window.electronAPI.onWindowModeChanged((mode) => {
        setWindowMode(mode);
      });

      // Sync initial window mode
      window.electronAPI.getWindowMode().then((mode) => {
        setWindowMode(mode);
      });

      return unsubscribe;
    }
  }, [setWindowMode]);

  // Prevent flash of wrong content
  if (!isMounted) {
    return null;
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
