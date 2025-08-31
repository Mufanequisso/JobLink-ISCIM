import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, AdminUserUpdate } from '../types';
import api from '../services/api';
import '../style/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { 
      const response = await api.get('/admin/users'); 
      setUsers(response.data); 
    }
    catch (error) { console.error('Erro ao buscar usuários:', error); }
    finally { setLoading(false); }
  };

  // Lógica de paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Mudar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Próxima página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLogout = async () => { await logout(); };
  const handleEditUser = (user: User) => { setEditingUser(user); setShowEditModal(true); };
  const handleUpdateUser = async (userData: AdminUserUpdate) => {
    if (!editingUser) return;
    try { 
      setActionLoading(editingUser.id); 
      await api.put(`/admin/users/${editingUser.id}`, userData); 
      await fetchUsers(); 
      setShowEditModal(false); 
      setEditingUser(null); 
    }
    catch (error) { console.error('Erro ao atualizar usuário:', error); }
    finally { setActionLoading(null); }
  };
  const handleToggleStatus = async (userId: number) => {
    try { 
      setActionLoading(userId); 
      await api.patch(`/admin/users/${userId}/toggle-status`); 
      await fetchUsers(); 
    }
    catch (error) { console.error('Erro ao alterar status:', error); }
    finally { setActionLoading(null); }
  };
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    try { 
      setActionLoading(userId); 
      await api.delete(`/admin/users/${userId}`); 
      await fetchUsers(); 
    }
    catch (error) { console.error('Erro ao deletar usuário:', error); }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div>
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>Dashboard Administrativo</h1>
          <p>Bem-vindo, {user?.name}</p>
        </div>
        <div>
          <span className="badge badge-admin">Admin</span>
          <button className="btn btn-red" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-cards" style={{ display: 'flex', gap: '1rem', margin: '1rem 2rem' }}>
        <div className="stats-card">
          <div className="stats-icon bg-blue">👥</div>
          <div className="stats-content">
            <div>Total de Usuários</div>
            <div>{users.length}</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-green">✅</div>
          <div className="stats-content">
            <div>Usuários Ativos</div>
            <div>{users.filter(u => u.role === 'user').length}</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-purple">🔧</div>
          <div className="stats-content">
            <div>Administradores</div>
            <div>{users.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <h3>Lista de Usuários</h3>
        <table className="table">
          <thead>
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
            {currentUsers.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                    {u.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {u.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-blue" 
                      onClick={() => handleEditUser(u)}
                      disabled={actionLoading === u.id}
                    >
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button 
                      className={`btn ${u.is_active ? 'btn-red' : 'btn-green'}`} 
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={actionLoading === u.id}
                    >
                      {u.is_active ? (
                        <>
                          <i className="fas fa-user-slash"></i> Desativar
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-check"></i> Ativar
                        </>
                      )}
                    </button>
                    {u.role !== 'admin' && (
                      <button 
                        className="btn btn-red" 
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={actionLoading === u.id}
                      >
                        <i className="fas fa-trash-alt"></i> Deletar
                      </button>
                    )}
                    {actionLoading === u.id && (
                      <div className="loading-spinner" style={{display: 'inline-block', marginLeft: '5px'}}></div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        {users.length > usersPerPage && (
          <div className="pagination">
            <button 
              className="btn btn-gray" 
              onClick={prevPage} 
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i> Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                className={`btn ${currentPage === number ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className="btn btn-gray" 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
            >
              Próxima <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Usuário: {editingUser.name}</h3>
            </div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              handleUpdateUser({
                role: f.get('role') as 'user' | 'admin',
                is_active: f.get('is_active') === 'true',
                admin_notes: f.get('admin_notes') as string || undefined,
              });
            }}>
              <label>Função</label>
              <select name="role" defaultValue={editingUser.role}>
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
              <label>Status</label>
              <select name="is_active" defaultValue={editingUser.is_active.toString()}>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              <label>Observações do Admin</label>
              <textarea name="admin_notes" defaultValue={editingUser.admin_notes || ''} rows={3}></textarea>
              <div className="modal-actions">
                <button type="button" className="btn btn-gray" onClick={() => { setShowEditModal(false); setEditingUser(null); }}>
                  <i className="fas fa-times"></i> Cancelar
                </button>
                <button type="submit" className="btn btn-blue" disabled={actionLoading === editingUser.id}>
                  {actionLoading === editingUser.id ? (
                    <>
                      <div className="loading-spinner" style={{display: 'inline-block', marginRight: '5px'}}></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Salvar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;