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

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
}

const Jobs: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState<number | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

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
            description: 'Criação de interfaces intuitivas e experiências de usuão excepcionais. Trabalhe com produtos digitais inovadores em um ambiente colaborativo e criativo.',
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

  const handleApplyClick = (jobId: number) => {
    setShowApplicationForm(jobId);
    setFormErrors({});
    // Preencher automaticamente com dados do usuário se disponível
    if (user) {
      setApplicationData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!applicationData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!applicationData.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(applicationData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (!applicationData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    }
    
    if (!applicationData.resume) {
      errors.resume = 'Currículo é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplicationSubmit = (jobId: number) => {
    if (!validateForm()) {
      return;
    }

    // Aqui você pode adicionar lógica para enviar o formulário para o backend
    console.log('Dados da candidatura:', applicationData);
    setAppliedJobs(prev => [...prev, jobId]);
    setShowApplicationForm(null);
    setApplicationData({
      name: '',
      email: '',
      phone: '',
      resume: null,
      coverLetter: ''
    });
    alert(`Candidatura para a vaga #${jobId} enviada com sucesso!`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));

      // Limpar erro do arquivo quando um arquivo for selecionado
      if (formErrors.resume) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.resume;
          return newErrors;
        });
      }
    }
  };

  const toggleDetails = (jobId: number) => {
    if (showDetails === jobId) {
      setShowDetails(null);
    } else {
      setShowDetails(jobId);
    }
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
      {/* Header com cor laranja */}
      <header className="jobs-header">
        <div className="jobs-header-content">
          <div>
            <h1>Vagas Disponíveis</h1>
            <p className="welcome-text">Bem-vindo, {user?.name}</p>
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
                
                {showDetails === job.id && (
                  <div className="job-full-details">
                    <div className="requirements">
                      <h4>Requisitos e Competências:</h4>
                      <div className="tags">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="tag">{req}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="job-footer">
                <span className="post-date">
                  <i className="fas fa-clock"></i> Publicada em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                </span>
                <div className="job-actions">
                  <button 
                    className="btn-details"
                    onClick={() => toggleDetails(job.id)}
                  >
                    <i className={`fas ${showDetails === job.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i> 
                    {showDetails === job.id ? 'Menos Detalhes' : 'Mais Detalhes'}
                  </button>
                  {appliedJobs.includes(job.id) ? (
                    <button className="btn-applied" disabled>
                      <i className="fas fa-check"></i> Candidatura Enviada
                    </button>
                  ) : (
                    <button 
                      className="btn-apply"
                      onClick={() => handleApplyClick(job.id)}
                    >
                      <i className="fas fa-paper-plane"></i> Candidatar-se
                    </button>
                  )}
                </div>
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

        {/* Formulário de Candidatura - Aparece como uma view separada na mesma página */}
        {showApplicationForm && (
          <div className="application-view">
            <div className="application-container">
              <div className="application-header">
                <h2>
                  <i className="fas fa-paper-plane"></i>
                  Candidatar-se à Vaga
                </h2>
                <button 
                  className="btn-close-application"
                  onClick={() => setShowApplicationForm(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="application-content">
                <div className="job-preview">
                  <h3>{jobs.find(job => job.id === showApplicationForm)?.title}</h3>
                  <p>
                    <i className="fas fa-building"></i>
                    {jobs.find(job => job.id === showApplicationForm)?.company}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {jobs.find(job => job.id === showApplicationForm)?.location}
                  </p>
                </div>

                <form className="application-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-section">
                    <h3>Informações Pessoais</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Nome Completo *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={applicationData.name}
                          onChange={handleInputChange}
                          className={formErrors.name ? 'error' : ''}
                          required
                        />
                        {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">E-mail *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleInputChange}
                          className={formErrors.email ? 'error' : ''}
                          required
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Telefone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={applicationData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? 'error' : ''}
                        required
                      />
                      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Documentos</h3>
                    <div className="form-group">
                      <label htmlFor="resume">Currículo (PDF, DOC ou DOCX) *</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          required
                        />
                        <label htmlFor="resume" className={`file-upload-label ${formErrors.resume ? 'error' : ''}`}>
                          <i className="fas fa-upload"></i>
                          {applicationData.resume ? applicationData.resume.name : 'Selecionar arquivo'}
                        </label>
                        {formErrors.resume && <span className="error-message">{formErrors.resume}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Carta de Apresentação</h3>
                    <div className="form-group">
                      <label htmlFor="coverLetter">Por que você é a pessoa ideal para esta vaga?</label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={applicationData.coverLetter}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Descreva suas experiências, habilidades e por que você se encaixa perfeitamente para esta posição..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowApplicationForm(null)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="btn-submit-application"
                      onClick={() => handleApplicationSubmit(showApplicationForm)}
                    >
                      <i className="fas fa-paper-plane"></i>
                      Enviar Candidatura
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;