import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Bookmark,
  Calendar
} from 'lucide-react';

const SidebarContainer = styled.div`
  width: 250px;
  background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #4a5568;
  margin-bottom: 20px;
`;

const LogoText = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Navigation = styled.nav`
  padding: 0 16px;
`;

const NavSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.div`
  color: #a0aec0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding: 0 8px;
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#a0aec0'};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  text-decoration: none;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Badge = styled.span`
  background: #f56565;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  const menuItems = [
    {
      section: 'Main',
      items: [
        { path: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
        { path: '/items', icon: <Package />, label: 'Items' },
        { path: '/users', icon: <Users />, label: 'Users' },
        { path: '/analytics', icon: <BarChart3 />, label: 'Analytics' },
      ]
    },
    {
      section: 'Tools',
      items: [
        { path: '/calendar', icon: <Calendar />, label: 'Calendar' },
        { path: '/bookmarks', icon: <Bookmark />, label: 'Bookmarks' },
        { path: '/messages', icon: <MessageSquare />, label: 'Messages', badge: '3' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { path: '/settings', icon: <Settings />, label: 'Settings' },
      ]
    }
  ];

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>DashCRUD</LogoText>
      </Logo>
      
      <Navigation>
        {menuItems.map((section, sectionIndex) => (
          <NavSection key={sectionIndex}>
            <SectionTitle>{section.section}</SectionTitle>
            {section.items.map((item, itemIndex) => (
              <NavItem 
                key={itemIndex}
                to={item.path} 
                active={isActive(item.path)}
              >
                {item.icon}
                <NavText>{item.label}</NavText>
                {item.badge && <Badge>{item.badge}</Badge>}
              </NavItem>
            ))}
          </NavSection>
        ))}
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;