import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Briefcase, Heart, Clock, MapPin, Building, X, Eye,
  CheckCircle, Clock as ClockIcon, AlertCircle, Search
} from 'lucide-react';

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  salary?: string;
  type: string;
}

interface SavedJob {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  savedDate: string;
  salary?: string;
  type: string;
}

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Dados mockados para candidaturas
        const mockApplications: Application[] = [
          {
            id: 1,
            jobId: 101,
            jobTitle: 'Desenvolvedor Full Stack',
            company: 'TechCorp',
            location: 'São Paulo, SP',
            status: 'reviewed',
            appliedDate: '2025-01-15T10:30:00.000Z',
            salary: 'R$ 8.000 - R$ 12.000',
            type: 'Tempo Integral'
          },
          {
            id: 2,
            jobId: 102,
            jobTitle: 'UX/UI Designer',
            company: 'DesignStudio',
            location: 'Remoto',
            status: 'pending',
            appliedDate: '2025-01-10T14:22:00.000Z',
            salary: 'R$ 6.000 - R$ 9.000',
            type: 'Tempo Integral'
          },
          {
            id: 3,
            jobId: 103,
            jobTitle: 'Product Manager',
            company: 'InovaTech',
            location: 'Belo Horizonte, MG',
            status: 'accepted',
            appliedDate: '2025-01-05T09:15:00.000Z',
            salary: 'R$ 12.000 - R$ 18.000',
            type: 'Tempo Integral'
          },
          {
            id: 4,
            jobId: 104,
            jobTitle: 'Analista de Dados',
            company: 'DataAnalytics',
            location: 'Rio de Janeiro, RJ',
            status: 'rejected',
            appliedDate: '2025-01-03T11:40:00.000Z',
            salary: 'R$ 7.000 - R$ 10.000',
            type: 'Tempo Integral'
          }
        ];

        // Dados mockados para vagas salvas
        const mockSavedJobs: SavedJob[] = [
          {
            id: 1,
            jobId: 201,
            jobTitle: 'Desenvolvedor Mobile',
            company: 'AppWorks',
            location: 'Curitiba, PR',
            savedDate: '2025-01-12T16:45:00.000Z',
            salary: 'R$ 9.000 - R$ 14.000',
            type: 'Contrato'
          },
          {
            id: 2,
            jobId: 202,
            jobTitle: 'Estágio em Marketing Digital',
            company: 'DigitalBoost',
            location: 'Porto Alegre, RS',
            savedDate: '2025-01-08T11:20:00.000Z',
            salary: 'R$ 1.500 - R$ 2.000',
            type: 'Estágio'
          },
          {
            id: 3,
            jobId: 203,
            jobTitle: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'Remoto',
            savedDate: '2025-01-18T09:30:00.000Z',
            salary: 'R$ 10.000 - R$ 15.000',
            type: 'Tempo Integral'
          }
        ];

        setApplications(mockApplications);
        setSavedJobs(mockSavedJobs);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'reviewed': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'reviewed': return 'Revisado';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCancelApplication = (applicationId: number) => {
    if (window.confirm('Tem certeza que deseja cancelar esta candidatura?')) {
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      alert('Candidatura cancelada com sucesso!');
    }
  };

  const handleRemoveSavedJob = (jobId: number) => {
    if (window.confirm('Tem certeza que deseja remover esta vaga salva?')) {
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      alert('Vaga removida com sucesso!');
    }
  };

  const handleApplyToSavedJob = (jobId: number) => {
    const job = savedJobs.find(j => j.id === jobId);
    if (job) {
      alert(`Candidatura enviada para: ${job.jobTitle} na ${job.company}`);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSavedJobs = savedJobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 font-medium">Carregando candidaturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-8 border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Candidaturas</h1>
        <p className="text-gray-600">Gerencie suas candidaturas e vagas salvas</p>
      </div>

      {/* Abas e Busca */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-8 border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'applications'
                ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 shadow-inner'
                : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50'
                }`}
            >
              <Briefcase className="w-5 h-5 mr-2 inline" />
              Candidaturas ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'saved'
                ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 shadow-inner'
                : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50'
                }`}
            >
              <Heart className="w-5 h-5 mr-2 inline" />
              Vagas Salvas ({savedJobs.length})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar vagas ou empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/20">
        {/* Candidaturas */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-orange-600" />
              Minhas Candidaturas
            </h2>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Nenhuma candidatura encontrada' : 'Você ainda não se candidatou a nenhuma vaga.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{application.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {application.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {application.location}
                          </span>
                          {application.salary && (
                            <span className="font-semibold text-green-700">{application.salary}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-2">{getStatusText(application.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-gray-600">
                        <strong>Data da Candidatura:</strong>
                        <p>{formatDate(application.appliedDate)}</p>
                      </div>
                      <div className="text-gray-600">
                        <strong>Tipo de Vaga:</strong>
                        <p>{application.type}</p>
                      </div>
                      <div className="text-gray-600">
                        <strong>Ações:</strong>
                        <div className="flex gap-2 mt-1">
                          <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Vaga
                          </button>
                          {application.status === 'pending' && (
                            <button
                              onClick={() => handleCancelApplication(application.id)}
                              className="text-red-600 hover:text-red-800 font-medium flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vagas Salvas */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-orange-600" />
              Vagas Salvas
            </h2>

            {filteredSavedJobs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Nenhuma vaga salva encontrada' : 'Você ainda não salvou nenhuma vaga.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSavedJobs.map((job) => (
                  <div key={job.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          {job.salary && (
                            <span className="font-semibold text-green-700">{job.salary}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          Salvo em {formatDate(job.savedDate)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-gray-600">
                        <strong>Tipo de Vaga:</strong>
                        <p>{job.type}</p>
                      </div>
                      <div className="text-gray-600">
                        <strong>ID da Vaga:</strong>
                        <p>#{job.jobId}</p>
                      </div>
                      <div className="text-gray-600">
                        <strong>Ações:</strong>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleApplyToSavedJob(job.id)}
                            className="text-orange-600 hover:text-orange-800 font-medium flex items-center"
                          >
                            <Briefcase className="w-4 h-4 mr-1" />
                            Candidatar-se
                          </button>
                          <button
                            onClick={() => handleRemoveSavedJob(job.id)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;