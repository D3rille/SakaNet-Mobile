import React, { useReducer, createContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

const initialState = {
  user: null
};

let token = null;

// Retrieve token from SecureStore
const getToken = async () => {
  try {
    token = await SecureStore.getItemAsync('jwtToken');
  } catch (error) {
    console.error('Error retrieving token from SecureStore:', error);
  }
};

// Check if token exists and is valid
const checkToken = () => {
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      // Token is expired
      removeToken();
    } else {
      initialState.user = decodedToken;
      console.log(initialState.user);
    }
  }
};

// Remove token from SecureStore
const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('jwtToken');
  } catch (error) {
    console.error('Error removing token from SecureStore:', error);
  }
};

getToken();
checkToken();

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Update token and user in state whenever they change
    getToken();
    checkToken();
  }, [state.user]);

  async function login(userData) {
    try {
      await SecureStore.setItemAsync('jwtToken', userData.token);
      dispatch({
        type: 'LOGIN',
        payload: userData
      });
    } catch (error) {
      console.error('Error storing token in SecureStore:', error);
    }
  }

  // upon logout, remove token from SecureStore
  async function logout() {
    try {
      await SecureStore.deleteItemAsync('jwtToken');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error removing token from SecureStore:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };