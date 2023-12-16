import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import { useLazyQuery } from "@apollo/client";
import {GET_OTP} from "../../graphql/operations/email"


export default function ForgotPassword({ handleChange }) {
  const [localEmail, setLocalEmail] = useState("");
  const [getOtp, {data, loading, error}] = useLazyQuery(GET_OTP);


  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(localEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email format.',
        text2: 'Please enter a valid email address.',
      });
      return;
    }
    
    
    getOtp({
      variables: { email: localEmail },
      onCompleted: (data) => handleSuccess(data),
      onError: (error) => handleError(error),
    });
    
  };

  const handleSuccess = (data) => {
      const otp = data?.generateOTP;
      console.log(otp)
      console.log(error)
    console.log(data)
    
      if (otp) {
        console.log(otp)
        console.log(localEmail)
        handleChange("otp", otp);
        
        handleChange("page","OTPInput");   
        
        handleChange("email", localEmail);      
      } else {
        console.error("Empty OTP received");
      }
    };
    const handleError = (error) => {
      
      Toast.show({
        type: 'error',
        text1: 'Error fetching OTP. Please try again later.',
        text2: error
      });
    };


  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='always'>
      <Image
        source={require("../../assets/images/LOGO-FINAL.png")}  // Replace with the actual path to your image
        style={styles.logo}
      />
      <View style={styles.inputWithIcon}>
        <Icon
          name="mail"
          size={20}
          color="#2E603A"
          style={styles.iconInsideInputName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          onChangeText={(text) => setLocalEmail(text)}
          value={localEmail}
        />
      </View>

      <Text style={styles.infoText}>
        To reset your password, enter your email above. We'll send you a 4-digit code in your email.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleEmailSubmit}
        >
          <Text style={styles.nextButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 5,
  },
  infoText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
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
});
