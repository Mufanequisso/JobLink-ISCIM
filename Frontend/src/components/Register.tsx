import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Phone, GraduationCap, Calendar, UserCheck, FileText } from 'lucide-react';
import { authService } from '../services/api';
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
}).required();

const employmentStatusOptions = [
  { value: 'employed', label: 'Empregado' },
  { value: 'seeking', label: 'À procura de emprego' },
  { value: 'entrepreneur', label: 'Empreendedor' },
  { value: 'other', label: 'Outro' },
];

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
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
