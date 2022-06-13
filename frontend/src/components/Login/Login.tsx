import React, { useState } from "react";
import styled from "styled-components";
import { API_ROOT_URL } from "../../constants";

interface LoginProps {
  onLogin: (e: React.FormEvent, username: string, password: string) => void;
  loginFailed: boolean;
}

function Login({ onLogin, loginFailed }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginIsDisabled = username.length === 0 || password.length === 0;

  return (
    <Form onSubmit={(e) => onLogin(e, username, password)}>
      <Container>
        <Heading>Dogstagram</Heading>
        <LabelContainer>
          <Label>
            Brukernavn
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Label>
          <Label>
            Passord
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </Label>
        </LabelContainer>
        <LoginButton
          type="submit"
          value="Logg inn"
          disabled={loginIsDisabled}
        />
        {loginFailed && <Warning>Feil brukernavn eller passord</Warning>}
      </Container>
    </Form>
  );
}

const Form = styled.form`
  height: 100%;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #fff;
  border: 1px #aaa solid;
  border-radius: 4px;
  width: max-content;
  margin: 80px auto;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${14 / 16}rem;
  color: #444;
`;

const Input = styled.input`
  font-size: 1rem;
`;

const Heading = styled.h1`
  font-family: "Lobster Two", cursive;
  font-weight: 400;
  font-size: 3rem;
`;

const LabelContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoginButton = styled.input`
  appearance: none;
  background-color: #52b7ef;
  border-radius: 4px;
  border: none;
  color: white;
  font-size: ${14 / 16}rem;
  font-weight: 700;
  padding: 5px 9px;

  &:disabled {
    background: #b2dffc;
  }
`;

const Warning = styled.div`
  color: #d95c46;
  font-size: ${14 / 16}rem;
  text-align: center;
  background-color: #fffbfa;
  border: 1px solid currentColor;
  padding: 5px;
  border-radius: 4px;
  margin-top: 8px;
`;

export default Login;
