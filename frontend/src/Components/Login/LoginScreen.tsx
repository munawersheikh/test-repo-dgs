import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import logo from "../../assest/dgs_logo.png";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
  background-image: url('path-to-your-background-image.jpg');
  background-size: cover;
  background-position: center;
`;

const Logo = styled.img`
  position: absolute;
  width: 120px;
  height: auto;
`;

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #d32f2f;
  }
`;

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle login logic here
    console.log({ username, password });
    navigate('/site-selection');

  };

  return (


    <Container >
      <Logo style={{ marginBottom: "250px" }} src={logo} alt="Logo" />


      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="username@domain.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormContainer>
    </Container>
  );
};

export default LoginScreen;
