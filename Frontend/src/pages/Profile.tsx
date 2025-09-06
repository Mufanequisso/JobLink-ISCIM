import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User, Mail, Phone, MapPin, Edit, Save, X, Upload,
  Lock, CheckCircle
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profilePicture: string | null;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    profilePicture: null
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockProfile: UserProfile = {
          name: user?.name || 'João Silva',
          email: user?.email || 'joao.silva@email.com',
          phone: '(11) 99999-9999',
          location: 'São Paulo, SP',
          bio: 'Desenvolvedor full-stack com 5 anos de experiência em React, Node.js e tecnologias modernas.',
          profilePicture: '/images/profile.jpg'
        };

        setProfileData(mockProfile);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (updateUser) {
        updateUser({
          name: profileData.name,
          email: profileData.email
        });
      }

      setEditMode(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para alterar senha
    alert('Senha alterada com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho do Perfil */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-8 border border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center overflow-hidden shadow-lg">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-colors">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData.location}
                </p>
              </div>

              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Salvar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-4">{profileData.bio}</p>
          </div>
        </div>
      </div>

      {/* Informações Pessoais */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-8 border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="w-6 h-6 mr-3 text-orange-600" />
          Informações Pessoais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Localização
            </label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Biografia
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            rows={4}
            disabled={!editMode}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Fale um pouco sobre você, sua experiência e objetivos profissionais..."
          />
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Lock className="w-6 h-6 mr-3 text-orange-600" />
          Segurança da Conta
        </h3>

        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-6 border border-orange-100 mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <h4 className="font-semibold text-gray-900">Sua conta está segura</h4>
          </div>
          <p className="text-gray-700">
            Recomendamos que você altere sua senha regularmente para maior segurança.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Alterar Senha</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  placeholder="Digite a nova senha"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Alterar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;