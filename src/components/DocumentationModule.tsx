import React, { useState } from 'react';
import { Upload, FileText, MessageCircle, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  pages: number;
  uploadDate: string;
  status: 'en cours' | 'complété' | 'erreur';
  summary?: string;
  chatHistory: Array<{
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
    pageRef?: number;
  }>;
}

export default function DocumentationModule() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Rapport_Annuel_2024.pdf',
      size: '2.4 MB',
      pages: 45,
      uploadDate: '2024-01-15',
      status: 'complété',
      summary: 'Ce rapport annuel présente les résultats financiers exceptionnels de l\'entreprise pour 2024, avec une croissance de 25% du chiffre d\'affaires et une expansion significative sur les marchés internationaux.',
      chatHistory: [
        {
          id: '1',
          type: 'ai',
          message: 'Bonjour ! Je suis prêt à répondre à vos questions sur le Rapport Annuel 2024. Que souhaitez-vous savoir ?',
          timestamp: '10:30'
        }
      ]
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0] || null);
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary');
  const [chatInput, setChatInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type === 'application/pdf') {
          const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            pages: Math.floor(Math.random() * 50) + 10,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'en cours',
            chatHistory: []
          };

          setDocuments(prev => [...prev, newDoc]);

          // Simulate en cours
          setTimeout(() => {
            setDocuments(prev => prev.map(doc =>
              doc.id === newDoc.id
                ? {
                  ...doc,
                  status: 'complété' as const,
                  summary: `Résumé automatique généré pour ${file.name}. Ce document contient des informations importantes sur les processus, stratégies et résultats présentés de manière structurée.`,
                  chatHistory: [{
                    id: '1',
                    type: 'ai',
                    message: `Bonjour ! J'ai analysé le document "${file.name}". Que souhaitez-vous savoir à son sujet ?`,
                    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  }]
                }
                : doc
            ));
          }, 3000);
        }
      });
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !selectedDoc) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: chatInput,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as const,
      message: `Excellente question ! Selon le document "${selectedDoc.name}", voici ce que je peux vous dire : ${chatInput.includes('résumé') ? 'Le document présente une synthèse complète des points clés abordés.' : 'Cette information se trouve principalement aux pages 12-15 du document.'} Avez-vous d\'autres questions ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      pageRef: Math.floor(Math.random() * (selectedDoc.pages || 10)) + 1
    };

    setDocuments(prev => prev.map(doc =>
      doc.id === selectedDoc.id
        ? { ...doc, chatHistory: [...doc.chatHistory, userMessage, aiResponse] }
        : doc
    ));

    setChatInput('');
  };

  return (

    <div className="flex flex-col h-screen bg-white">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Documentation</h2>
            <p className="text-purple-100 text-sm">
              Résumé de document
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-full bg-gray-50">
        {/* Sidebar Documents */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>

            {/* Upload Zone */}
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Glissez vos PDF ici</p>
                <p className="text-xs text-gray-400">ou cliquez pour sélectionner</p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-lg border cursor-pointer  transition-all ${selectedDoc?.id === doc.id
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white '
                  }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'complété' ? 'bg-blue-400' :
                          doc.status === 'en cours' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                      <span className="text-xs text-gray-500 capitalize">{doc.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedDoc ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">{selectedDoc.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{selectedDoc.size}</span>
                  <span>•</span>
                  <span>{selectedDoc.pages} pages</span>
                  <span>•</span>
                  <span>Uploadé le {selectedDoc.uploadDate}</span>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'summary'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Résumé
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'chat'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Chat
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'summary' ? (
                  <div className="h-full overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-800">Résumé du Document</h2>
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Download className="w-4 h-4" />
                            Télécharger
                          </button>
                        </div>

                        {selectedDoc.status === 'complété' ? (
                          <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">{selectedDoc.summary}</p>

                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Points Clés</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                  <li>• Analyse approfondie des données</li>
                                  <li>• Recommandations stratégiques</li>
                                  <li>• Métriques de performance</li>
                                  <li>• Perspectives d'avenir</li>
                                </ul>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Métadonnées</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div>Mots: ~{Math.floor(Math.random() * 5000) + 2000}</div>
                                  <div>Confiance: 94%</div>
                                  <div>Temps de traitement: 2.3s</div>
                                  <div>Langue: Français</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Génération du résumé en cours...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex">
                    {/* PDF Viewer */}
                    <div className="w-1/2 bg-gray-100 border-r border-gray-200 flex flex-col">
                      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">Aperçu PDF</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-600">
                            {currentPage} / {selectedDoc.pages}
                          </span>
                          <button
                            onClick={() => setCurrentPage(Math.min(selectedDoc.pages, currentPage + 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
                          <div className="text-sm text-gray-700 space-y-4">
                            <h4 className="text-lg font-bold text-center mb-6">
                              {selectedDoc.name.replace('.pdf', '')}
                            </h4>
                            <p className="text-justify">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="text-justify">
                              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <div className="border-t border-gray-200 pt-4 mt-6">
                              <p className="text-xs text-gray-500 text-center">
                                Page {currentPage} - {selectedDoc.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="w-1/2 flex flex-col bg-white">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="font-medium text-gray-800">Chat avec le document</h3>
                        <p className="text-sm text-gray-500">Posez vos questions sur le contenu</p>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedDoc.chatHistory.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              <p className="text-sm">{message.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">{message.timestamp}</span>
                                {message.pageRef && (
                                  <span className="text-xs opacity-70">Page {message.pageRef}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Posez votre question..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={sendMessage}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Envoyer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucun document sélectionné</h2>
                <p className="text-gray-500">Uploadez un PDF pour commencer l'analyse</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}