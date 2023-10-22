import React, { useState, useEffect } from "react";
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

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("./assets/wave-bg.png")}
          style={styles.backgroundImage}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Image
              source={require("./assets/LOGO-ONLY-FINAL.png")}
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
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.loginContainer}>
                <Text>Don't have an account yet?</Text>
                <TouchableOpacity onPress={() => {}}>
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
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 5,
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
