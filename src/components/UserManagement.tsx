import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon,
  TrashIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import type { User, UserRole, UserFilters } from '../types';
import UserModal from './UserModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface UserManagementProps {
  translations: {
    users: string;
    addUser: string;
    searchUsers: string;
    filterUsers: string;
    noUsersFound: string;
    totalUsers: string;
    activeUsers: string;
    edit: string;
    delete: string;
    active: string;
    inactive: string;
    lastLogin: string;
    never: string;
    allRoles: string;
    allCompanies: string;
    roleAdmin: string;
    coordinator: string;
    sst_specialist: string;
    nurse: string;
    employee: string;
    confirmDelete: string;
    confirmDeleteMessage: string;
    deleteUserTitle: string;
    cancel: string;
    editUser: string;
    userName: string;
    userEmail: string;
    userPassword: string;
    userRole: string;
    userCompany: string;
    userDepartment: string;
    userPhone: string;
    userActive: string;
    save: string;
    required: string;
    invalidEmail: string;
    passwordMinLength: string;
  };
}

const UserManagement: React.FC<UserManagementProps> = ({ translations }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_auth_info:user_auth_info(email, last_sign_in_at)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      // Supabase no soporta joins directos, así que manejamos la estructura devuelta
      const formattedUsers: User[] = (data || []).map((profile: any) => ({
        id: profile.id,
        email: profile.user_auth_info?.email || `user_${profile.id.slice(0, 8)}@chec.com`,
        name: profile.name || 'Sin nombre',
        role: profile.role || 'employee',
        company: profile.company || '',
        department: profile.department || '',
        phone: profile.phone || '',
        is_active: profile.is_active !== false,
        last_login: profile.user_auth_info?.last_sign_in_at || profile.updated_at,
        created_at: profile.created_at,
        updated_at: profile.updated_at || profile.created_at
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesCompany = !filters.company || user.company === filters.company;
      const matchesActive = filters.is_active === undefined || user.is_active === filters.is_active;
      
      return matchesSearch && matchesRole && matchesCompany && matchesActive;
    });
  }, [users, searchTerm, filters]);

  const uniqueRoles = useMemo(() => 
    [...new Set(users.map(user => user.role))],
    [users]
  );

  const uniqueCompanies = useMemo(() => 
    [...new Set(users.map(user => user.company).filter(Boolean))],
    [users]
  );

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isOperationLoading) return;
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (userData: any) => {
    setIsOperationLoading(true);
    try {
      if (editingUser) {
        // Actualizar perfil de usuario existente
        const { error } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            role: userData.role,
            company: userData.company,
            department: userData.department,
            phone: userData.phone,
            is_active: userData.is_active
          })
          .eq('id', editingUser.id);
        
        if (error) throw error;

        // La actualización de contraseña requeriría una función RPC separada si es necesaria
        if (userData.password) {
          console.warn("Password update via UI requires a separate RPC function for security.");
        }
      } else {
        // Crear nuevo usuario llamando a la función de PostgreSQL
        const { error } = await supabase.rpc('create_new_user', {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
          company: userData.company,
          department: userData.department,
          phone: userData.phone
        });

        if (error) throw error;
      }
      
      await fetchUsers();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving user:', error);
      let message = error?.message || JSON.stringify(error);
      if (message === '{}') {
        message = String(error);
      }
      alert(`Error al guardar usuario: ${message}`);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsOperationLoading(true);
    try {
      // Desactivar usuario directamente en la tabla de perfiles
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      await fetchUsers();
      setDeletingUser(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      let message = error?.message || JSON.stringify(error);
      if (message === '{}') {
        message = String(error);
      }
      alert(`Error al eliminar usuario: ${message}`);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      'admin': translations.roleAdmin,
      'coordinator': translations.coordinator,
      'sst_specialist': translations.sst_specialist,
      'nurse': translations.nurse,
      'employee': translations.employee
    };
    return roleMap[role] || role;
  };

  const formatLastLogin = (lastLogin: string | undefined) => {
    if (!lastLogin) return translations.never;
    return new Date(lastLogin).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{translations.users}</h2>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {translations.addUser}
          </button>
        </div>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">{translations.totalUsers}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-sm text-gray-600">{translations.activeUsers}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Administradores</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {uniqueCompanies.length}
            </div>
            <div className="text-sm text-gray-600">Empresas</div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={translations.searchUsers}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filters.role || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole || undefined }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{translations.allRoles}</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>
                  {getRoleLabel(role as UserRole)}
                </option>
              ))}
            </select>
            
            <select
              value={filters.company || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value || undefined }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{translations.allCompanies}</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
            
            <select
              value={filters.is_active === undefined ? '' : filters.is_active.toString()}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                is_active: e.target.value === '' ? undefined : e.target.value === 'true' 
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="true">{translations.active}</option>
              <option value="false">{translations.inactive}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">{translations.noUsersFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último acceso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getRoleLabel(user.role as UserRole)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {translations.active}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          {translations.inactive}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastLogin(user.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          disabled={isOperationLoading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title={translations.edit}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          disabled={isOperationLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title={translations.delete}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={editingUser}
          isLoading={isOperationLoading}
          translations={translations}
          canUpdatePassword={false} // Password changes should be handled via a separate secure mechanism
        />
      )}

      {deletingUser && (
        <ConfirmDeleteModal
          isOpen={!!deletingUser}
          onClose={() => !isOperationLoading && setDeletingUser(null)}
          onConfirm={() => handleDeleteUser(deletingUser.id)}
          moduleName={deletingUser.name}
          isLoading={isOperationLoading}
          translations={{
            deleteModuleTitle: translations.deleteUserTitle,
            confirmDelete: translations.confirmDelete,
            confirmDeleteMessage: translations.confirmDeleteMessage,
            delete: translations.delete,
            cancel: translations.cancel
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;