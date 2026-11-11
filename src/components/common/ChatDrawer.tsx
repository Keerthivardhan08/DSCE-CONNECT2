import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { X, Send, MessageSquare, ShieldCheck, ShoppingBag } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  itemContext?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  itemContext
}) => {
  const { currentUser, directMessages, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages between currentUser and receiverId
  const conversation = directMessages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === receiverId) ||
         (m.senderId === receiverId && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await sendMessage(receiverId, inputText.trim(), itemContext);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <UserAvatar name={receiverName} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {receiverName}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-[11px] text-slate-400">Verified Campus Peer</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item context banner */}
        {itemContext && (
          <div className="px-4 py-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-300">
            <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate">Regarding: <strong className="font-semibold">{itemContext}</strong></span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {conversation.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No previous messages with {receiverName}.</p>
              <p className="text-[11px]">Send a friendly greeting to initiate peer chat.</p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isMine 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.createdAt?.slice(11, 16) || 'Just now'}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${receiverName}...`}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
