import React, { useState } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const updateUser = user => setCurrentUser(user);
  const isMentor = currentUser?.roles?.includes('Mentor');
  const isAdmin = currentUser?.roles?.includes('Admin');

  return (
    <UserContext.Provider
      value={{ currentUser, isMentor, isAdmin, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
