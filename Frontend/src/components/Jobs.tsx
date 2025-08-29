import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  description: string;
  requirements: string[];
  created_at: string;
}

const Jobs: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular busca de vagas
    const fetchJobs = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJobs([
          {
            id: 1,
            title: 'Desenvolvedor Full Stack',
            company: 'TechCorp',
            location: 'São Paulo, SP',
            type: 'full-time',
            salary: 'R$ 8.000 - R$ 12.000',
            description: 'Desenvolvimento de aplicações web modernas usando React, Node.js e banco de dados relacionais.',
            requirements: ['React', 'Node.js', 'SQL', 'Git', '3+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z'
          },
          {
            id: 2,
            title: 'UX/UI Designer',
            company: 'DesignStudio',
            location: 'Remoto',
            type: 'full-time',
            salary: 'R$ 6.000 - R$ 9.000',
            description: 'Criação de interfaces intuitivas e experiências de usuário excepcionais.',
            requirements: ['Figma', 'Adobe Creative Suite', 'Design Thinking', '2+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z'
          },
          {
            id: 3,
            title: 'Analista de Dados',
            company: 'DataAnalytics',
            location: 'Rio de Janeiro, RJ',
            type: 'full-time',
            salary: 'R$ 7.000 - R$ 10.000',
            description: 'Análise de dados para tomada de decisões estratégicas.',
            requirements: ['Python', 'SQL', 'Excel', 'Power BI', '1+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z'
          }
        ]);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vagas Disponíveis</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Usuário
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-lg">
            <label htmlFor="search" className="sr-only">
              Buscar vagas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar por título, empresa ou localização..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.company}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type === 'full-time' ? 'Tempo Integral' : 
                         job.type === 'part-time' ? 'Meio Período' :
                         job.type === 'contract' ? 'Contrato' : 'Estágio'}
                      </span>
                    </div>
                    
                    {job.salary && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.salary}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-700 mb-3">{job.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Requisitos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Publicada em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Candidatar-se
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma vaga encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os termos de busca.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
