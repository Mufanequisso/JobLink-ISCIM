import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { socialAuthService } from '../services/socialAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Verificar resultado de redirect social ao carregar o componente
  useEffect(() => {
    const checkSocialRedirect = async () => {
      try {
        const socialUser = await socialAuthService.getRedirectResult();
        if (socialUser) {
          await handleSocialLoginResult(socialUser);
        }
      } catch (error: any) {
        console.error('Erro ao verificar redirect social:', error);
        setError(error?.message || 'Erro ao verificar redirect social');
      }
    };

    checkSocialRedirect();
  }, []);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }
    
    if (!password.trim()) {
      errors.password = 'Senha é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSocialLoginResult = async (socialUser: any) => {
    try {
      setIsSocialLoading(true);
      setError('');
      const response = await socialAuthService.quickSocialLogin(socialUser);
      // O contexto de autenticação será atualizado automaticamente
      // através do localStorage que já foi definido no quickSocialLogin
      window.location.reload(); // Recarregar para atualizar o contexto
    } catch (err: any) {
      setError(err?.message || 'Erro no login social');
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // O redirecionamento será feito automaticamente pelo contexto
      // baseado no role do usuário
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSocialLogin = async () => {
    try {
      setIsSocialLoading(true);
      setError('');
      const socialUser = await socialAuthService.smartSignInWithGoogle();
      if (socialUser) {
        // Processar login social
        const response = await socialAuthService.quickSocialLogin(socialUser);
        // O contexto de autenticação será atualizado automaticamente
        // através do localStorage que já foi definido no quickSocialLogin
        window.location.reload(); // Recarregar para atualizar o contexto
      }
    } catch (err: any) {
      setError(err?.message || 'Erro no login com Google');
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-amber-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-600 text-lg">
            Entre na sua conta <span className="font-semibold text-orange-600">JobLink ISCIM</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-lg py-8 px-6 shadow-2xl shadow-orange-500/10 rounded-2xl border border-white/20 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>
          
          {/* Social Login */}
          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={handleSocialLogin}
              disabled={isSocialLoading}
              className="w-full group relative overflow-hidden flex justify-center items-center px-6 py-4 bg-white border-2 border-gray-200 hover:border-orange-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {isSocialLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3 relative z-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-700 relative z-10">Continuar com Google</span>
                </>
              )}
            </button>

            {/* Separador */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white/80 text-gray-500 text-sm font-medium">ou</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`appearance-none block w-full px-4 py-3 pl-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="seu@email.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Senha <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`appearance-none block w-full px-4 py-3 pl-12 pr-12 bg-white/50 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 ${
                    formErrors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Digite sua senha"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs mr-2">!</span>
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Mensagem de erro geral */}
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

            {/* Botão de Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full group relative overflow-hidden flex justify-center py-4 px-6 border border-transparent rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:hover:bg-gradient-to-r disabled:hover:from-orange-500 disabled:hover:to-amber-500 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {isLoading ? (
                  <div className="flex items-center relative z-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Entrando...
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center">
                    Entrar na conta
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Link para Register */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <a 
                  href="/register" 
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                >
                  Crie uma na JobLink
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Protegido por autenticação segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;