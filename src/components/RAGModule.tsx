import React, { useState } from 'react';
import { Search, Database, FileText, Upload, Settings, Zap, ExternalLink, Plus, Eye, Trash2, RefreshCw, File, Calendar } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  status: 'processed' | 'processing' | 'error';
  content?: string;
}

interface RAGService {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'database' | 'web' | 'custom';
  status: 'active' | 'inactive' | 'configuring';
  documentsCount: number;
  documents: Document[];
  lastUpdated: Date;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  relevance: number;
  timestamp: Date;
}

const RAGModule: React.FC = () => {
  const [services, setServices] = useState<RAGService[]>([
    {
      id: '1',
      name: 'Documentation Technique',
      description: 'Guides et manuels techniques',
      type: 'document',
      status: 'active',
      documentsCount: 45,
      lastUpdated: new Date(),
      documents: [
        {
          id: '1',
          name: 'Guide_Installation.pdf',
          type: 'PDF',
          size: '2.4 MB',
          uploadedAt: new Date(Date.now() - 86400000),
          status: 'processed'
        },
        {
          id: '2',
          name: 'API_Documentation.md',
          type: 'Markdown',
          size: '856 KB',
          uploadedAt: new Date(Date.now() - 172800000),
          status: 'processed'
        },
        {
          id: '3',
          name: 'Troubleshooting.docx',
          type: 'Word',
          size: '1.2 MB',
          uploadedAt: new Date(Date.now() - 259200000),
          status: 'processing'
        }
      ]
    },
    {
      id: '2',
      name: 'Base Produits',
      description: 'Catalogue et spécifications',
      type: 'database',
      status: 'active',
      documentsCount: 1200,
      lastUpdated: new Date(Date.now() - 3600000),
      documents: [
        {
          id: '4',
          name: 'Catalogue_2024.xlsx',
          type: 'Excel',
          size: '5.8 MB',
          uploadedAt: new Date(Date.now() - 86400000),
          status: 'processed'
        },
        {
          id: '5',
          name: 'Specifications_Techniques.json',
          type: 'JSON',
          size: '3.2 MB',
          uploadedAt: new Date(Date.now() - 172800000),
          status: 'processed'
        }
      ]
    },
    {
      id: '3',
      name: 'Ressources RH',
      description: 'Politiques et procédures',
      type: 'document',
      status: 'inactive',
      documentsCount: 23,
      lastUpdated: new Date(Date.now() - 604800000),
      documents: [
        {
          id: '6',
          name: 'Politique_Entreprise.pdf',
          type: 'PDF',
          size: '1.8 MB',
          uploadedAt: new Date(Date.now() - 604800000),
          status: 'processed'
        }
      ]
    }
  ]);

  const [selectedService, setSelectedService] = useState<string>('1');
  const [view, setView] = useState<'services' | 'documents' | 'search'>('services');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setView('search');
    
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Configuration du serveur de production',
          content: 'Pour configurer le serveur de production, suivez ces étapes essentielles. Assurez-vous d\'avoir les bonnes permissions et les certificats SSL à jour...',
          source: 'Documentation Technique',
          relevance: 0.95,
          timestamp: new Date()
        },
        {
          id: '2',
          title: 'Spécifications du produit XYZ-2024',
          content: 'Le produit XYZ-2024 présente des caractéristiques techniques avancées avec une performance optimisée pour les environnements cloud...',
          source: 'Base Produits',
          relevance: 0.87,
          timestamp: new Date()
        },
        {
          id: '3',
          title: 'Procédure de déploiement automatisé',
          content: 'Le déploiement automatisé permet de réduire les erreurs humaines et d\'accélérer la mise en production. Voici le workflow recommandé...',
          source: 'Documentation Technique',
          relevance: 0.76,
          timestamp: new Date()
        }
      ];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const createService = () => {
    if (!newServiceName.trim()) return;

    const newService: RAGService = {
      id: Date.now().toString(),
      name: newServiceName,
      description: newServiceDescription || 'Nouveau service de connaissances',
      type: 'document',
      status: 'configuring',
      documentsCount: 0,
      documents: [],
      lastUpdated: new Date()
    };

    setServices(prev => [...prev, newService]);
    setNewServiceName('');
    setNewServiceDescription('');
    setShowCreateService(false);
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    if (selectedService === serviceId) {
      setSelectedService(services[0]?.id || '');
    }
  };

  const reindexService = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, status: 'configuring' as const, lastUpdated: new Date() }
        : s
    ));
    
    setTimeout(() => {
      setServices(prev => prev.map(s => 
        s.id === serviceId 
          ? { ...s, status: 'active' as const }
          : s
      ));
    }, 3000);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'database': return Database;
      case 'web': return ExternalLink;
      default: return Settings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'configuring': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFileIcon = (type: string) => {
    return File;
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Base de Connaissances</h2>
              <p className="text-blue-100 text-sm">Gestion et recherche dans la base de connaisance</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('services')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'services' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setView('documents')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'documents' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setView('search')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'search' 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              Recherche
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans toutes les bases de connaissances..."
              className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Zap className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'services' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Services de connaissances</h3>
              <button
                onClick={() => setShowCreateService(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Nouveau service
              </button>
            </div>

            {showCreateService && (
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau service</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Nom du service"
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    placeholder="Description (optionnel)"
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={createService}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Créer
                    </button>
                    <button
                      onClick={() => setShowCreateService(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = getServiceIcon(service.type);
                
                return (
                  <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => reindexService(service.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                          title="Réindexer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status === 'active' ? 'Actif' : 
                         service.status === 'inactive' ? 'Inactif' : 'Configuration'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.documentsCount} documents
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Mis à jour: {service.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedService(service.id);
                        setView('documents');
                      }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir les documents
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'documents' && selectedServiceData && (
          <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedServiceData.name}</h3>
                <p className="text-gray-600">{selectedServiceData.description}</p>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Upload className="w-4 h-4" />
                Ajouter des documents
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Documents ({selectedServiceData.documents.length})</h4>
                  <div className="flex gap-2">
                    <select className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                      <option>Tous les types</option>
                      <option>PDF</option>
                      <option>Word</option>
                      <option>Excel</option>
                    </select>
                    <select className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                      <option>Trier par date</option>
                      <option>Trier par nom</option>
                      <option>Trier par taille</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {selectedServiceData.documents.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  
                  return (
                    <div key={doc.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{doc.name}</h5>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <File className="w-3 h-3" />
                              {doc.type}
                            </span>
                            <span>{doc.size}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {doc.uploadedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'processed' ? 'text-green-600 bg-green-100' :
                            doc.status === 'processing' ? 'text-orange-600 bg-orange-100' :
                            'text-red-600 bg-red-100'
                          }`}>
                            {doc.status === 'processed' ? 'Traité' :
                             doc.status === 'processing' ? 'En cours' : 'Erreur'}
                          </span>
                          
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'search' && (
          <div className="h-full overflow-y-auto p-6">
            {isSearching ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Recherche en cours...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Résultats de recherche ({results.length})
                </h3>
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{result.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{result.source}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                          {Math.round(result.relevance * 100)}% pertinent
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{result.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{result.timestamp.toLocaleString()}</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Voir le document source
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : query && !isSearching ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun résultat trouvé</p>
                  <p className="text-sm text-gray-500 mt-2">Essayez avec d'autres mots-clés</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Effectuez une recherche pour commencer</p>
                  <p className="text-sm text-gray-500 mt-2">Utilisez la barre de recherche ci-dessus</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGModule;