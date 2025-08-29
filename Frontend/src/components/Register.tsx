import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Phone, GraduationCap, Calendar, UserCheck, FileText } from 'lucide-react';
import { authService } from '../services/api';
import { socialAuthService } from '../services/socialAuth';
import type { RegisterRequest } from '../types';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(8, 'Senha deve ter pelo menos 8 caracteres').required('Senha é obrigatória'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  phone: yup.string().optional(),
  course: yup.string().optional(),
  graduation_year: yup.number().optional().min(1900).max(new Date().getFullYear() + 10),
  employment_status: yup.string().oneOf(['employed', 'seeking', 'entrepreneur', 'other']).optional(),
  bio: yup.string().optional(),
});

const employmentStatusOptions = [
  { value: 'employed', label: 'Empregado' },
  { value: 'seeking', label: 'À procura de emprego' },
  { value: 'entrepreneur', label: 'Empreendedor' },
  { value: 'other', label: 'Outro' },
];

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Verificar resultado de redirect social ao carregar o componente
  useEffect(() => {
    const checkSocialRedirect = async () => {
      try {
        const socialUser = await socialAuthService.getRedirectResult();
        if (socialUser) {
          await handleSocialRegister(socialUser);
        }
      } catch (error: any) {
        console.error('Erro ao verificar redirect social:', error);
        setError(error?.message || 'Erro ao verificar redirect social');
      }
    };

    checkSocialRedirect();
  }, []);

  const handleSocialRegister = async (socialUser: any) => {
    setIsSocialLoading(true);
    setError('');

    try {
      const response = await socialAuthService.registerSocialUser(socialUser);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess('Cadastro social realizado com sucesso! Redirecionando para login...');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Erro no cadastro social');
    } finally {
      setIsSocialLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(data as RegisterRequest);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao JobLink ISCIM
          </p>
        </div>

        <div className="card">
          {/* Botões de Autenticação Social */}
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Ou cadastre-se rapidamente com:</p>
            </div>
            
            {/* Botão Google */}
            <button
              type="button"
              onClick={async () => {
                try {
                  setIsSocialLoading(true);
                  setError('');
                  const socialUser = await socialAuthService.smartSignInWithGoogle();
                  // Se for redirect, socialUser será null e o fluxo continua no useEffect
                  if (socialUser) {
                    await handleSocialRegister(socialUser);
                  }
                } catch (err: any) {
                  setError(err?.message || 'Erro no cadastro com Google');
                } finally {
                  setIsSocialLoading(false);
                }
              }}
              disabled={isSocialLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSocialLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Cadastrar com Google
                </>
              )}
            </button>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('name')}
                      type="text"
                      className="input-field pl-10"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Telefone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-field pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Curso */}
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                    Curso
                  </label>
                  <div className="mt-1 relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('course')}
                      type="text"
                      className="input-field pl-10"
                      placeholder="Ex: Ciência da Computação"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ano de Graduação */}
                <div>
                  <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700">
                    Ano de Graduação
                  </label>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('graduation_year', { valueAsNumber: true })}
                      type="number"
                      className="input-field pl-10"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                </div>

                {/* Status de Emprego */}
                <div>
                  <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">
                    Status de Emprego
                  </label>
                  <div className="mt-1 relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      {...register('employment_status')}
                      className="input-field pl-10"
                    >
                      <option value="">Selecione um status</option>
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Segurança
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha *
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('password')}
                      type="password"
                      className="input-field pl-10"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirmação de Senha */}
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha *
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...register('password_confirmation')}
                      type="password"
                      className="input-field pl-10"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-error">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Biografia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Sobre Você
              </h3>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Biografia
                </label>
                <div className="mt-1 relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="input-field pl-10 resize-none"
                    placeholder="Conte um pouco sobre você, suas experiências, interesses..."
                  />
                </div>
              </div>
            </div>

            {/* Mensagens de erro e sucesso */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>

            {/* Link para Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <a href="/login" className="font-medium text-primary hover:text-blue-700">
                  Faça login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
