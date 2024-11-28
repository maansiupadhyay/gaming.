import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth 
      ? JSON.parse(savedAuth) 
      : { user: null, pwd: null, user_id: null, accessToken: null, username: "user", userImage: "userImage" }; // Default value for userImage
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Function to update userImage
  const updateUserImage = (image) => {
    setAuth((prevAuth) => ({ ...prevAuth, userImage: image }));
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, updateUserImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
