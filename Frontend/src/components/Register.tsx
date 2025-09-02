import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Phone, GraduationCap, Calendar, UserCheck, FileText, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

// Schema de validação
const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(8, 'Senha deve ter pelo menos 8 caracteres').required('Senha é obrigatória'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  phone: yup.string().nullable(),
  course: yup.string().nullable(),
  graduation_year: yup.number()
    .nullable()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 10, 'Ano inválido')
    .typeError('Ano deve ser um número'),
  employment_status: yup.string().oneOf(['employed', 'seeking', 'entrepreneur', 'other', '']).nullable(),
  bio: yup.string().nullable(),
});

const employmentStatusOptions = [
  { value: '', label: 'Selecione um status' },
  { value: 'employed', label: 'Empregado' },
  { value: 'seeking', label: 'À procura de emprego' },
  { value: 'entrepreneur', label: 'Empreendedor' },
  { value: 'other', label: 'Outro' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Observar mudanças no campo de telefone para formatação
  const phoneValue = watch('phone');
  useEffect(() => {
    if (phoneValue) {
      const formattedValue = formatPhone(phoneValue);
      if (formattedValue !== phoneValue) {
        setValue('phone', formattedValue);
      }
    }
  }, [phoneValue, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar dados para enviar (remover confirmação de senha)
      const { password_confirmation, ...submitData } = data;
      
      // Limpar campos vazios
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          submitData[key] = null;
        }
      });

      const response = await authService.register(submitData);
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o dashboard...');
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        navigate('/Login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    if (!value) return value;
    
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-amber-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Junte-se a nós
          </h2>
          <p className="text-gray-600 text-lg">
            Crie sua conta no <span className="font-semibold text-orange-600">JobLink ISCIM</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-lg py-8 px-6 shadow-2xl shadow-orange-500/10 rounded-2xl border border-white/20 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>
          
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Informações Pessoais */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-orange-200">
                <User className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Informações Pessoais</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nome Completo <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('name')}
                      type="text"
                      className={`w-full px-4 py-3 pl-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-3 pl-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Curso */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Curso</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('course')}
                      type="text"
                      className="w-full px-4 py-3 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
                      placeholder="Ex: Ciência da Computação"
                    />
                  </div>
                </div>

                {/* Ano de Graduação */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ano de Graduação</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('graduation_year')}
                      type="number"
                      className={`w-full px-4 py-3 pl-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                        errors.graduation_year ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                  {errors.graduation_year && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                      {errors.graduation_year.message}
                    </p>
                  )}
                </div>

                {/* Status de Emprego */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Status de Emprego</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      {...register('employment_status')}
                      className="w-full px-4 py-3 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
                    >
                      {employmentStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-orange-200">
                <Lock className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Segurança</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Senha <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('password')}
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 pl-12 pr-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                        errors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirmação de Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirmar Senha <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('password_confirmation')}
                      type={showPasswordConfirm ? "text" : "password"}
                      className={`w-full px-4 py-3 pl-12 pr-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                        errors.password_confirmation ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Biografia */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-orange-200">
                <FileText className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Sobre Você</h3>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Biografia</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-4 py-3 pl-12 bg-white/50 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 resize-none"
                    placeholder="Conte um pouco sobre você, suas experiências, interesses..."
                  />
                </div>
              </div>
            </div>

            {/* Mensagens de erro e sucesso */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-sm animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-sm animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {/* Botão de Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative overflow-hidden flex justify-center py-4 px-6 border border-transparent rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {isLoading ? (
                  <div className="flex items-center relative z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Criando conta...
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center">
                    Criar Conta
                    <UserCheck className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                )}
              </button>
            </div>

            {/* Link para Login */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <a 
                  href="/login" 
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                >
                  Faça login
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Ao criar uma conta, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;