import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactComponent as SVGSpinner } from "./Spinner.svg";
import Login from "./components/Login";
import HomeScreen from "./Pages/HomeScreen";
import UserContext from "./useContext";
import styled from "styled-components";

function App() {
  const [user, setUser] = useState<{ username?: string; userId?: number }>({
    username: undefined,
    userId: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    axios
      .get<{ id: number; username: string }>("/auth")
      .then(({ data }) => setUser({ username: data.username, userId: data.id }))
      .catch()
      .finally(() => setIsLoading(false));
  }, []);

  function handleLogin(e: React.FormEvent, username: string, password: string) {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post<{ username: string; user_id: number }>("/auth/login", {
        username,
        password,
      })
      .then(({ data }) => {
        setUser({ username: data.username, userId: data.user_id });
        setLoginFailed(false);
      })
      .catch(() => setLoginFailed(true))
      .finally(() => setIsLoading(false));
  }

  function onLogOut() {
    axios
      .get("/auth/logout")
      .then(() => setUser({ username: undefined, userId: undefined }));
  }

  const isLoggedIn = user.username !== undefined && user.userId !== undefined;

  if (isLoading) return <Spinner />;

  return (
    <UserContext.Provider value={user}>
      {!isLoggedIn && <Login onLogin={handleLogin} loginFailed={loginFailed} />}
      {isLoggedIn && <HomeScreen onLogOut={onLogOut} />}
    </UserContext.Provider>
  );
}

const Spinner = styled(SVGSpinner)`
  box-sizing: border-box;
  margin-inline: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -200%);
  width: 80px;
`;

export default App;
