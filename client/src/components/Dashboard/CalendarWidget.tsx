import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CalendarTitle = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const NavigationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #666;
  }
`;

const MonthYear = styled.div`
  color: #333;
  font-weight: 500;
  font-size: 16px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background: #f5f5f5;
  padding: 12px 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

const DayCell = styled.div<{ 
  isToday?: boolean; 
  isOtherMonth?: boolean; 
  hasActivity?: boolean;
}>`
  background: white;
  padding: 12px 4px;
  text-align: center;
  font-size: 14px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  color: ${props => 
    props.isOtherMonth ? '#ccc' : 
    props.isToday ? '#fff' : '#333'};
  
  background-color: ${props => 
    props.isToday ? '#4caf50' : 'white'};
  
  &:hover {
    background-color: ${props => 
      props.isToday ? '#45a049' : '#f5f5f5'};
  }
  
  ${props => props.hasActivity && `
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${props.isToday ? '#fff' : '#2196f3'};
    }
  `}
`;

const ActivityIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #ff9800;
`;

const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<any>({});

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const hasActivity = (day: number) => {
    // Simulate some activity data
    const activityDays = [5, 12, 18, 23, 28];
    return activityDays.includes(day);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar grid
  const calendarDays = [];
  
  // Previous month's days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isOtherMonth: true,
      isToday: false,
      hasActivity: false
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isOtherMonth: false,
      isToday: isToday(day),
      hasActivity: hasActivity(day)
    });
  }
  
  // Next month's days to fill the grid
  const remainingCells = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isOtherMonth: true,
      isToday: false,
      hasActivity: false
    });
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>Calendar</CalendarTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavigationButton onClick={() => navigateMonth('prev')}>
            <ChevronLeft />
          </NavigationButton>
          <MonthYear>
            {monthNames[currentMonth]} {currentYear}
          </MonthYear>
          <NavigationButton onClick={() => navigateMonth('next')}>
            <ChevronRight />
          </NavigationButton>
        </div>
      </CalendarHeader>

      <CalendarGrid>
        {dayNames.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {calendarDays.slice(0, 42).map((dayInfo, index) => (
          <DayCell
            key={index}
            isToday={dayInfo.isToday}
            isOtherMonth={dayInfo.isOtherMonth}
            hasActivity={dayInfo.hasActivity}
          >
            {dayInfo.day}
          </DayCell>
        ))}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default CalendarWidget;