import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Mic, Database, FileText, Calendar, Clock, Activity, Zap, Eye, Download } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ActivityLog {
  id: string;
  type: 'chat' | 'transcription' | 'rag' | 'documentation';
  action: string;
  timestamp: Date;
  user: string;
  details: string;
}

const StatisticsModule: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'usage' | 'performance' | 'users'>('usage');

  const stats: StatCard[] = [
    {
      title: 'Messages échangés',
      value: '12,847',
      change: '+23%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Fichiers transcrits',
      value: '1,234',
      change: '+18%',
      trend: 'up',
      icon: Mic,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Recherches RAG',
      value: '5,678',
      change: '+31%',
      trend: 'up',
      icon: Database,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Docs générées',
      value: '892',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Utilisateurs actifs',
      value: '2,456',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Temps de réponse',
      value: '1.2s',
      change: '-15%',
      trend: 'up',
      icon: Zap,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const usageData: ChartData[] = [
    { label: 'Chat', value: 45, color: '#10b981' },
    { label: 'Transcription', value: 25, color: '#8b5cf6' },
    { label: 'RAG', value: 20, color: '#3b82f6' },
    { label: 'Documentation', value: 10, color: '#f59e0b' }
  ];

  const weeklyData = [
    { day: 'Lun', chat: 120, transcription: 80, rag: 95, docs: 45 },
    { day: 'Mar', chat: 150, transcription: 95, rag: 110, docs: 52 },
    { day: 'Mer', chat: 180, transcription: 110, rag: 125, docs: 68 },
    { day: 'Jeu', chat: 165, transcription: 105, rag: 140, docs: 71 },
    { day: 'Ven', chat: 200, transcription: 125, rag: 155, docs: 89 },
    { day: 'Sam', chat: 90, transcription: 60, rag: 75, docs: 32 },
    { day: 'Dim', chat: 75, transcription: 45, rag: 60, docs: 28 }
  ];

  const recentActivity: ActivityLog[] = [
    {
      id: '1',
      type: 'chat',
      action: 'Nouvelle conversation',
      timestamp: new Date(Date.now() - 300000),
      user: 'Marie Dubois',
      details: 'Discussion sur l\'optimisation des performances'
    },
    {
      id: '2',
      type: 'transcription',
      action: 'Fichier transcrit',
      timestamp: new Date(Date.now() - 600000),
      user: 'Jean Martin',
      details: 'reunion_equipe_2024.mp4 (15 min)'
    },
    {
      id: '3',
      type: 'rag',
      action: 'Recherche effectuée',
      timestamp: new Date(Date.now() - 900000),
      user: 'Sophie Laurent',
      details: 'Recherche dans "Documentation Technique"'
    },
    {
      id: '4',
      type: 'documentation',
      action: 'Documentation générée',
      timestamp: new Date(Date.now() - 1200000),
      user: 'Pierre Durand',
      details: 'Guide API REST - 2,450 mots'
    },
    {
      id: '5',
      type: 'rag',
      action: 'Nouveau service créé',
      timestamp: new Date(Date.now() - 1800000),
      user: 'Admin',
      details: 'Service "Base Produits 2024"'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return MessageSquare;
      case 'transcription': return Mic;
      case 'rag': return Database;
      case 'documentation': return FileText;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'chat': return 'text-emerald-600 bg-emerald-100';
      case 'transcription': return 'text-purple-600 bg-purple-100';
      case 'rag': return 'text-blue-600 bg-blue-100';
      case 'documentation': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const maxValue = Math.max(...weeklyData.flatMap(d => [d.chat, d.transcription, d.rag, d.docs]));

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Statistiques & Analytics</h2>
              <p className="text-pink-100 text-sm">Analyse des performances et de l'utilisation</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7d" className="text-gray-900">7 derniers jours</option>
              <option value="30d" className="text-gray-900">30 derniers jours</option>
              <option value="90d" className="text-gray-900">90 derniers jours</option>
              <option value="1y" className="text-gray-900">1 année</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-600 bg-green-100' : 
                    stat.trend === 'down' ? 'text-red-600 bg-red-100' : 
                    'text-gray-600 bg-gray-100'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Usage Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Utilisation par module</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMetric('usage')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedMetric === 'usage' 
                        ? 'bg-pink-100 text-pink-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Usage
                  </button>
                  <button
                    onClick={() => setSelectedMetric('performance')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedMetric === 'performance' 
                        ? 'bg-pink-100 text-pink-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Performance
                  </button>
                </div>
              </div>
              
              {/* Weekly Bar Chart */}
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-gray-600 font-medium">{day.day}</div>
                    <div className="flex-1 flex gap-1">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-sm h-6 flex items-center justify-center"
                        style={{ width: `${(day.chat / maxValue) * 100}%`, minWidth: '20px' }}
                      >
                        <span className="text-white text-xs font-medium">{day.chat}</span>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-sm h-6 flex items-center justify-center"
                        style={{ width: `${(day.transcription / maxValue) * 100}%`, minWidth: '20px' }}
                      >
                        <span className="text-white text-xs font-medium">{day.transcription}</span>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-sm h-6 flex items-center justify-center"
                        style={{ width: `${(day.rag / maxValue) * 100}%`, minWidth: '20px' }}
                      >
                        <span className="text-white text-xs font-medium">{day.rag}</span>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-600 rounded-sm h-6 flex items-center justify-center"
                        style={{ width: `${(day.docs / maxValue) * 100}%`, minWidth: '20px' }}
                      >
                        <span className="text-white text-xs font-medium">{day.docs}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Transcription</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">RAG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Documentation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
              <button className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Voir tout
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{activity.user}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Usage Distribution */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition de l'utilisation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Donut Chart Simulation */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" 
                       style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" 
                       style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 75% 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" 
                       style={{ clipPath: 'polygon(50% 50%, 75% 100%, 25% 100%, 0% 50%)' }}></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600" 
                       style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }}></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Usage Stats */}
              <div className="space-y-4">
                {usageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.value}%</div>
                      <div className="text-sm text-gray-600">du total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModule;