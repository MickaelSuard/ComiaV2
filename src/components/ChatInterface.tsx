import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Sparkles, MessageSquare, Plus, Search, Trash2, Calendar, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Introduction à l\'IA',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'Bonjour ! Je suis votre assistant IA intelligent. Je peux vous aider avec vos questions, analyser des documents, et bien plus encore. Comment puis-je vous assister aujourd\'hui ?',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: '2',
          type: 'user',
          content: 'Peux-tu m\'expliquer le machine learning ?',
          timestamp: new Date(Date.now() - 86300000),
        },
        {
          id: '3',
          type: 'assistant',
          content: 'Le machine learning est une branche de l\'intelligence artificielle qui permet aux machines d\'apprendre automatiquement à partir de données sans être explicitement programmées pour chaque tâche...',
          timestamp: new Date(Date.now() - 86200000),
        }
      ],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86200000),
    },
    {
      id: '2',
      title: 'Optimisation base de données',
      messages: [
        {
          id: '4',
          type: 'user',
          content: 'Comment optimiser une base de données MySQL ?',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '5',
          type: 'assistant',
          content: 'Voici plusieurs stratégies pour optimiser une base de données MySQL : 1. Indexation appropriée, 2. Optimisation des requêtes, 3. Configuration du serveur...',
          timestamp: new Date(Date.now() - 3500000),
        }
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3500000),
    }
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nouvelle conversation',
      messages: [
        {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      setCurrentConversationId(remaining[0]?.id || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !currentConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Ajouter le message utilisateur
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            title: conv.messages.length === 1 ? inputValue.slice(0, 50) + '...' : conv.title
          }
        : conv
    ));

    setInputValue('');
    setIsLoading(true);

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const responses = [
        'Excellente question ! Voici une analyse détaillée de votre demande...',
        'Je comprends votre besoin. Permettez-moi de vous expliquer les différentes approches possibles...',
        'C\'est un sujet fascinant ! Voici ce que je peux vous dire à ce sujet...',
        'Parfait ! Je vais vous guider étape par étape pour résoudre ce problème...'
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + ' Dans une implémentation réelle, cette réponse serait générée par votre modèle IA backend.',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiMessage],
              updatedAt: new Date()
            }
          : conv
      ));
      
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const quickPrompts = [
    "Explique-moi le machine learning",
    "Comment optimiser une base de données ?",
    "Rédige un email professionnel",
    "Analyse ce code Python"
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Conversation</h2>
            <p className="text-emerald-100 text-sm">
              {currentConversation ? currentConversation.title : 'Sélectionnez une conversation'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1">
        {/* Sidebar - Historique des conversations */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans l'historique..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="px-4 pb-4">
            <button
              onClick={createNewConversation}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouvelle conversation
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Aucune conversation trouvée</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm'
                      : 'hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setCurrentConversationId(conversation.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold text-sm truncate flex-1 ${
                      currentConversationId === conversation.id ? 'text-emerald-800' : 'text-gray-900'
                    }`}>
                      {conversation.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs ${
                    currentConversationId === conversation.id ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>{conversation.updatedAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{conversation.messages.length} messages</span>
                  </div>
                  
                  {conversation.messages.length > 1 && (
                    <p className={`text-xs mt-2 truncate ${
                      currentConversationId === conversation.id ? 'text-emerald-700' : 'text-gray-600'
                    }`}>
                      {conversation.messages[conversation.messages.length - 1].content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className={`group relative ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-6 py-4 rounded-2xl shadow-sm ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                        
                        {message.type === 'assistant' && (
                          <div className="opacity-0 group-hover:opacity-100 absolute top-2 -right-20 flex gap-1 transition-opacity duration-200">
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copier"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-500 transition-colors"
                              title="J'aime"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                              title="Je n'aime pas"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <div className={`text-xs text-gray-400 mt-2 flex items-center gap-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-emerald-50 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-4">💡 Suggestions rapides :</p>
                  <div className="flex flex-wrap gap-3">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(prompt)}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 text-sm rounded-full border border-gray-200 hover:border-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Mode :</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200 hover:bg-emerald-200 transition-colors">
                      💬 Conversation
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                      🔍 Recherche
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                      ✏️ Correction
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white border-t border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Posez votre question..."
                      className="w-full bg-gray-50 text-gray-900 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all border border-gray-200"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-gray-500 text-sm mt-2">
                  Choisissez une conversation dans l'historique ou créez-en une nouvelle
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;