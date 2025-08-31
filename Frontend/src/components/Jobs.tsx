import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../style/job.css';

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
  isRemote?: boolean;
  experience?: string;
}

const Jobs: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

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
            description: 'Desenvolvimento de aplicações web modernas usando React, Node.js e banco de dados relacionais. Você fará parte de um time ágil e inovador, trabalhando em projetos desafiadores para clientes globais.',
            requirements: ['React', 'Node.js', 'SQL', 'Git', '3+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z',
            isRemote: true,
            experience: 'Pleno'
          },
          {
            id: 2,
            title: 'UX/UI Designer',
            company: 'DesignStudio',
            location: 'Remoto',
            type: 'full-time',
            salary: 'R$ 6.000 - R$ 9.000',
            description: 'Criação de interfaces intuitivas e experiências de usuário excepcionais. Trabalhe com produtos digitais inovadores em um ambiente colaborativo e criativo.',
            requirements: ['Figma', 'Adobe Creative Suite', 'Design Thinking', '2+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z',
            isRemote: true,
            experience: 'Júnior'
          },
          {
            id: 3,
            title: 'Analista de Dados',
            company: 'DataAnalytics',
            location: 'Rio de Janeiro, RJ',
            type: 'full-time',
            salary: 'R$ 7.000 - R$ 10.000',
            description: 'Análise de dados para tomada de decisões estratégicas. Utilize ferramentas modernas de BI e trabalhe com grandes volumes de dados em um ambiente dinâmico.',
            requirements: ['Python', 'SQL', 'Excel', 'Power BI', '1+ anos de experiência'],
            created_at: '2025-01-01T00:00:00.000000Z',
            isRemote: false,
            experience: 'Júnior'
          },
          {
            id: 4,
            title: 'Product Manager',
            company: 'InovaTech',
            location: 'Belo Horizonte, MG',
            type: 'full-time',
            salary: 'R$ 12.000 - R$ 18.000',
            description: 'Liderança da estratégia de produto e coordenação entre equipes de desenvolvimento, design e negócios. Definição de roadmap e priorização de funcionalidades.',
            requirements: ['Gestão de Produtos', 'Metodologias Ágeis', 'Análise de Mercado', '5+ anos de experiência'],
            created_at: '2025-01-05T00:00:00.000000Z',
            isRemote: true,
            experience: 'Sênior'
          },
          {
            id: 5,
            title: 'Desenvolvedor Mobile',
            company: 'AppWorks',
            location: 'Curitiba, PR',
            type: 'contract',
            salary: 'R$ 9.000 - R$ 14.000',
            description: 'Desenvolvimento de aplicativos móveis para iOS e Android usando tecnologias modernas como React Native ou Flutter.',
            requirements: ['React Native/Flutter', 'JavaScript/TypeScript', 'APIs REST', '4+ anos de experiência'],
            created_at: '2025-01-10T00:00:00.000000Z',
            isRemote: true,
            experience: 'Pleno'
          },
          {
            id: 6,
            title: 'Estágio em Marketing Digital',
            company: 'DigitalBoost',
            location: 'Porto Alegre, RS',
            type: 'internship',
            salary: 'R$ 1.500 - R$ 2.000',
            description: 'Auxiliar na criação e implementação de estratégias de marketing digital, gestão de mídias sociais e análise de métricas.',
            requirements: ['Marketing Digital', 'Redes Sociais', 'Pacote Office', 'Inglês básico'],
            created_at: '2025-01-15T00:00:00.000000Z',
            isRemote: false,
            experience: 'Estagiário'
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || 
      (selectedLocation === 'remote' && job.isRemote) ||
      (selectedLocation === 'office' && !job.isRemote);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  if (loading) {
    return (
      <div className="jobs-loading">
        <div className="jobs-spinner"></div>
        <p>Carregando vagas...</p>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      {/* Header */}
      <header className="jobs-header">
        <div className="jobs-header-content">
          <div>
            <h1>Vagas Disponíveis</h1>
            <p>Bem-vindo, {user?.name}</p>
          </div>
          <div className="jobs-header-actions">
            <span className="badge badge-user">Usuário</span>
            <button onClick={handleLogout} className="btn btn-red">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="jobs-main">
        {/* Search and Filters */}
        <div className="jobs-filters">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar por título, empresa, localização ou tecnologia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">Todos os tipos</option>
              <option value="full-time">Tempo Integral</option>
              <option value="part-time">Meio Período</option>
              <option value="contract">Contrato</option>
              <option value="internship">Estágio</option>
            </select>
            
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="all">Todos os regimes</option>
              <option value="remote">Remoto</option>
              <option value="office">Presencial</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="jobs-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-content">
              <h3>{jobs.length}</h3>
              <p>Vagas no total</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-laptop-house"></i>
            </div>
            <div className="stat-content">
              <h3>{jobs.filter(job => job.isRemote).length}</h3>
              <p>Vagas remotas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-content">
              <h3>{jobs.filter(job => !job.isRemote).length}</h3>
              <p>Vagas presenciais</p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span className="company">
                      <i className="fas fa-building"></i> {job.company}
                    </span>
                    <span className="location">
                      <i className="fas fa-map-marker-alt"></i> {job.location}
                    </span>
                    {job.isRemote && (
                      <span className="remote-badge">
                        <i className="fas fa-wifi"></i> Remoto
                      </span>
                    )}
                  </div>
                </div>
                <div className="job-type">
                  <span className={`type-badge ${job.type}`}>
                    {job.type === 'full-time' ? 'Tempo Integral' : 
                     job.type === 'part-time' ? 'Meio Período' :
                     job.type === 'contract' ? 'Contrato' : 'Estágio'}
                  </span>
                </div>
              </div>
              
              <div className="job-details">
                <div className="salary-experience">
                  {job.salary && (
                    <div className="salary">
                      <i className="fas fa-money-bill-wave"></i>
                      <span>{job.salary}</span>
                    </div>
                  )}
                  {job.experience && (
                    <div className="experience">
                      <i className="fas fa-chart-line"></i>
                      <span>{job.experience}</span>
                    </div>
                  )}
                </div>
                
                <p className="job-description">{job.description}</p>
                
                <div className="requirements">
                  <h4>Requisitos e Competências:</h4>
                  <div className="tags">
                    {job.requirements.map((req, index) => (
                      <span key={index} className="tag">{req}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="job-footer">
                <span className="post-date">
                  <i className="fas fa-clock"></i> Publicada em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                </span>
                <button className="btn-apply">
                  <i className="fas fa-paper-plane"></i> Candidatar-se
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="no-jobs">
            <i className="fas fa-search"></i>
            <h3>Nenhuma vaga encontrada</h3>
            <p>Tente ajustar os filtros ou os termos de busca.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;