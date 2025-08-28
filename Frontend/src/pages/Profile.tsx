// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Download, Edit3, Save, X, Upload } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  course?: string;
  graduation_year?: number;
  employment_status?: string;
  bio?: string;
  cv_url?: string;
  created_at: string;
}

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  status: string;
  applied_date: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const loadUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Usar apenas dados reais do localStorage
        const realUser: UserProfile = {
          id: parsedUser.id || 1,
          name: parsedUser.name || 'Usuário',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          location: parsedUser.location || '',
          course: parsedUser.course || '',
          graduation_year: parsedUser.graduation_year || undefined,
          employment_status: parsedUser.employment_status || '',
          bio: parsedUser.bio || '',
          cv_url: parsedUser.cv_url || '',
          created_at: parsedUser.created_at || new Date().toISOString()
        };
        setUser(realUser);
        setEditForm(realUser);
      }
    };

    const loadApplications = () => {
      // Tentar carregar do localStorage ou deixar vazio
      const savedApplications = localStorage.getItem('user_applications');
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      } else {
        setApplications([]);
      }
    };

    loadUserData();
    loadApplications();
    setIsLoading(false);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Salvar no localStorage
      if (user) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        
        // Salvar no localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...editForm }));
        }
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm(user);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload - na prática você faria upload para um servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        const cvUrl = e.target?.result as string;
        setEditForm(prev => ({ ...prev, cv_url: cvUrl }));
        
        // Salvar no localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem('user', JSON.stringify({ ...parsedUser, cv_url: cvUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceite';
      case 'rejected': return 'Rejeitada';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const renderField = (label: string, value: string | undefined, field: keyof UserProfile, icon: React.ReactNode) => (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        {isEditing ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Adicionar ${label.toLowerCase()}`}
          />
        ) : (
          <p className="text-gray-900">
            {value || <span className="text-gray-400 italic">Não informado</span>}
          </p>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Perfil não encontrado</h2>
            <p className="text-gray-600">Faça login para acessar seu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Edit3 size={18} />
                Editar Perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save size={18} />
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-2">
              Informações Pessoais
            </h2>
            
            <div className="space-y-4">
              {renderField('Nome Completo', user.name, 'name', <User className="text-gray-400" size={20} />)}
              {renderField('Email', user.email, 'email', <Mail className="text-gray-400" size={20} />)}
              {renderField('Telefone', user.phone, 'phone', <Phone className="text-gray-400" size={20} />)}
              {renderField('Localização', user.location, 'location', <MapPin className="text-gray-400" size={20} />)}
              
              {/* Situação Profissional */}
              <div className="flex items-center gap-3">
                <Briefcase className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">Situação Profissional</label>
                  {isEditing ? (
                    <select
                      value={editForm.employment_status || ''}
                      onChange={(e) => handleInputChange('employment_status', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecionar situação</option>
                      <option value="seeking">À procura de emprego</option>
                      <option value="employed">Empregado</option>
                      <option value="entrepreneur">Empreendedor</option>
                      <option value="other">Outro</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {user.employment_status === 'seeking' && 'À procura de emprego'}
                      {user.employment_status === 'employed' && 'Empregado'}
                      {user.employment_status === 'entrepreneur' && 'Empreendedor'}
                      {user.employment_status === 'other' && 'Outro'}
                      {!user.employment_status && <span className="text-gray-400 italic">Não informado</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Ano de Formação */}
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">Ano de Formação</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.graduation_year || ''}
                      onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1900"
                      max="2030"
                      placeholder="Ex: 2023"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.graduation_year || <span className="text-gray-400 italic">Não informado</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Biografia */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Biografia</label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Conte um pouco sobre você, suas experiências, interesses..."
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {user.bio || <span className="text-gray-400 italic">Nenhuma biografia adicionada.</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum e Candidaturas */}
          <div className="space-y-6">
            {/* Curriculum Vitae */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Curriculum Vitae
              </h2>
              {user.cv_url ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600">CV atual</p>
                      <p className="text-gray-900 font-medium">meu_cv.pdf</p>
                    </div>
                    <a
                      href={user.cv_url}
                      download="meu_cv.pdf"
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download size={18} />
                      Baixar CV
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 mb-4">Nenhum CV enviado ainda.</p>
              )}
              
              <label className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                <Upload size={18} />
                {user.cv_url ? 'Substituir CV' : 'Enviar CV'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Histórico de Candidaturas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Histórico de Candidaturas
              </h2>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-2">Nenhuma candidatura encontrada.</p>
                    <p className="text-sm text-gray-500">Suas candidaturas aparecerão aqui.</p>
                  </div>
                ) : (
                  applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{application.job_title}</h3>
                          <p className="text-gray-600">{application.company_name}</p>
                          <p className="text-sm text-gray-500">
                            Candidatado em: {new Date(application.applied_date).toLocaleDateString('pt-MZ')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;