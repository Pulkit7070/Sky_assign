import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { Message } from '../types';

interface AutoSizingAnswerProps {
  messages: Message[];
  compactWidth: number;
  onHeightMeasured?: (height: number) => void;
}

const MIN_COMPACT_HEIGHT = 180;
const MAX_COMPACT_HEIGHT = 600;

export const AutoSizingAnswer: React.FC<AutoSizingAnswerProps> = ({
  messages,
  compactWidth,
  onHeightMeasured,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(MIN_COMPACT_HEIGHT);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messagePairs = React.useMemo(() => {
    const pairs: Message[][] = [];
    for (let i = 0; i < messages.length; i += 2) {
      const pair = [messages[i]];
      if (messages[i + 1]) pair.push(messages[i + 1]);
      pairs.push(pair);
    }
    return pairs;
  }, [messages]);

  useEffect(() => {
    if (messagePairs.length > 0) {
      setCurrentIndex(messagePairs.length - 1);
    }
  }, [messagePairs.length]);

  const currentPair = messagePairs[currentIndex] || [];

  useEffect(() => {
    if (!currentPair.length) return;

    const measure = () => {
      if (!measureRef.current) return;
      
      const content = measureRef.current.scrollHeight;
      const total = content + 28 + 56 + 24; // header + input + padding
      const height = Math.max(MIN_COMPACT_HEIGHT, Math.min(MAX_COMPACT_HEIGHT, total));

      setMeasuredHeight(height);
      onHeightMeasured?.(height);

      window.electronAPI?.requestResize?.({
        width: compactWidth,
        height,
        anchor: 'bottom',
      });
    };

    requestAnimationFrame(measure);
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [currentIndex, currentPair.length, compactWidth, onHeightMeasured]);

  const handleWheel = (e: React.WheelEvent) => {
    if (messagePairs.length <= 1) return;
    e.preventDefault();
    
    if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (e.deltaY > 0 && currentIndex < messagePairs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const showExpandButton = measuredHeight >= MAX_COMPACT_HEIGHT * 0.85;
  const canScrollUp = currentIndex > 0;
  const canScrollDown = currentIndex < messagePairs.length - 1;

  return (
    <div
      ref={scrollContainerRef}
      onWheel={handleWheel}
      className="flex-1 overflow-y-auto px-3 py-2 min-h-0 bg-white/20 backdrop-blur-sm relative z-10"
      style={{ WebkitAppRegion: 'no-drag' } as any}
    >
      {/* Measurement container */}
      <div ref={measureRef} className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              if (!measureRef.current || !window.electronAPI?.requestResize) return;
              
              const h = measureRef.current.scrollHeight + 108;
              const clamped = Math.max(MIN_COMPACT_HEIGHT, Math.min(MAX_COMPACT_HEIGHT, h));
                
              window.electronAPI.requestResize({
                width: compactWidth,
                height: clamped,
                anchor: 'bottom',
              });
            }}
          >
            {currentPair.map((message, index) => (
              <div key={message.id} className="mb-3 last:mb-0">
                <ChatMessage
                  message={message}
                  isLatest={index === currentPair.length - 1}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Expand CTA for large content */}
      {showExpandButton && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/95 to-transparent flex items-end justify-center pb-2 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              if (window.electronAPI?.toggleWindowMode) {
                await window.electronAPI.toggleWindowMode('expanded');
              }
            }}
            className="px-4 py-1.5 bg-white/90 backdrop-blur-xl border border-sky-accent/30 rounded-lg text-xs font-semibold text-sky-accent shadow-lg pointer-events-auto hover:shadow-sky-hover transition-all"
          >
            ↗ Expand for full view
          </motion.button>
        </div>
      )}

      {/* Scroll indicators */}
      {messagePairs.length > 1 && (
        <>
          {canScrollUp && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/60 to-transparent flex items-start justify-center pt-1 pointer-events-none">
              <span className="text-[10px] text-sky-text-secondary">↑ Scroll up</span>
            </div>
          )}
          {canScrollDown && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/60 to-transparent flex items-end justify-center pb-1 pointer-events-none">
              <span className="text-[10px] text-sky-text-secondary">↓ Scroll down</span>
            </div>
          )}
          <div className="absolute top-2 right-2 text-[10px] text-sky-text-secondary font-medium bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5">
            {currentIndex + 1} / {messagePairs.length}
          </div>
        </>
      )}
    </div>
  );
};
