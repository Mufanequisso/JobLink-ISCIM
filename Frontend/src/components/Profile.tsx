import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadCV, updateEmploymentStatus } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    graduation_year: '',
    current_position: '',
    experience: '',
    education: '',
    skills: '',
    bio: ''
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        course: user.course || '',
        graduation_year: user.graduation_year?.toString() || '',
        current_position: user.current_position || '',
        experience: user.experience || '',
        education: user.education || '',
        skills: user.skills || '',
        bio: user.bio || ''
      });
      setEmploymentStatus(user.employment_status || '');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateProfile({
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : undefined
      });
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;
    setIsLoading(true);
    try {
      await uploadCV(cvFile);
      toast.success('CV enviado com sucesso!');
      setCvFile(null);
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Erro ao enviar CV. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmploymentStatusUpdate = async (status: string) => {
    if (!status) return;
    setIsLoading(true);
    try {
      const updatedUser = await updateEmploymentStatus(status);
      if (updateUser) {
        updateUser(updatedUser);
      }
      toast.success('Status de emprego atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating employment status:', error);
      toast.error('Erro ao atualizar status de emprego');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Editar Perfil
          </button>
        ) : (
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Nome */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome Completo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                ) : (
                  user.name || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Email */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                ) : (
                  user.email || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Telefone */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="(00) 00000-0000"
                  />
                ) : (
                  user.phone || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Curso */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Curso</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: Ciência da Computação"
                  />
                ) : (
                  user.course || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Ano de Formação */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ano de Formação</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleNumberChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: 2023"
                    maxLength={4}
                  />
                ) : (
                  user.graduation_year || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Status de Emprego */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status de Emprego</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="employed">Empregado</option>
                      <option value="seeking">Procurando emprego</option>
                      <option value="entrepreneur">Empreendedor</option>
                      <option value="other">Outro</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleEmploymentStatusUpdate(employmentStatus)}
                      disabled={!employmentStatus || isLoading}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Salvando...' : 'Atualizar'}
                    </button>
                  </div>
                ) : (
                  <span className="capitalize">
                    {user.employment_status || <span className="text-gray-400">Não informado</span>}
                  </span>
                )}
              </dd>
            </div>

            {/* Cargo Atual */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cargo Atual</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="current_position"
                    value={formData.current_position}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: Desenvolvedor Full Stack"
                  />
                ) : (
                  user.current_position || <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Experiência Profissional */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Experiência Profissional</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Descreva sua experiência profissional"
                  />
                ) : user.experience ? (
                  <p className="whitespace-pre-line">{user.experience}</p>
                ) : (
                  <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Formação Acadêmica */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Formação Acadêmica</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Descreva sua formação acadêmica"
                  />
                ) : user.education ? (
                  <p className="whitespace-pre-line">{user.education}</p>
                ) : (
                  <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Habilidades */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Habilidades</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Separe as habilidades por vírgula"
                  />
                ) : user.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.split(',').map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Sobre mim */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sobre mim</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Conte um pouco sobre você"
                  />
                ) : user.bio ? (
                  <p className="whitespace-pre-line">{user.bio}</p>
                ) : (
                  <span className="text-gray-400">Não informado</span>
                )}
              </dd>
            </div>

            {/* Currículo */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Currículo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {isEditing ? (
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                          type="button"
                          onClick={handleCvUpload}
                          disabled={!cvFile || isLoading}
                          className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isLoading ? 'Enviando...' : 'Enviar CV'}
                        </button>
                      </div>
                      {user.cv_url && (
                        <p className="mt-2 text-sm text-gray-600">
                          CV atual: <a href={user.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visualizar CV</a>
                        </p>
                      )}
                    </div>
                  ) : user.cv_url ? (
                    <a 
                      href={user.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Visualizar CV
                    </a>
                  ) : (
                    <span className="text-gray-400">Nenhum arquivo enviado</span>
                  )}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
