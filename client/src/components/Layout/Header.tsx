import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const SearchSection = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #4a5568;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: #f56565;
  border-radius: 50%;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserInfo = styled.div`
  text-align: left;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #718096;
`;

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.open ? 'block' : 'none'};
  margin-top: 8px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #4a5568;
  }
`;

const DropdownText = styled.span`
  font-size: 14px;
  color: #2d3748;
`;

const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <SearchSection>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search for anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchSection>

      <RightSection>
        <NotificationButton>
          <Bell />
          <NotificationBadge />
        </NotificationButton>

        <UserMenu>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserAvatar>
              {user ? getUserInitials(user.fullName || user.username) : 'U'}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.fullName || user?.username || 'User'}</UserName>
              <UserRole>{user?.role || 'Member'}</UserRole>
            </UserInfo>
          </UserButton>

          <DropdownMenu open={userMenuOpen}>
            <DropdownItem onClick={() => setUserMenuOpen(false)}>
              <User />
              <DropdownText>Profile</DropdownText>
            </DropdownItem>
            <DropdownItem onClick={() => setUserMenuOpen(false)}>
              <Settings />
              <DropdownText>Settings</DropdownText>
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <LogOut />
              <DropdownText>Logout</DropdownText>
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;