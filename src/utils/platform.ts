export const getPlatformModifierKey = async (): Promise<string> => {
  if (typeof window !== 'undefined' && window.electronAPI) {
    const platform = await window.electronAPI.getPlatform();
    return platform === 'darwin' ? 'Cmd' : 'Ctrl';
  }
  return 'Ctrl';
};

export const isMac = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && window.electronAPI) {
    const platform = await window.electronAPI.getPlatform();
    return platform === 'darwin';
  }
  return false;
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

export const sanitizeText = (text: string): string => {
  // Remove rich text formatting when pasting
  return text.replace(/<[^>]*>/g, '').trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
