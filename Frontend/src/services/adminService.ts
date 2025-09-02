import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  last_login_at: string | null;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUserUpdate {
  role: 'user' | 'admin';
  is_active: boolean;
  admin_notes?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentLogins: number;
  userGrowth: Array<{ date: string; count: number }>;
  loginActivity: Array<{ date: string; count: number }>;
  roleDistribution: Array<{ role: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
}

export const adminService = {
  // Buscar todos os usuários
  async getUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Atualizar um usuário
  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data.user;
  },

  // Alternar status de um usuário
  async toggleUserStatus(userId: number): Promise<{ user: User; message: string }> {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // Deletar um usuário
  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Buscar estatísticas do painel de administração
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Formatar dados para os gráficos
  formatChartData(users: User[], periodDays: number = 30) {
    const now = new Date();
    
    // Dados de registros por dia
    const registrationData = [];
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      const registrations = users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.toDateString() === date.toDateString();
      }).length;
      
      registrationData.push({
        date: dateStr,
        registros: registrations,
        ativos: Math.floor(registrations * 0.8) // Aproximação
      });
    }
    
    // Dados de login por mês
    const loginData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      const logins = users.filter(user => {
        if (!user.last_login_at) return false;
        const loginDate = new Date(user.last_login_at);
        return loginDate.getMonth() === date.getMonth() && 
               loginDate.getFullYear() === date.getFullYear();
      }).length;
      
      loginData.push({
        mes: monthStr,
        logins: logins
      });
    }
    
    // Distribuição por papel
    const roleData = [
      { name: 'Usuários', value: users.filter(u => u.role === 'user').length, color: '#EA580C' },
      { name: 'Administradores', value: users.filter(u => u.role === 'admin').length, color: '#9A3412' }
    ];
    
    // Status dos usuários
    const statusData = [
      { name: 'Ativos', value: users.filter(u => u.is_active).length, color: '#16A34A' },
      { name: 'Inativos', value: users.filter(u => !u.is_active).length, color: '#DC2626' }
    ];

    return { registrationData, loginData, roleData, statusData };
  }
};

export default adminService;
