import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Send, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import petkoAvatar from '@/assets/petko-avatar.png';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  choices?: string[];
};

const PetkoAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
  return <img src={petkoAvatar} alt="Peťko" className={`${sizeClass} rounded-full object-cover`} />;
};

const PetkoAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const visitedPages = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/petko-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  const sendMessage = useCallback(async (userMessage: string, isFirstVisit = false) => {
    setIsLoading(true);
    
    const newMessages = isFirstVisit
      ? []
      : [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user' as const, content: userMessage }];

    if (!isFirstVisit) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }

    try {
      const { data, error } = await supabase.functions.invoke('petko-chat', {
        body: {
          messages: newMessages.length > 0 ? newMessages : undefined,
          currentPage: location.pathname,
          isFirstVisit,
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message || 'Ahoj! Som Peťko.',
        choices: data.choices || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
      speak(assistantMessage.content);
    } catch (error) {
      console.error('Chat error:', error);
      const fallback: ChatMessage = {
        role: 'assistant',
        content: 'Ahoj! Som Peťko, tvoj sprievodca v Koliesku. Ako ti môžem pomôcť?',
        choices: ['Denné menu', 'E-shop', 'Rezervácia akcie'],
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, location.pathname, speak]);

  // First visit greeting
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      sendMessage('', true);
    }
  }, [isOpen, hasGreeted, sendMessage]);

  // Page change intro
  useEffect(() => {
    if (isOpen && hasGreeted && !visitedPages.current.has(location.pathname)) {
      visitedPages.current.add(location.pathname);
      if (messages.length > 0) {
        sendMessage(`Prešiel som na stránku ${location.pathname}`, false);
      }
    }
  }, [location.pathname, isOpen, hasGreeted]);

  const handleChoiceClick = (choice: string) => {
    sendMessage(choice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setShowPulse(false);
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-hsl(var(--destructive)) scale-90'
            : 'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(40,90%,40%)]'
        }`}
        style={{
          background: isOpen
            ? 'hsl(0, 72%, 51%)'
            : 'linear-gradient(135deg, hsl(40,82%,52%), hsl(40,90%,38%))',
        }}
        aria-label={isOpen ? 'Zavrieť Peťka' : 'Otvoriť Peťka'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <PetkoAvatar size="lg" />
        )}
        {showPulse && !isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[hsl(var(--primary))]/30 pointer-events-none" />
        )}
      </button>

      {/* Greeting tooltip */}
      {!isOpen && showPulse && (
        <div className="fixed bottom-24 right-4 z-50 bg-[hsl(var(--card))] border border-[hsl(var(--primary))]/30 text-[hsl(var(--foreground))] px-4 py-3 rounded-2xl rounded-br-sm shadow-xl max-w-[220px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-sm font-medium">Ahoj! Som Peťko 👋</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Klikni a pomôžem ti!</p>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] bg-[hsl(var(--card))] border border-[hsl(var(--primary))]/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[hsl(var(--primary))]/10 to-transparent">
            <div className="relative">
              <PetkoAvatar size="md" />
              {isSpeaking && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(var(--card))] animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Peťko</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {isSpeaking ? 'Hovorím...' : isLoading ? 'Premýšľam...' : 'Online'}
              </p>
            </div>
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={voiceEnabled ? 'Vypnúť hlas' : 'Zapnúť hlas'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-[hsl(var(--primary))]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              )}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[50vh]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <span className="shrink-0 mt-1"><PetkoAvatar size="sm" /></span>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm'
                        : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {/* Choices */}
                  {msg.role === 'assistant' && msg.choices && msg.choices.length > 0 && i === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.choices.map((choice, j) => (
                        <button
                          key={j}
                          onClick={() => handleChoiceClick(choice)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-start">
                <PetkoAvatar size="sm" />
                <div className="bg-[hsl(var(--secondary))] rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Napíš Peťkovi..."
              className="flex-1 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] text-sm px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-[hsl(var(--primary))]/50 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PetkoAssistant;
