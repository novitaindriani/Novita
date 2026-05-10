import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, Pharmacist } from '../types';
import { Send, User, Bot, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { WELCOME_MESSAGE } from '../constants';

interface ChatWindowProps {
  currentUser: { id: string; name: string; role: 'patient' | 'pharmacist' };
  selectedPharmacist: Pharmacist;
}

export default function ChatWindow({ currentUser, selectedPharmacist }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const roomId = currentUser.role === 'patient' 
    ? `${currentUser.id}_${selectedPharmacist.id}`
    : `${selectedPharmacist.id}_${currentUser.id}`; // If current user IS the pharmacist, it should match

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    const pid = currentUser.role === 'patient' ? currentUser.id : selectedPharmacist.id; // Correct matching for demo
    const phid = currentUser.role === 'pharmacist' ? currentUser.id : selectedPharmacist.id;

    newSocket.emit('join_chat', { patientId: pid, pharmacistId: phid });

    newSocket.on('chat_history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedPharmacist, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    // Check if pharmacist can reply (based on user story)
    if (currentUser.role === 'pharmacist' && !selectedPharmacist.registered) {
       // This logic is slightly flipped for demo, but basically pharmacist role must be registered
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromPharmacist: currentUser.role === 'pharmacist'
    };

    socket.emit('send_message', { roomId, message: newMessage });
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-bottom border-slate-100 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="relative">
          <img 
            src={selectedPharmacist.avatar} 
            alt={selectedPharmacist.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm leading-none">{selectedPharmacist.name}</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
            {selectedPharmacist.specialization}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50/30">
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 opacity-60">
           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="w-6 h-6" />
           </div>
           <p className="text-xs font-medium text-slate-600 max-w-xs px-6">
              {WELCOME_MESSAGE}
           </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {isMe ? 'Anda' : msg.senderName}
                   </span>
                   <span className="text-[10px] text-slate-300">{msg.timestamp}</span>
                </div>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                  isMe 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
