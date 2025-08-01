import React from 'react';
import styled from 'styled-components';

const Card = styled.div<{ color: string }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  color: #666;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const TrendContainer = styled.div<{ trend: 'up' | 'down' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.trend === 'up' ? '#4caf50' : '#f44336'};
  font-size: 12px;
  font-weight: 500;
`;

const TrendIcon = styled.span<{ trend: 'up' | 'down' }>`
  &::before {
    content: ${props => props.trend === 'up' ? '"↗"' : '"↘"'};
  }
`;

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  subtitle
}) => {
  return (
    <Card color={color}>
      <CardHeader>
        <Title>{title}</Title>
        <IconContainer color={color}>
          {icon}
        </IconContainer>
      </CardHeader>
      
      <Value>{value}</Value>
      
      <TrendContainer trend={trend}>
        <TrendIcon trend={trend} />
        {subtitle || `${trend === 'up' ? 'Increase' : 'Decrease'} from last month`}
      </TrendContainer>
    </Card>
  );
};

export default StatsCard;