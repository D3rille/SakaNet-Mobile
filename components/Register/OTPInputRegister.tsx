//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message'; 

export default function EmailVerification({otp, handleSubmit, userData}) {
  const [OTPinput, setOTPinput] = useState(['', '', '', '']);
  const inputRefs = useRef([]);


  const verifyOTP = () => {
    const enteredOTP = OTPinput.join(''); // Combine the array into a string
    if (enteredOTP === otp) {
      handleSubmit();
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: "Incorrect OTP. Please check your email",
      });   
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/wave-bg.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.card}>
        <Text style={styles.heading}>Email Verification</Text>

        <Text style={styles.text}>
          We have sent a code to your email {userData.account_email}
        </Text>

        <View style={styles.inputContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            <TextInput
              key={index}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={OTPinput[index]}
              onChangeText={(text) => {
                const newOTPinput = [...OTPinput];
                newOTPinput[index] = text;
                setOTPinput(newOTPinput);

                if (text !== '' && index < 3) {
                  inputRefs.current[index + 1].focus();
                }
              }}
            />
          ))}
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={verifyOTP}
          disabled={false} 
        >
          Verify Account
        </Button>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    width: '80%',
    maxWidth: 400,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#2f613a',
    color: '#ffffff',
    marginBottom: 16,
  },

});
