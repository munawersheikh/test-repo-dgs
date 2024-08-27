import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
`;

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  backdrop-filter: blur(10px);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 5px;
`;

const Title = styled.h3`
  color: white;
  margin-bottom: 20px;
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
   margin-left:150px;

  &:hover {
    background-color: #d32f2f;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const SelectedInfo = styled.div`
  color: white;
  margin-bottom: 20px;
`;

const DateTimeContainer = styled.div`
  .react-datetime-picker__wrapper {
    background: white;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
  }
  .react-datetime-picker__inputGroup__input {
    font-size: 16px;
    width: auto;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TimeSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { site, options } = location.state as { site: string, options: string[] };
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
    // Navigate to the next screen or perform any action
    navigate('/collection-list');
  };

  return (
    <div style={{marginLeft:"30px", padding: "10px"}}>  
         <SelectedInfo>
    Site: {site} Node: {options.join(', ')}
  </SelectedInfo>
    <Container>
   
      <FormContainer>
        <Title style={{marginTop:"-120px"}}>Time Selection</Title>

    
        <RowContainer>
          <InputContainer>
            <Label>Start Time</Label>
            <DateTimeContainer>
              <DateTimePicker
                onChange={setStartTime}
                value={startTime}
                disableClock={true}
                clearIcon={null}
                calendarIcon={null}
                format="HH:mm:ss"
              />
            </DateTimeContainer>
          </InputContainer>
          <InputContainer>
            <Label>Stop Time</Label>
            <DateTimeContainer>
              <DateTimePicker
                onChange={setStopTime}
                value={stopTime}
                disableClock={true}
                clearIcon={null}
                calendarIcon={null}
                format="HH:mm:ss"
              />
            </DateTimeContainer>
          </InputContainer>
        </RowContainer>
        <RowContainer>
          <InputContainer>
            <Label>Start Date</Label>
            <DateTimeContainer>
              <DateTimePicker
                onChange={setStartDate}
                value={startDate}
                disableClock={true}
                clearIcon={null}
                calendarIcon={null}
                format="MM-dd-y"
              />
            </DateTimeContainer>
          </InputContainer>
          <InputContainer>
            <Label>Stop Date</Label>
            <DateTimeContainer>
              <DateTimePicker
                onChange={setStopDate}
                value={stopDate}
                disableClock={true}
                clearIcon={null}
                calendarIcon={null}
               format="MM-dd-y"
              />
            </DateTimeContainer>
          </InputContainer>
        </RowContainer>
        <Button onClick={handleSubmit}>Submit</Button>
      </FormContainer>
    </Container>

    </div>
  );
};

export default TimeSelection;