import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Title, Caption, Checkbox, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { LOGIN_USER } from "../graphql/operations/auth";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/auth";
import Toast from 'react-native-toast-message'; // Import the toast library'
import { router, useRouter, Redirect } from "expo-router";


export default function Login() {
  // const router = useRouter();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loginCred, setLoginCred] = useState('');
  const context = useContext(AuthContext);

  const [logUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, {data:{login:userData}}){
        //console.log(result);
        context.login(userData);
    },
    onCompleted: (data) => {
      // context.login(data.login)
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Login successful!',
      });
      router.replace("/Products")
    


    },
    onError: (error) => {
      console.log(error);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../assets/images/wave-bg.png")}
          style={styles.backgroundImage}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/LOGO-ONLY-FINAL.png")}
              style={styles.logo}
            />
            <Title style={styles.title}>Welcome back!</Title>
            <Caption style={styles.caption}>
              Login to pick up where you left off
            </Caption>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWithIcon}>
              <Icon
                name="person"
                size={20}
                color="#2E603A"
                style={styles.iconInsideInputName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Username"
                onChangeText={setLoginCred}
                value={loginCred}
              />
            </View>

            <View style={styles.passwordInputContainer}>
              <Icon
                name="lock-closed"
                size={20}
                color="#2E603A"
                style={styles.iconInsideInputPassword}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter Password"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {password !== "" && (
                  <Icon
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#2E603A"
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}  onPress={()=> handleLogin()}>Login</Text>
              </TouchableOpacity>
              <View style={styles.loginContainer}>
                <Text>Don't have an account yet?</Text>
                <TouchableOpacity onPress={() => router.push("/Signup")}>
                  <Text style={styles.loginText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFF",
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "90%",
    resizeMode: "cover",
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 900,
    height: 90,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    color: "#2D2C2D",
    fontWeight: "bold",
  },
  caption: {
    color: "#2D2C2D",
    fontSize: 15,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "90%",
    marginTop: 20,
    borderColor: "#2E603A",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    borderColor: "#2E603A",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 20,  
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  iconInsideInputName: {
    marginHorizontal: 5,
    marginRight: 10,
  },
  iconInsideInputPassword: {
    marginHorizontal: 10,
    marginLeft: 15,
  },

  buttonContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: 100,
  },
  loginButton: {
    backgroundColor: "#2E603A",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    marginLeft: 5,
    color: "#2E603A",
    textDecorationLine: "underline",
  },
});



/*
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
        {/* Content for the top banner 
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
*/
