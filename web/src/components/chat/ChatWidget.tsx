'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, Send, MessageCircle, Loader2, ThumbsUp, ThumbsDown, UserCircle } from 'lucide-react';

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
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [handoffSubmitting, setHandoffSubmitting] = useState(false);
  const [handoffSuccess, setHandoffSuccess] = useState(false);
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

  // Submit handoff request
  const submitHandoff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHandoffSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const conversationContext = messages
        .slice(-4) // Last 4 messages for context
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n\n');

      const response = await fetch('/api/chat/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || undefined,
          topic: formData.get('topic'),
          message: formData.get('message'),
          conversationContext,
          language: locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit handoff');
      }

      setHandoffSuccess(true);
      setTimeout(() => {
        setShowHandoffForm(false);
        setHandoffSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit handoff:', error);
      alert(
        locale === 'de'
          ? 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
          : locale === 'es'
            ? 'Error al enviar. Por favor, inténtelo de nuevo.'
            : 'Failed to submit. Please try again.'
      );
    } finally {
      setHandoffSubmitting(false);
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHandoffForm(true)}
                className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Talk to human"
                title={
                  locale === 'de'
                    ? 'Mit einem Menschen sprechen'
                    : locale === 'es'
                      ? 'Hablar con un humano'
                      : 'Talk to human'
                }
              >
                <UserCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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

      {/* Handoff Form Modal */}
      {showHandoffForm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-xl">
                      {locale === 'de'
                        ? 'Mit einem Menschen sprechen'
                        : locale === 'es'
                          ? 'Hablar con un humano'
                          : 'Talk to a Human'}
                    </h3>
                    <p className="text-sm text-white/80">
                      {locale === 'de'
                        ? 'Wir melden uns bald bei Ihnen'
                        : locale === 'es'
                          ? 'Nos pondremos en contacto pronto'
                          : "We'll get back to you soon"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHandoffForm(false)}
                  className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {handoffSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-success-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900 mb-2">
                    {locale === 'de'
                      ? 'Anfrage gesendet!'
                      : locale === 'es'
                        ? '¡Solicitud enviada!'
                        : 'Request Sent!'}
                  </h4>
                  <p className="text-neutral-600">
                    {locale === 'de'
                      ? 'Unser Team wird sich in Kürze bei Ihnen melden.'
                      : locale === 'es'
                        ? 'Nuestro equipo se pondrá en contacto con usted pronto.'
                        : 'Our team will contact you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={submitHandoff} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="handoff-name" className="block text-sm font-semibold text-neutral-700 mb-2">
                      {locale === 'de' ? 'Name' : locale === 'es' ? 'Nombre' : 'Name'}{' '}
                      <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="handoff-name"
                      name="name"
                      required
                      disabled={handoffSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      placeholder={
                        locale === 'de'
                          ? 'Ihr Name'
                          : locale === 'es'
                            ? 'Su nombre'
                            : 'Your name'
                      }
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="handoff-email" className="block text-sm font-semibold text-neutral-700 mb-2">
                      {locale === 'de' ? 'E-Mail' : locale === 'es' ? 'Correo electrónico' : 'Email'}{' '}
                      <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="handoff-email"
                      name="email"
                      required
                      disabled={handoffSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      placeholder={
                        locale === 'de'
                          ? 'ihre.email@beispiel.de'
                          : locale === 'es'
                            ? 'su.correo@ejemplo.com'
                            : 'your.email@example.com'
                      }
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label htmlFor="handoff-phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                      {locale === 'de' ? 'Telefon' : locale === 'es' ? 'Teléfono' : 'Phone'}{' '}
                      <span className="text-neutral-400 text-xs">
                        ({locale === 'de' ? 'optional' : locale === 'es' ? 'opcional' : 'optional'})
                      </span>
                    </label>
                    <input
                      type="tel"
                      id="handoff-phone"
                      name="phone"
                      disabled={handoffSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Topic */}
                  <div>
                    <label htmlFor="handoff-topic" className="block text-sm font-semibold text-neutral-700 mb-2">
                      {locale === 'de' ? 'Thema' : locale === 'es' ? 'Tema' : 'Topic'}{' '}
                      <span className="text-error-500">*</span>
                    </label>
                    <select
                      id="handoff-topic"
                      name="topic"
                      required
                      disabled={handoffSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {locale === 'de'
                          ? 'Wählen Sie ein Thema'
                          : locale === 'es'
                            ? 'Seleccione un tema'
                            : 'Select a topic'}
                      </option>
                      <option value="technical">
                        {locale === 'de'
                          ? 'Technische Unterstützung'
                          : locale === 'es'
                            ? 'Soporte técnico'
                            : 'Technical Support'}
                      </option>
                      <option value="sales">
                        {locale === 'de'
                          ? 'Verkaufsanfrage'
                          : locale === 'es'
                            ? 'Consulta de ventas'
                            : 'Sales Inquiry'}
                      </option>
                      <option value="quote">
                        {locale === 'de'
                          ? 'Angebotsanfrage'
                          : locale === 'es'
                            ? 'Solicitud de cotización'
                            : 'Quote Request'}
                      </option>
                      <option value="other">
                        {locale === 'de' ? 'Andere' : locale === 'es' ? 'Otro' : 'Other'}
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="handoff-message" className="block text-sm font-semibold text-neutral-700 mb-2">
                      {locale === 'de' ? 'Nachricht' : locale === 'es' ? 'Mensaje' : 'Message'}{' '}
                      <span className="text-error-500">*</span>
                    </label>
                    <textarea
                      id="handoff-message"
                      name="message"
                      required
                      rows={4}
                      disabled={handoffSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        resize-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      placeholder={
                        locale === 'de'
                          ? 'Wie können wir Ihnen helfen?'
                          : locale === 'es'
                            ? '¿Cómo podemos ayudarle?'
                            : 'How can we help you?'
                      }
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowHandoffForm(false)}
                      disabled={handoffSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-neutral-300 
                        text-neutral-700 font-semibold hover:bg-neutral-50 
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {locale === 'de' ? 'Abbrechen' : locale === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={handoffSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 
                        text-white font-semibold transition-colors disabled:opacity-50 
                        disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {handoffSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>
                            {locale === 'de' ? 'Senden...' : locale === 'es' ? 'Enviando...' : 'Sending...'}
                          </span>
                        </>
                      ) : (
                        <span>
                          {locale === 'de' ? 'Senden' : locale === 'es' ? 'Enviar' : 'Send'}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
