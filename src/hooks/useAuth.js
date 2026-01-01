import { useState, useEffect } from "react";
import { whileLogIn } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = whileLogIn((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return typeof unsubscribe === "function" ? unsubscribe : () => {};
  }, []);

  return { user, loading, isAuthenticated: Boolean(user) };
};

export default useAuth;