// src/components/AdminDashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, AdminUserUpdate } from '../types';
import api from '../services/api';

// Import CSS do DataTables
import '../assets/datatables/datatables.min.css';

// Import jQuery e DataTables localmente
import '../assets/jquery/jquery-3.6.0.min.js';
import '../assets/datatables/datatables.min.js';

// Permite usar $ do jQuery
declare const $: any;

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!loading && users.length > 0 && tableRef.current) {
      // Se DataTable já existe, destrói antes
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        ($(tableRef.current) as any).DataTable().destroy();
      }

      ($(tableRef.current) as any).DataTable({
        pageLength: 10,
        ordering: true,
        searching: true,
        responsive: true,
        stripeClasses: ['bg-orange-50', 'bg-orange-100'], // linhas zebradas em tons de laranja claro
        language: {
          emptyTable: "Sem dados disponíveis na tabela",
          info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 até 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ total de registros)",
          lengthMenu: "Mostrar _MENU_ registros por página",
          loadingRecords: "Carregando...",
          processing: "Processando...",
          search: "Filtrar:",
          zeroRecords: "Nenhum registro encontrado.",
          paginate: {
            first: "Primeiro",
            last: "Último",
            next: "Próximo",
            previous: "Anterior"
          }
        }
      });
    }
  }, [loading, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => await logout();
  const handleEditUser = (user: User) => { setEditingUser(user); setShowEditModal(true); };

  const handleUpdateUser = async (userData: AdminUserUpdate) => {
    if (!editingUser) return;
    try {
      setActionLoading(editingUser.id);
      await api.put(`/admin/users/${editingUser.id}`, userData);
      await fetchUsers();
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    } finally { setActionLoading(null); }
  };

  const handleToggleStatus = async (userId: number) => {
    try { setActionLoading(userId); await api.patch(`/admin/users/${userId}/toggle-status`); await fetchUsers(); }
    catch (error) { console.error('Erro ao alterar status:', error); } 
    finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    try { setActionLoading(userId); await api.delete(`/admin/users/${userId}`); await fetchUsers(); }
    catch (error) { console.error('Erro ao deletar usuário:', error); } 
    finally { setActionLoading(null); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="bg-white shadow-sm border-b mb-6 flex justify-between items-center py-4 px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Admin</span>
          <button onClick={handleLogout} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Sair</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-orange-600">
          <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
          <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-600">
          <dt className="text-sm font-medium text-gray-500 truncate">Usuários Ativos</dt>
          <dd className="text-lg font-medium text-gray-900">{users.filter(u => u.is_active).length}</dd>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-600">
          <dt className="text-sm font-medium text-gray-500 truncate">Administradores</dt>
          <dd className="text-lg font-medium text-gray-900">{users.filter(u => u.role === 'admin').length}</dd>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Usuários</h3>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="display stripe hover" style={{ width: '100%' }}>
            <thead className="bg-orange-50">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Status</th>
                <th>Último Login</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'admin' ? 'Admin' : 'Usuário'}</td>
                  <td>{u.is_active ? 'Ativo' : 'Inativo'}</td>
                  <td>{u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="flex gap-2">
                    <button onClick={() => handleEditUser(u)} disabled={actionLoading === u.id} className="text-orange-600 hover:text-orange-900">Editar</button>
                    <button onClick={() => handleToggleStatus(u.id)} disabled={actionLoading === u.id} className={`${u.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                      {actionLoading === u.id ? '...' : (u.is_active ? 'Desativar' : 'Ativar')}
                    </button>
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDeleteUser(u.id)} disabled={actionLoading === u.id} className="text-red-600 hover:text-red-900">
                        {actionLoading === u.id ? '...' : 'Deletar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-20">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Usuário: {editingUser.name}</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUser({
                role: formData.get('role') as 'user' | 'admin',
                is_active: formData.get('is_active') === 'true',
                admin_notes: formData.get('admin_notes') as string || undefined
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                  <select name="role" defaultValue={editingUser.role} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="is_active" defaultValue={editingUser.is_active.toString()} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações do Admin</label>
                  <textarea name="admin_notes" defaultValue={editingUser.admin_notes || ''} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); }} className="px-4 py-2 bg-gray-100 rounded-md">Cancelar</button>
                <button type="submit" disabled={actionLoading === editingUser.id} className="px-4 py-2 bg-orange-600 text-white rounded-md">{actionLoading === editingUser.id ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
