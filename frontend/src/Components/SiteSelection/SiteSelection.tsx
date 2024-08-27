import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Label = styled.label`
  color: white;
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

const SiteSelection: React.FC = () => {
    const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSiteChange = (site: string) => {
    if (selectedSite === site) {
      setSelectedSite(null);
      setSelectedOptions([]);
    } else {
      setSelectedSite(site);
      setSelectedOptions([]);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option]
    );
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Selected site:', selectedSite);
    console.log('Selected options:', selectedOptions);
    // Navigate to the next screen or perform any action

    navigate('/time-selection', {
        state: { site: selectedSite, options: selectedOptions },
      });
    
  };

  const initialSites = ['Tampa', 'Memphis'];
  const optionsMap: Record<string, string[]> = {
    Tampa: ['Signature', 'Terminal', 'Office'],
    Memphis: ['Cetacea', 'Hanger 12', 'Republican'],
  };

  return (
    <Container>
      <FormContainer>
        <Title>Select Site</Title>
        {initialSites.map((site) => (
          <div key={site}>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={selectedSite === site}
                onChange={() => handleSiteChange(site)}
              />
              <Label>{site}</Label>
            </CheckboxContainer>
            {selectedSite === site &&
              optionsMap[site].map((option) => (
                <CheckboxContainer key={option} style={{ marginLeft: '20px' }}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                  />
                  <Label>{option}</Label>
                </CheckboxContainer>
              ))}
          </div>
        ))}
        <Button
          onClick={handleSubmit}
          disabled={!selectedSite || selectedOptions.length === 0}
        >
          Submit
        </Button>
      </FormContainer>
    </Container>
  );
};

export default SiteSelection;
