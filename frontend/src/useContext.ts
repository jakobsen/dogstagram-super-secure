import React from "react";

interface IUserContext {
  username?: string;
}

const UserContext = React.createContext<IUserContext>({ username: undefined });

export default UserContext;
