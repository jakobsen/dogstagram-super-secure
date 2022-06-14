import axios from "axios";
import React, { useState } from "react";
import Login from "./components/Login";
import HomeScreen from "./Pages/HomeScreen";
import UserContext from "./useContext";

function App() {
  const [user, setUser] = useState<{ username?: string; userId?: number }>({
    username: undefined,
    userId: undefined,
  });
  const [loginFailed, setLoginFailed] = useState(false);

  function handleLogin(e: React.FormEvent, username: string, password: string) {
    e.preventDefault();
    axios
      .post<{ username: string; user_id: number }>("/auth/login", {
        username,
        password,
      })
      .then(({ data }) => {
        setUser({ username: data.username, userId: data.user_id });
        setLoginFailed(false);
      })
      .catch(() => setLoginFailed(true));
  }

  const isLoggedIn = user.username !== undefined && user.userId !== undefined;

  return (
    <UserContext.Provider value={user}>
      {!isLoggedIn && <Login onLogin={handleLogin} loginFailed={loginFailed} />}
      {isLoggedIn && <HomeScreen />}
    </UserContext.Provider>
  );
}

export default App;
