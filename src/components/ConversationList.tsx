import React, { useState } from 'react';
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

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = (id: string) => {
    deleteConversation(id);
    setDeletingId(null);
  };

  const cancelDelete = () => {
    setDeletingId(null);
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
            <motion.div
              key={conv.id}
              drag="x"
              dragConstraints={{ left: -80, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  handleDelete(conv.id, {} as any);
                }
              }}
              className="relative"
            >
              {/* Delete button (revealed on swipe) */}
              {deletingId === conv.id ? (
                <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-4 gap-2">
                  <button
                    onClick={() => confirmDelete(conv.id)}
                    className="text-white text-xs font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
              )}

              {/* Conversation item */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => setCurrentConversation(conv.id)}
                className={`relative bg-white/60 px-4 py-3 cursor-pointer border-b border-sky-border transition-colors ${
                  currentConversationId === conv.id ? 'bg-sky-accent/10' : ''
                }`}
              >
                <h3 className="text-sm font-medium text-sky-text truncate mb-1">
                  {conv.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-sky-text-secondary">
                    {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-sky-text-secondary">
                    {formatTimestamp(conv.updatedAt)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
