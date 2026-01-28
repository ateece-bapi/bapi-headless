'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, Send, MessageCircle, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  conversationId?: string; // For tracking feedback
  feedbackGiven?: 'positive' | 'negative';
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const locale = useLocale();

  // Convert markdown links to HTML
  const renderMessageContent = (content: string) => {
    // Convert markdown links [text](url) to HTML links
    const withLinks = content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary-500 hover:text-primary-600 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    return <span dangerouslySetInnerHTML={{ __html: withLinks }} />;
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            locale === 'de'
              ? 'Hallo! Ich bin der BAPI-Assistent. Wie kann ich Ihnen bei HVAC-Sensoren und Gebäudeautomation helfen?'
              : locale === 'es'
                ? '¡Hola! Soy el asistente de BAPI. ¿Cómo puedo ayudarle con sensores HVAC y automatización de edificios?'
                : locale === 'fr'
                  ? 'Bonjour! Je suis l\'assistant BAPI. Comment puis-je vous aider avec les capteurs CVC et l\'automatisation des bâtiments?'
                  : locale === 'ja'
                    ? 'こんにちは！BAPIアシスタントです。HVACセンサーとビルオートメーションについてどのようにお手伝いできますか？'
                    : locale === 'zh'
                      ? '您好！我是BAPI助手。我如何帮助您了解HVAC传感器和楼宇自动化？'
                      : locale === 'vi'
                        ? 'Xin chào! Tôi là trợ lý BAPI. Tôi có thể giúp gì cho bạn về cảm biến HVAC và tự động hóa tòa nhà?'
                        : locale === 'ar'
                          ? 'مرحباً! أنا مساعد BAPI. كيف يمكنني مساعدتك بشأن أجهزة استشعار التدفئة والتهوية وتكييف الهواء وأتمتة المباني؟'
                          : 'Hello! I\'m the BAPI Assistant. How can I help you with HVAC sensors and building automation products?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, locale, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        conversationId: data.conversationId, // Store for feedback
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          locale === 'de'
            ? 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
            : locale === 'es'
              ? 'Lo siento, ocurrió un error. Por favor, inténtelo de nuevo.'
              : locale === 'fr'
                ? 'Désolé, une erreur s\'est produite. Veuillez réessayer.'
                : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Submit feedback for a message
  const submitFeedback = async (
    message: Message,
    feedback: 'positive' | 'negative'
  ) => {
    if (!message.conversationId) return;

    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: message.conversationId,
          feedback,
        }),
      });

      // Update message to show feedback was given
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === message.conversationId
            ? { ...msg, feedbackGiven: feedback }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-modal
            bg-primary-500 hover:bg-primary-600 text-white
            w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-base hover:scale-110
            focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-modal
          w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]
          bg-white rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
          border border-neutral-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">BAPI Assistant</h3>
                <p className="text-sm text-white/80">Technical Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-neutral-900 border border-neutral-200'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {renderMessageContent(message.content)}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-neutral-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Feedback buttons for assistant messages */}
                {message.role === 'assistant' && message.conversationId && (
                  <div className="flex items-center gap-2 mt-2 px-2">
                    <button
                      onClick={() => submitFeedback(message, 'positive')}
                      disabled={!!message.feedbackGiven}
                      className={`p-1.5 rounded-lg transition-colors ${
                        message.feedbackGiven === 'positive'
                          ? 'bg-green-100 text-green-600'
                          : 'hover:bg-neutral-200 text-neutral-500 hover:text-green-600'
                      } disabled:opacity-50`}
                      aria-label="Helpful"
                      title="This was helpful"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => submitFeedback(message, 'negative')}
                      disabled={!!message.feedbackGiven}
                      className={`p-1.5 rounded-lg transition-colors ${
                        message.feedbackGiven === 'negative'
                          ? 'bg-red-100 text-red-600'
                          : 'hover:bg-neutral-200 text-neutral-500 hover:text-red-600'
                      } disabled:opacity-50`}
                      aria-label="Not helpful"
                      title="This wasn't helpful"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    {message.feedbackGiven && (
                      <span className="text-xs text-neutral-500 ml-1">
                        {locale === 'de'
                          ? 'Danke für Ihr Feedback!'
                          : locale === 'es'
                            ? '¡Gracias por tu opinión!'
                            : locale === 'fr'
                              ? 'Merci pour votre avis!'
                              : 'Thanks for your feedback!'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-neutral-200">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  locale === 'de'
                    ? 'Nachricht eingeben...'
                    : locale === 'es'
                      ? 'Escribe un mensaje...'
                      : locale === 'fr'
                        ? 'Tapez un message...'
                        : 'Type a message...'
                }
                className="flex-1 resize-none rounded-xl border border-neutral-300 
                  px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 
                  focus:border-transparent max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 
                  text-white rounded-xl p-3 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
