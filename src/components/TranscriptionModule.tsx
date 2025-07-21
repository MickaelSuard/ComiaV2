import React, { useState, useRef } from 'react';
import { Upload, FileAudio, FileVideo, Download, Volume2, Clock, CheckCircle, AlertCircle, FileText, Sparkles, Search, Trash2, Calendar, Mic } from 'lucide-react';

interface TranscriptionResult {
  id: string;
  filename: string;
  duration: string;
  status: 'processing' | 'completed' | 'error';
  transcription?: string;
  fileSize: string;
  uploadedAt: Date;
  summary?: string;
  summaryWordCount?: number;
}

const TranscriptionModule: React.FC = () => {
  const [files, setFiles] = useState<TranscriptionResult[]>([
    {
      id: '1',
      filename: 'reunion_equipe_2024.mp4',
      duration: '15:32',
      status: 'completed',
      fileSize: '45.2 MB',
      uploadedAt: new Date(Date.now() - 86400000),
      transcription: `Transcription de la réunion d'équipe du 15 janvier 2024.

Participants présents :
- Marie Dubois (Chef de projet)
- Jean Martin (Développeur senior)
- Sophie Laurent (Designer UX)
- Pierre Durand (Analyste)

[00:00] Marie : Bonjour à tous, merci d'être présents pour cette réunion d'équipe. Nous allons faire le point sur l'avancement du projet Comue de Lyon.

[02:15] Jean : L'architecture backend est maintenant finalisée. Nous avons implémenté l'API REST avec une authentification JWT sécurisée.

[05:30] Sophie : Du côté design, j'ai terminé les maquettes pour les modules de transcription et de chat. L'interface utilisateur est maintenant cohérente sur tous les écrans.

[08:45] Pierre : Les tests de performance montrent des résultats excellents. Le temps de réponse moyen est de 1.2 secondes pour les requêtes complexes.

[12:00] Marie : Parfait ! Quelles sont les prochaines étapes pour la semaine prochaine ?

[13:20] Jean : Je vais me concentrer sur l'optimisation de la base de données et l'implémentation du cache Redis.

[14:10] Sophie : Je finalise les animations et micro-interactions pour améliorer l'expérience utilisateur.

[15:00] Marie : Excellent travail tout le monde. Rendez-vous la semaine prochaine pour le suivi.`,
      summary: `## Résumé de la Réunion d'Équipe - 15 janvier 2024

### 📋 Informations Générales
- **Fichier source** : reunion_equipe_2024.mp4
- **Durée** : 15:32
- **Type** : Réunion d'équipe
- **Date** : 15 janvier 2024

### 👥 Participants
- **Marie Dubois** - Chef de projet (Animatrice)
- **Jean Martin** - Développeur senior
- **Sophie Laurent** - Designer UX
- **Pierre Durand** - Analyste

### 🎯 Points Clés Abordés
1. **Architecture Backend** - Finalisation de l'API REST avec JWT
2. **Design Interface** - Maquettes terminées pour transcription et chat
3. **Performance** - Tests excellents avec 1.2s de temps de réponse
4. **Planification** - Organisation des tâches pour la semaine suivante

### 📊 Avancement du Projet
- **Backend** : ✅ Architecture finalisée
- **Frontend** : ✅ Design cohérent implémenté
- **Performance** : ✅ Tests validés
- **Prochaines étapes** : Optimisation BDD et animations

### 🎯 Actions à Retenir
1. **Jean** : Optimisation base de données + cache Redis
2. **Sophie** : Finalisation animations et micro-interactions
3. **Équipe** : Rendez-vous hebdomadaire maintenu

### 📈 Métriques
- **Durée effective** : 15 minutes 32 secondes
- **Participants actifs** : 4 personnes
- **Sujets traités** : 4 thèmes principaux
- **Décisions prises** : 3 actions concrètes

---
*Résumé généré automatiquement par Comue de Lyon IA*`,
      summaryWordCount: 245
    },
    {
      id: '2',
      filename: 'presentation_client.mp3',
      duration: '8:45',
      status: 'completed',
      fileSize: '12.8 MB',
      uploadedAt: new Date(Date.now() - 172800000),
      transcription: `Présentation client - Projet Comue de Lyon

Bonjour Monsieur Leclerc, merci de nous recevoir aujourd'hui. Je vais vous présenter notre solution Comue de Lyon, une plateforme d'intelligence artificielle complète.

Notre solution comprend quatre modules principaux :

1. Assistant IA conversationnel
2. Transcription audio/vidéo automatique
3. Base de connaissances avec recherche intelligente
4. Analyse de documents avec chat contextuel

Les avantages pour votre entreprise :
- Gain de productivité de 40%
- Réduction des coûts opérationnels
- Amélioration de la qualité des analyses
- Interface intuitive et moderne

Nous proposons une période d'essai de 30 jours pour que vous puissiez évaluer la solution dans votre environnement.`,
      summary: `## Résumé de Présentation Client

### 🎯 Objectif
Présentation de la solution Comue de Lyon à Monsieur Leclerc

### 📦 Modules Présentés
1. Assistant IA conversationnel
2. Transcription automatique
3. Base de connaissances
4. Analyse de documents

### 💼 Bénéfices Client
- **Productivité** : +40%
- **Coûts** : Réduction significative
- **Qualité** : Analyses améliorées
- **UX** : Interface moderne

### 🎁 Offre Commerciale
- Période d'essai : 30 jours gratuits
- Évaluation en environnement réel

---
*Résumé généré automatiquement par Comue de Lyon IA*`,
      summaryWordCount: 89
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<TranscriptionResult | null>(files[0] || null);
  const [activeTab, setActiveTab] = useState<'transcription' | 'summary'>('transcription');
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList: File[]) => {
    const audioVideoFiles = fileList.filter(file =>
      file.type.startsWith('audio/') || file.type.startsWith('video/')
    );

    const newFiles: TranscriptionResult[] = audioVideoFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      filename: file.name,
      duration: '00:00',
      status: 'processing',
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      uploadedAt: new Date(),
    }));

    setFiles(prev => [...newFiles, ...prev]);

    // Simuler le traitement
    newFiles.forEach(file => {
      setTimeout(() => {
        const transcriptionText = `Transcription automatique pour ${file.filename}.\n\nCeci est un exemple de transcription générée par votre service IA. Le texte serait ici converti à partir du contenu audio ou vidéo du fichier.\n\nDans une implémentation réelle, cette transcription contiendrait le contenu exact de votre fichier média, avec une précision élevée et une ponctuation appropriée.\n\nLe système peut également identifier différents locuteurs, ajouter des timestamps, et formater le texte de manière lisible.`;

        const summaryText = `## Résumé de la Transcription - ${file.filename}

### 📋 Informations Générales
- **Fichier source** : ${file.filename}
- **Durée** : ${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}
- **Type** : ${file.filename.includes('.mp4') ? 'Vidéo' : 'Audio'}
- **Date de traitement** : ${new Date().toLocaleDateString()}

### 🎯 Points Clés
1. **Contenu principal** - Analyse du sujet traité
2. **Éléments importants** - Points saillants identifiés
3. **Conclusions** - Résumé des décisions ou actions

### 📊 Métriques
- **Mots transcrits** : ~${Math.floor(Math.random() * 2000) + 500} mots
- **Confiance moyenne** : ${Math.round((Math.random() * 0.3 + 0.7) * 100)}%
- **Temps de traitement** : ${Math.floor(Math.random() * 30) + 10} secondes

---
*Résumé généré automatiquement par Comue de Lyon IA*`;

        setFiles(prev => prev.map(f =>
          f.id === file.id
            ? {
              ...f,
              status: 'completed',
              duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              transcription: transcriptionText,
              summary: summaryText,
              summaryWordCount: summaryText.split(/\s+/).length
            }
            : f
        ));
      }, 2000 + Math.random() * 3000);
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      const remaining = files.filter(f => f.id !== fileId);
      setSelectedFile(remaining[0] || null);
    }
  };

  const downloadTranscription = (transcription: string, filename: string) => {
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.split('.')[0]}_transcription.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSummary = (summary: string, filename: string) => {
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.split('.')[0]}_resume.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="flex flex-col h-screen bg-white">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Transcription</h2>
            <p className="text-blue-100 text-sm">
              Audio vers texte
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-full bg-gray-50">


        {/* Sidebar Historique */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transcriptions</h2>

            {/* Upload Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 mb-4 ${dragActive
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Glissez vos fichiers ici</p>
              <p className="text-xs text-gray-400">MP3, MP4, WAV, M4A, OGG</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Aucun fichier trouvé</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id
                    ? 'border border-blue-300 bg-blue-50 shadow-lg'
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {file.filename.includes('.mp4') || file.filename.includes('.mov') || file.filename.includes('.avi') ? (
                        <FileVideo className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileAudio className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm">{file.filename}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{file.duration}</span>
                        <span>•</span>
                        <span>{file.fileSize}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span className={`text-xs font-medium ${file.status === 'completed' ? 'text-blue-600' :
                        file.status === 'processing' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                        {file.status === 'completed' ? 'Terminé' :
                          file.status === 'processing' ? 'En cours' : 'Erreur'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {file.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>

                  {file.status === 'completed' && file.summaryWordCount && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded-lg p-2">
                      <span className="ml-2">Résumé: {file.summaryWordCount} mots</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">{selectedFile.filename}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedFile.duration}
                  </span>
                  <span>•</span>
                  <span>{selectedFile.fileSize}</span>
                  <span>•</span>
                  <span>Télécharger le {selectedFile.uploadedAt.toLocaleDateString()}</span>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('transcription')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'transcription'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Transcription
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'summary'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Résumé
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'transcription' ? (
                  <div className="h-full overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-800">Transcription</h2>
                          {selectedFile.transcription && (
                            <button
                              onClick={() => downloadTranscription(selectedFile.transcription!, selectedFile.filename)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger
                            </button>
                          )}
                        </div>

                        {selectedFile.status === 'completed' && selectedFile.transcription ? (
                          <div className="prose max-w-none">
                            <div className="bg-gray-50 rounded-lg p-6 border">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-line font-mono text-sm">
                                {selectedFile.transcription}
                              </p>
                            </div>
                          </div>
                        ) : selectedFile.status === 'processing' ? (
                          <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Transcription en cours...</p>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-gray-600">Erreur lors de la transcription</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            Résumé Automatique
                          </h2>
                          {selectedFile.summary && (
                            <button
                              onClick={() => downloadSummary(selectedFile.summary!, selectedFile.filename)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger PDF
                            </button>
                          )}
                        </div>

                        {selectedFile.status === 'completed' && selectedFile.summary ? (
                          <div className="prose max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line font-mono text-sm bg-gray-50 p-6 rounded-lg border">
                              {selectedFile.summary}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                              <span>Document généré par Comue de Lyon IA</span>
                              <span>Généré le {selectedFile.uploadedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        ) : selectedFile.status === 'processing' ? (
                          <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Génération du résumé en cours...</p>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-gray-600">Erreur lors de la génération du résumé</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Volume2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucun fichier sélectionné</h2>
                <p className="text-gray-500">Uploadez un fichier audio/vidéo pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModule;