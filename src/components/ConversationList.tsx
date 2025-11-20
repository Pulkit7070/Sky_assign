import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { formatTimestamp } from '@/utils/platform';

export const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation,
    addConversation,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDeletingId(null);
      }
    };

    if (deletingId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [deletingId]);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this conversation?')) {
      deleteConversation(id);
      setDeletingId(null);
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id === deletingId ? null : id);
  };

  return (
    <div className="w-64 h-full bg-white/50 backdrop-blur-md border-r border-sky-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sky-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-sky-text">Conversations</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addConversation}
            className="w-6 h-6 rounded-full bg-sky-accent text-white flex items-center justify-center text-lg"
          >
            +
          </motion.button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/60 border border-sky-border outline-none focus:border-sky-accent transition-colors"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-sky-text-secondary">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div key={conv.id} className="relative" style={{ zIndex: deletingId === conv.id ? 1000 : 1 }}>
              {/* Conversation item */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
                onClick={() => setCurrentConversation(conv.id)}
                className={`relative backdrop-blur-md px-4 py-3 cursor-pointer border-b border-sky-border/50 transition-all group ${
                  currentConversationId === conv.id 
                    ? 'bg-gradient-to-r from-sky-accent/15 to-sky-accent-light/15 border-l-2 border-l-sky-accent' 
                    : 'bg-white/60 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-sky-text truncate mb-1">
                      {conv.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-sky-text-secondary">
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-sky-text-tertiary">
                        {formatTimestamp(conv.updatedAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Three-dot menu */}
                  <div className="relative" ref={deletingId === conv.id ? menuRef : null}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleMenu(conv.id, e)}
                      className="p-1.5 rounded-lg hover:bg-sky-accent/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4 text-sky-text-secondary" fill="currentColor" viewBox="0 0 16 16">
                        <circle cx="2" cy="8" r="1.5" />
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="14" cy="8" r="1.5" />
                      </svg>
                    </motion.button>
                    
                    {/* Dropdown menu */}
                    {deletingId === conv.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl rounded-lg shadow-sky-lg border border-sky-border/50 py-1 min-w-[120px]"
                        style={{ zIndex: 9999 }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conv.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-sky-error hover:bg-sky-error/10 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
