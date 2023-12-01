//@ts-nocheck
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
import AddressInput from "../components/Register/AddressInput";
import { router } from "expo-router";
import { AuthContext } from "../context/auth";
import { REGISTER_USER, VALIDATE_REG_PERSONAL_INFO } from "../graphql/operations/auth"; //imported the mutation
import { useMutation } from "@apollo/client";
import Toast from 'react-native-toast-message'; 



export default function Signup() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMatched, setIsMatched] = useState<boolean | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const context = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState({
    username: '',
    account_email: '',
    account_mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
    address: {
      street: '',
      barangay: '',
      cityOrMunicipality: '',
      province: '',
      region: '',
    },
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
      context.login(userData);
    },
      onCompleted: (data) => {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: "User successfully Registered",
        });   
        router.replace("/Products")
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: error,
        });   
      },
    }
  );
  
  const [validateUserData, { loading: validateLoading, error: validateError }] = useMutation(VALIDATE_REG_PERSONAL_INFO,);

  const handleSubmit = async () => {
    try {
      const { data: validationData } = await  validateUserData({
        variables: {
          registerInput: userData,
        },
      });
  
      if (validationData) {
        const { errors, valid } = await validationData.validateRegPersonalInfo;
  
        if (valid) {
          const { data: registrationData } =  registerUser({
            variables: {
              registerInput: userData,
            },
          });
  
          if (registrationData) {
            router.push(router.push("/"))
          }
        } else {
          console.log('Validation failed. Do something with the errors:', errors);
        }
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const validateFirstPage = async () => {
    try {
      const { data } = await validateUserData({
        variables: {
          registerInput: userData,
        },
      });
  
      if (data) {
        const { errors, valid } = data.validateRegPersonalInfo;
  
        if (valid) {
          setPage(page + 1);
        } else {
          const errorMessage = errors.map((error, index) => `*${error}`).join('\n');
          Toast.show({
            type: 'error',
            position: 'top',
            text1: errorMessage,
          });       
         }
      } else {
        console.error("Validation data is missing.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (name, value) => {
    setUserData((prevUserData) => {
      if (name.startsWith("address.")) {
        const addressField = name.split(".")[1];
        return {
          ...prevUserData,
          address: {
            ...prevUserData.address,
            [addressField]: value,
          },
        };
      } else {
        return {
          ...prevUserData,
          [name]: value,
        };
      }
    });
  };
  
  useEffect(() => {
    if (userData.password && userData.confirmPassword) {
      setIsMatched(userData.password === userData.confirmPassword);
    } else {
      setIsMatched(null);
    }
  }, [userData.password, userData.confirmPassword]);
  
  const goBack = () => {setPage(page - 1)};
  
  if(page == 1){
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
          <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps='always'>
            <View style={styles.header}>
              <Image
                source={require("../assets/images/LOGO-ONLY-FINAL.png")}
                style={styles.logo}
              />
              <Title style={styles.title}>Welcome to SakaNet!</Title>
              <Caption style={styles.caption}>
                Create an account to get started
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
                <TextInput style={styles.input} placeholder="Enter Username"
                                onChangeText={(text) => handleInputChange("username", text)}
                                value={userData.username}
                />
              </View>
              <View style={styles.inputWithIcon}>
                <Icon
                  name="mail"
                  size={20}
                  color="#2E603A"
                  style={styles.iconInsideInputName}
                />
                <TextInput style={styles.input} placeholder="Enter Email"  
                                onChangeText={(text) => handleInputChange("account_email", text)}
                                value={userData.account_email}
                />
              </View>

              <View style={styles.inputWithIcon}>
                <Icon
                  name="call"
                  size={20}
                  color="#2E603A"
                  style={styles.iconInsideInputName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  keyboardType="numeric"
                  maxLength={11}
                  onChangeText={(text) => handleInputChange("account_mobile", text)}
                  value={userData.account_mobile}
                />
              </View>

              <View
                style={[
                  styles.passwordInputContainer,
                  isMatched === false ? { borderColor: "red" } : null,
                ]}
              >
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
                  onChangeText={(text) => handleInputChange("password", text)}
                  value={userData.password}
                />
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => setPasswordVisible(!isPasswordVisible)}
                >
                  {userData.password !== "" ? (
                    <Icon
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#2E603A"
                    />
                  ):null}
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.passwordInputContainer,
                  isMatched === false ? { borderColor: "red" } : null,
                ]}
              >
                <Icon
                  name="lock-closed"
                  size={20}
                  color="#2E603A"
                  style={styles.iconInsideInputPassword}
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  secureTextEntry={!isConfirmPasswordVisible}
                  onChangeText={(text) => handleInputChange("confirmPassword", text)}
                  value={userData.confirmPassword}
                />
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() =>
                    setConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  {confirmPassword !== "" ? (
                    <Icon
                      name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#2E603A"
                    />
                  ):null}
                </TouchableOpacity>
              </View>

              {isMatched === false ? (
                <Text style={{ color: "red", marginTop: 5 }}>
                  Password not matched
                </Text>
              ):null}

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={termsAccepted ? "checked" : "unchecked"}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  color="#2E613B"
                  uncheckedColor="#2E603A"
                />
                <Text onPress={() => setTermsAccepted(!termsAccepted)}>
                  By creating, you are accepting term & conditions
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={async () => {
                    await validateFirstPage();
                  }}                  
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
                <View style={styles.loginContainer}>
                  <Text>Already have an account?</Text>
                  <TouchableOpacity onPress={() => {router.push('/')}}>
                    <Text style={styles.loginText}> Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  else {
    return (
      <AddressInput
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        userData={userData}
        goBack ={goBack}
      />
    );
  }
};


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
    justifyContent: "space-between",
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
    marginTop: 15,
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
    marginTop: 15,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 0,
    elevation: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  buttonContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  nextButton: {
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
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
