import React, { useEffect } from 'react';
import { request } from "../utils/request"

type AuthProps = {
  isAuthenticated: boolean;
  authenticate: Function;
  signout: Function;
};

export const AuthContext = React.createContext({} as AuthProps);

const isValidToken = async() => {
  const token = localStorage.getItem('access_token');
  request.defaults.headers.common.Authorization = `Bearer ${token}`;
  try {
    const response = await request.get('/users/roles');
    const {
      data: {role},
    } = response;
    return true;
  } catch (err) {
    //console.log(err);
    return false;
  }
};

const AuthProvider = (props: any) => {
  const [isAuthenticated, makeAuthenticated] = React.useState(false);

  useEffect(() => {
    isValidToken().then(data => makeAuthenticated(data));
  }, []);

  async function authenticate({username, password}, cb) {
    try {
      const response = await request.post('/users/signin', {
        username,
        password,
      });
      const {data} = response;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('name', username);
      request.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
      makeAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  }

  function signout(cb) {
    makeAuthenticated(false);
    localStorage.removeItem('access_token');
    setTimeout(cb, 100);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticate,
        signout,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
