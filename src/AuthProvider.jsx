import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function getUserRole() {
      try {
        const user = await fetchUserDetails();
        setUserRole(user.account_type);
      } catch (error) {
        console.error(error);
        setUserRole(null); // Reset role on error
      }
    }
    getUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
