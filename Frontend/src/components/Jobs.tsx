import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Briefcase, MapPin, Building, Clock, DollarSign, TrendingUp, Wifi,
  Search, Filter, X, ChevronDown, ChevronUp, Send, Check, Upload,
  User, Mail, Phone, FileText, Award, Grid, List, BarChart3, ChartPie,
  Heart, Bookmark, Star, ArrowRight, Calendar, Users, Globe
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

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

const COLORS = {
  primary: '#EA580C',
  primaryLight: '#FB923C',
  primaryDark: '#C2410C',
  secondary: '#FED7AA',
  accent: '#FFEDD5',
  success: '#16A34A',
  warning: '#EAB308',
  danger: '#DC2626',
  blue: '#2563EB',
  purple: '#7C3AED'
};

const Jobs: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState<number | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
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

  const prepareChartData = () => {
    const typeData = [
      { name: 'Tempo Integral', value: jobs.filter(job => job.type === 'full-time').length, color: COLORS.primary },
      { name: 'Meio Período', value: jobs.filter(job => job.type === 'part-time').length, color: COLORS.blue },
      { name: 'Contrato', value: jobs.filter(job => job.type === 'contract').length, color: COLORS.purple },
      { name: 'Estágio', value: jobs.filter(job => job.type === 'internship').length, color: COLORS.success },
    ];

    const locationData = [
      { name: 'Remoto', value: jobs.filter(job => job.isRemote).length, color: COLORS.primary },
      { name: 'Presencial', value: jobs.filter(job => !job.isRemote).length, color: COLORS.blue },
    ];

    const experienceData = [
      { name: 'Júnior', value: jobs.filter(job => job.experience === 'Júnior').length, color: COLORS.primary },
      { name: 'Pleno', value: jobs.filter(job => job.experience === 'Pleno').length, color: COLORS.blue },
      { name: 'Sênior', value: jobs.filter(job => job.experience === 'Sênior').length, color: COLORS.purple },
      { name: 'Estagiário', value: jobs.filter(job => job.experience === 'Estagiário').length, color: COLORS.success },
    ];

    const salaryData = [
      { range: 'Até R$ 3.000', count: jobs.filter(job => job.salary && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) <= 3000).length },
      { range: 'R$ 3.001 - R$ 6.000', count: jobs.filter(job => job.salary && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) > 3000 && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) <= 6000).length },
      { range: 'R$ 6.001 - R$ 9.000', count: jobs.filter(job => job.salary && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) > 6000 && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) <= 9000).length },
      { range: 'Acima de R$ 9.000', count: jobs.filter(job => job.salary && parseInt(job.salary.split(' - ')[0].replace('R$ ', '').replace('.', '')) > 9000).length },
    ];

    return { typeData, locationData, experienceData, salaryData };
  };

  const { typeData, locationData, experienceData, salaryData } = prepareChartData();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    if (!percent) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyClick = (jobId: number) => {
    setShowApplicationForm(jobId);
    setFormErrors({});
    if (user) {
      setApplicationData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

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

    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
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

      if (formErrors.resume) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 font-medium">Carregando vagas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50">
      {/* Header Modernizado */}
      <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="/img/logo.png"
                    alt="Logo JobLink ISCIM"
                    className="h-12 w-auto filter drop-shadow-lg"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-full opacity-20 blur"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                    JobLink ISCIM
                  </h1>
                  <p className="text-sm text-gray-600">Portal de Oportunidades</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full">
                  <User className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-700">Olá, {user?.name}</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-full">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">Candidato</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group relative px-6 py-2 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Sair</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-rose-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de Busca e Filtros Modernizada */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por cargo, empresa, localização ou tecnologia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur border-2 border-gray-200 rounded-xl px-6 py-4 pr-12 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="contract">Contrato</option>
                  <option value="internship">Estágio</option>
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur border-2 border-gray-200 rounded-xl px-6 py-4 pr-12 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="all">Todos os regimes</option>
                  <option value="remote">Remoto</option>
                  <option value="office">Presencial</option>
                </select>
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas Modernizados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {[
            {
              icon: Briefcase,
              value: jobs.length,
              label: 'Vagas Disponíveis',
              color: 'from-orange-500 to-rose-500',
              bgColor: 'from-orange-100 to-rose-100'
            },
            {
              icon: Wifi,
              value: jobs.filter(job => job.isRemote).length,
              label: 'Oportunidades Remotas',
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-100 to-cyan-100'
            },
            {
              icon: Building,
              value: jobs.filter(job => !job.isRemote).length,
              label: 'Vagas Presenciais',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-100 to-emerald-100'
            }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de Visualização Modernizados */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Análise do Mercado
              </h3>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  showCharts 
                    ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showCharts ? (
                  <>
                    <X className="w-4 h-4 mr-2 inline" />
                    Ocultar Análises
                  </>
                ) : (
                  <>
                    <ChartPie className="w-4 h-4 mr-2 inline" />
                    Mostrar Análises
                  </>
                )}
              </button>

              <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-lg text-orange-600 transform scale-105' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em grade"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-lg text-orange-600 transform scale-105' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Visualização em lista"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos Modernizados */}
        {showCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {[
              { title: 'Distribuição por Tipo', data: typeData, type: 'pie' },
              { title: 'Distribuição por Regime', data: locationData, type: 'bar' },
              { title: 'Distribuição por Experiência', data: experienceData, type: 'bar' },
              { title: 'Distribuição por Faixa Salarial', data: salaryData, type: 'bar' }
            ].map((chart, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                <div className="relative bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full mr-3"></div>
                    {chart.title}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {chart.type === 'pie' ? (
                      <RechartsPieChart>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={renderCustomizedLabel}
                          labelLine={false}
                        >
                          {chart.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    ) : (
                      <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey={chart.data === salaryData ? "range" : "name"} stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Bar
                          dataKey={chart.data === salaryData ? "count" : "value"}
                          fill="url(#barGradient)"
                          radius={[8, 8, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EA580C" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FB923C" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista/Grade de Vagas Modernizada */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12' 
          : 'space-y-6 mb-12'
        }>
          {filteredJobs.map((job) => (
            <div key={job.id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-all duration-300 blur"></div>
              <div className={`relative bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                viewMode === 'grid' ? 'h-full flex flex-col' : ''
              }`}>
                
                {/* Header do Card */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{job.location}</span>
                        </div>
                        {job.isRemote && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full">
                            <Wifi className="w-3 h-3 text-blue-600" />
                            <span className="text-blue-700 text-xs font-medium">Remoto</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSaveJob(job.id)}
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        savedJobs.includes(job.id)
                          ? 'bg-red-100 text-red-600 shadow-lg'
                          : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                      job.type === 'full-time' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' :
                      job.type === 'part-time' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' :
                      job.type === 'contract' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                      'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                    }`}>
                      {job.type === 'full-time' ? 'Tempo Integral' :
                       job.type === 'part-time' ? 'Meio Período' :
                       job.type === 'contract' ? 'Contrato' : 'Estágio'}
                    </span>
                    
                    {job.experience && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm">
                        {job.experience}
                      </span>
                    )}
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.description.substring(0, viewMode === 'grid' ? 120 : 200)}
                    {job.description.length > (viewMode === 'grid' ? 120 : 200) && '...'}
                  </p>

                  {/* Detalhes Expandidos */}
                  {showDetails === job.id && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-orange-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Star className="w-4 h-4 text-orange-500 mr-2" />
                        Requisitos e Competências
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="px-3 py-2 bg-white/80 text-orange-800 rounded-lg text-sm font-medium shadow-sm border border-orange-200">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer do Card */}
                <div className="px-6 pb-6 mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    {job.salary && (
                      <div className="flex items-center text-green-700 font-bold">
                        <DollarSign className="w-5 h-5 mr-1" />
                        <span className="text-lg">{job.salary}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(job.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => toggleDetails(job.id)}
                      className="flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors duration-300"
                    >
                      {showDetails === job.id ? (
                        <>
                          <ChevronUp className="w-5 h-5 mr-1" />
                          Menos detalhes
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5 mr-1" />
                          Ver detalhes
                        </>
                      )}
                    </button>

                    {appliedJobs.includes(job.id) ? (
                      <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-medium shadow-lg">
                        <Check className="w-5 h-5 mr-2" />
                        Candidatura Enviada
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(job.id)}
                        className="group relative px-6 py-2 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="relative z-10 flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Candidatar-se
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-rose-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio Modernizado */}
        {filteredJobs.length === 0 && (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-2xl opacity-10 blur"></div>
            <div className="relative bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma oportunidade encontrada</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou termos de busca para descobrir novas vagas.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedLocation('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Modal de Candidatura Modernizado */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
            <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full mx-4 my-8 overflow-hidden border border-white/20">
              <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent flex items-center">
                    <Send className="w-6 h-6 mr-3 text-orange-600" />
                    Candidatar-se à Vaga
                  </h2>
                  <button
                    onClick={() => setShowApplicationForm(null)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-6 mb-8 border border-orange-100">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {jobs.find(job => job.id === showApplicationForm)?.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1 text-orange-500" />
                      {jobs.find(job => job.id === showApplicationForm)?.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      {jobs.find(job => job.id === showApplicationForm)?.location}
                    </span>
                  </div>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <User className="w-6 h-6 mr-3 text-orange-600" />
                      Informações Pessoais
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={applicationData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 ${
                            formErrors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Seu nome completo"
                        />
                        {formErrors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 ${
                            formErrors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="seu@email.com"
                        />
                        {formErrors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={applicationData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="(11) 99999-9999"
                        />
                        {formErrors.phone && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-orange-600" />
                      Documentos
                    </h3>

                    <div className="mb-6">
                      <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">
                        Currículo (PDF, DOC, DOCX) *
                      </label>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="resume"
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 rounded-xl cursor-pointer hover:from-orange-200 hover:to-rose-200 transition-all duration-300 font-medium shadow-lg"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Escolher Arquivo
                        </label>
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                        {applicationData.resume && (
                          <span className="text-sm text-gray-600 flex items-center bg-green-100 px-3 py-2 rounded-lg">
                            <FileText className="w-4 h-4 mr-2 text-green-600" />
                            {applicationData.resume.name}
                          </span>
                        )}
                      </div>
                      {formErrors.resume && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {formErrors.resume}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-2">
                        Carta de Apresentação (Opcional)
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={applicationData.coverLetter}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 resize-none"
                        placeholder="Conte um pouco sobre você e por que tem interesse nesta oportunidade..."
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="sticky bottom-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowApplicationForm(null)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleApplicationSubmit(showApplicationForm)}
                  className="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Candidatura
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-rose-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Básico */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/img/logo.png"
                  alt="Logo JobLink ISCIM"
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                    JobLink ISCIM
                  </h3>
                  <p className="text-sm text-gray-600">Portal de Oportunidades</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Conectando talentos às melhores oportunidades de carreira. 
                Encontre sua próxima oportunidade profissional com facilidade e eficiência.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Como Funciona</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Suporte</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Dicas de Carreira</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Preparação CV</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Entrevistas</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors duration-300">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 JobLink ISCIM. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors duration-300">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors duration-300">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Jobs;