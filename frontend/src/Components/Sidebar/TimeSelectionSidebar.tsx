import React, { useState } from 'react';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h3`
  color: white;
  margin-bottom: 20px;
 
`;

const div = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 10px;
  width: 100%;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 5px;
  text-align: center;
`;

const Button = styled.button`
  padding: 2px;
  background-color: grey;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 40%;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #d32f2f;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const DateTimeContainer = styled.div`
  .react-datetime-picker__wrapper {
    background: #1f1f1f; /* Match the sidebar background color */
    border-radius: 5px;
    padding: 5px;
    width: 50%;
    border: 1px solid #444;
  }
  .react-datetime-picker__inputGroup__input {
    background: transparent;
    color: white;
    font-size: 14px;
    width: auto;
  }
  .react-datetime-picker__inputGroup__divider {
    color: white;
  }
  .react-datetime-picker__clear-button, .react-datetime-picker__calendar-button {
    color: white;
  }
  .react-calendar {
    background: #1f1f1f; /* Match the sidebar background color */
    border-radius: 5px;
    border: 1px solid #444;
    margin-right: 30px;
    max-width: 250px; /* Set max width for calendar */
  }
  .react-calendar__tile {
    color: white;
  }
  .react-calendar__tile--active {
    background: #d32f2f;
    color: white;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  width: 100%;
`;

const ColumnContainer = styled.div`
 
  flex-direction: column;
  margin-bottom: 5px;
  width: 100%;
`;

const TimeSelectionSidebarSidebar = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [stopTime, setStopTime] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [stopDate, setStopDate] = useState<Date | null>(new Date());

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Start Time:', startTime);
    console.log('Stop Time:', stopTime);
    console.log('Start Date:', startDate);
    console.log('Stop Date:', stopDate);
    navigate('/job-list');
  };

  return (
    <div className='w-full p-5'>
      <Title className='custom-title text-center'>Date/Time</Title>
      <hr className='mb-3 border border-[#2f2f2f]' />
      <div className=' grid grid-cols-2 gap-3 text-center'>
        <div>
          <Label>Start Date</Label>
          <DateTimeContainer className='w-full custom-calendar-width-full'>
            <DateTimePicker
              onChange={setStartDate}
              value={startDate}
              disableClock={true}
              clearIcon={null}
              calendarIcon={null}
              format="MM/dd/y"
            />
          </DateTimeContainer>
        </div>
        <div >
          <Label>Stop Date</Label>
          <DateTimeContainer className='w-full custom-calendar-width-full'>
            <DateTimePicker
              onChange={setStopDate}
              value={stopDate}
              disableClock={true}
              clearIcon={null}
              calendarIcon={null}
              format="MM/dd/y"
            />
          </DateTimeContainer>
        </div>
        <div >
          <Label>Start Time</Label>
          <DateTimeContainer className='w-full custom-calendar-width-full'>
            <DateTimePicker
              onChange={setStartTime}
              value={startTime}
              disableClock={true}
              clearIcon={null}
              calendarIcon={null}
              format="HH:mm:ss"
            />
          </DateTimeContainer>
        </div>
        <div >
          <Label>Stop Time</Label>
          <DateTimeContainer className='w-full custom-calendar-width-full'>
            <DateTimePicker
              onChange={setStopTime}
              value={stopTime}
              disableClock={true}
              clearIcon={null}
              calendarIcon={null}
              format="HH:mm:ss"
            />
          </DateTimeContainer>
        </div>
      </div>


      {/* <Button onClick={handleSubmit}>Submit</Button> */}
    </div>
  );
};

export default TimeSelectionSidebarSidebar;
