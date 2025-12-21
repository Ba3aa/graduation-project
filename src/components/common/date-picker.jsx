import React, { useState, useEffect, useRef } from 'react';
import styles from './date-picker.module.css';

const DatePicker = ({ value, onChange, placeholder = "Select Date", error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef(null);

  // Initialize calendar view based on value prop
  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Format to YYYY-MM-DD for consistency with HTML date input
    const formatted = selected.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const totalDays = getDaysInMonth(currentDate);
    const startDay = getFirstDayOfMonth(currentDate);
    const daysArray = [];

    // Empty slots
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className={`${styles['day-cell']} ${styles['empty']}`}></div>);
    }

    // Days
    for (let i = 1; i <= totalDays; i++) {
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateString = dateToCheck.toISOString().split('T')[0];
      const isSelected = value === dateString;
      const isToday = new Date().toISOString().split('T')[0] === dateString;

      daysArray.push(
        <div
          key={i}
          className={`${styles['day-cell']} ${isSelected ? styles['selected'] : ''} ${isToday ? styles['today'] : ''}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className={styles['date-picker-wrapper']} ref={containerRef}>
      <div 
        className={`${styles['date-picker-input-container']} ${error ? styles['has-error'] : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${styles['date-display']} ${!value ? styles['placeholder'] : ''}`}>
          {value || placeholder}
        </span>
        <CalendarIcon />
      </div>

      {isOpen && (
        <div className={styles['calendar-dropdown']}>
          <div className={styles['calendar-header']}>
            <button type="button" className={styles['nav-btn']} onClick={() => changeMonth(-1)}>&lt;</button>
            <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button type="button" className={styles['nav-btn']} onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          
          <div className={styles['weekdays-row']}>
            {daysShort.map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className={styles['days-grid']}>
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ opacity: 0.6 }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default DatePicker;