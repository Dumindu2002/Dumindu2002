import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { itemsAPI } from '../../services/api';
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

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  position: relative;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
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

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const ItemActions = styled.div`
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

const ItemDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemCategory = styled.span<{ category: string }>`
  background: ${props => {
    const colors = {
      Sales: '#e3f2fd',
      Users: '#f3e5f5',
      'Page visits': '#e8f5e8',
      Revenue: '#fff3e0',
      Orders: '#fce4ec',
      Traffic: '#e1f5fe'
    };
    return colors[category as keyof typeof colors] || '#f5f5f5';
  }};
  color: ${props => {
    const colors = {
      Sales: '#1976d2',
      Users: '#7b1fa2',
      'Page visits': '#388e3c',
      Revenue: '#f57c00',
      Orders: '#c2185b',
      Traffic: '#0288d1'
    };
    return colors[category as keyof typeof colors] || '#666';
  }};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const ItemValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`;

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  value: number;
  percentage: number;
  status: string;
  priority: string;
  createdAt: string;
}

const ItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchItems();
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        limit: 50
      });
      setItems(response.data.items);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemsAPI.delete(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading items...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Items Management</Title>
        <AddButton>
          <Plus size={16} />
          Add Item
        </AddButton>
      </Header>

      <Controls>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Sales">Sales</option>
          <option value="Users">Users</option>
          <option value="Page visits">Page visits</option>
          <option value="Revenue">Revenue</option>
          <option value="Orders">Orders</option>
          <option value="Traffic">Traffic</option>
        </FilterSelect>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </FilterSelect>
      </Controls>

      <ItemsGrid>
        {items.map((item) => (
          <ItemCard key={item._id}>
            <ItemHeader>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemActions>
                <ActionButton variant="edit">
                  <Edit />
                </ActionButton>
                <ActionButton 
                  variant="delete"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <Trash2 />
                </ActionButton>
              </ItemActions>
            </ItemHeader>

            <ItemDescription>{item.description}</ItemDescription>

            <ItemMeta>
              <ItemCategory category={item.category}>
                {item.category}
              </ItemCategory>
              <ItemValue>{formatValue(item.value)}</ItemValue>
            </ItemMeta>
          </ItemCard>
        ))}
      </ItemsGrid>

      {items.length === 0 && (
        <LoadingContainer>
          No items found. Try adjusting your search or filters.
        </LoadingContainer>
      )}
    </Container>
  );
};

export default ItemManagement;