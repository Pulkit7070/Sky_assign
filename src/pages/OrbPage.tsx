import React, { useState } from 'react';
import { OrbIcon } from '../components/OrbIcon';

export const OrbPage: React.FC = () => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);

  const handleOrbClick = async () => {
    if (window.electronAPI?.orbClicked) {
      const visible = await window.electronAPI.orbClicked();
      setIsWindowVisible(visible);
    }
  };

  return (
    <div className="w-full h-full bg-transparent">
      <OrbIcon onClick={handleOrbClick} isWindowVisible={isWindowVisible} />
    </div>
  );
};
