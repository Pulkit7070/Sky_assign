import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-[rgba(30,30,40,0.92)] backdrop-blur-2xl text-white border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/10'
            : 'bg-[rgba(255,255,255,0.92)] backdrop-blur-2xl text-gray-900 border border-gray-300/40 shadow-[0_8px_32px_rgba(0,0,0,0.15)]'
        }`}
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        } as any}
      >
        <div className="prose prose-sm max-w-none">
          {message.role === 'assistant' ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const codeId = `${message.id}-${match?.[1] || 'code'}`;
                  const inline = props.inline;

                  if (!inline && match) {
                    // Highlight code
                    const language = match[1];
                    let highlighted = codeString;
                    
                    try {
                      if (Prism.languages[language]) {
                        highlighted = Prism.highlight(
                          codeString,
                          Prism.languages[language],
                          language
                        );
                      }
                    } catch (e) {
                      console.error('Prism highlighting error:', e);
                    }

                    return (
                      <div className="relative group my-2">
                        <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-xs">
                          <span>{language}</span>
                          <button
                            onClick={() => copyToClipboard(codeString, codeId)}
                            className="hover:text-white transition-colors"
                          >
                            {copiedCode === codeId ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className="mt-0! rounded-t-none! bg-gray-900 overflow-x-auto">
                          <code
                            className={className}
                            dangerouslySetInnerHTML={{ __html: highlighted }}
                            {...props}
                          />
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (href && window.electronAPI?.openExternal) {
                        window.electronAPI.openExternal(href);
                      } else if (href) {
                        window.open(href, '_blank');
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
          )}
        </div>

        {message.status === 'sending' && (
          <div className="flex items-center gap-1 mt-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-current"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-current"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-1.5 h-1.5 rounded-full bg-current"
            />
          </div>
        )}

        {message.status === 'error' && (
          <p className="text-xs text-red-500 mt-1">Failed to send</p>
        )}
      </div>
    </motion.div>
  );
};
