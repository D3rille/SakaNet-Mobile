import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,   ImageBackground,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/operations/auth'; // Import your login mutation
import Toast from 'react-native-toast-message'; // Import the toast library'
import { AuthContext } from '../context/auth';

const Login = () => {

  const context = useContext(AuthContext);
  const [loginCred, setLoginCred] = useState('');
  const [password, setPassword] = useState('');

  const [logUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      context.login(data.login)
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Login successful!',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Login failed. Check your credentials.',
      });
    },
  });

  const handleLogin = () => {
    logUser({
      variables: {
        loginCred,
        password,
      },
    });
  };

  return (
    <View style={styles.container}>
       <ImageBackground
        source={require('../assets/images/welcomeback.jpg')}
        style={styles.banner}
      >
        {/* Content for the top banner */}
      </ImageBackground>
      <View style={styles.formContainer}>
        <Text style={styles.loginText}>LOGIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Username/Email/Phone Number"
          value={loginCred}
          onChangeText={(text) => setLoginCred(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 3,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#013208',
    marginTop: 20,
    textAlign: 'center',
  },
  banner: {
    flex: 2,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: '#02452d',
    borderRadius: 28,
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default Login;
