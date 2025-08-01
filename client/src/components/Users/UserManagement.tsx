import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #a0aec0;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 150px;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const UserDetails = styled.div``;

const UserName = styled.h3`
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const UserEmail = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
`;

const UserUsername = styled.div`
  color: #999;
  font-size: 12px;
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => 
      props.variant === 'delete' ? '#fef2f2' : '#f7fafc'};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => 
      props.variant === 'delete' ? '#f56565' : '#4a5568'};
  }
`;

const UserMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const UserRole = styled.span<{ role: string }>`
  background: ${props => {
    const colors = {
      admin: '#fef2f2',
      manager: '#fff7ed',
      user: '#f0f9ff'
    };
    return colors[role as keyof typeof colors] || '#f5f5f5';
  }};
  color: ${props => {
    const colors = {
      admin: '#dc2626',
      manager: '#ea580c',
      user: '#2563eb'
    };
    return colors[role as keyof typeof colors] || '#666';
  }};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const UserStatus = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.active ? '#059669' : '#dc2626'};
  font-size: 12px;
  font-weight: 500;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`;

const AdminOnlyMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #dc2626;
  text-align: center;
  margin-top: 20px;
`;

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter ? statusFilter === 'active' : undefined,
        limit: 50
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(id);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  // Check if user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <Container>
        <Header>
          <Title>Users Management</Title>
        </Header>
        <AdminOnlyMessage>
          You need administrator privileges to access user management.
        </AdminOnlyMessage>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading users...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Users Management</Title>
        <AddButton>
          <Plus size={16} />
          Add User
        </AddButton>
      </Header>

      <Controls>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </FilterSelect>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </FilterSelect>
      </Controls>

      <UsersGrid>
        {users.map((user) => (
          <UserCard key={user._id}>
            <UserHeader>
              <UserInfo>
                <UserAvatar>
                  {getUserInitials(user)}
                </UserAvatar>
                <UserDetails>
                  <UserName>{user.fullName}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                  <UserUsername>@{user.username}</UserUsername>
                </UserDetails>
              </UserInfo>

              <UserActions>
                <ActionButton variant="edit">
                  <Edit />
                </ActionButton>
                <ActionButton 
                  variant="delete"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <Trash2 />
                </ActionButton>
              </UserActions>
            </UserHeader>

            <UserMeta>
              <UserRole role={user.role}>
                {user.role}
              </UserRole>
              <UserStatus active={user.isActive}>
                {user.isActive ? <UserCheck /> : <UserX />}
                {user.isActive ? 'Active' : 'Inactive'}
              </UserStatus>
            </UserMeta>
          </UserCard>
        ))}
      </UsersGrid>

      {users.length === 0 && (
        <LoadingContainer>
          No users found. Try adjusting your search or filters.
        </LoadingContainer>
      )}
    </Container>
  );
};

export default UserManagement;