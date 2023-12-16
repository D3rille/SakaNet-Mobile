//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function EmailVerification() {
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(['', '', '', '']);
  const [disable, setDisable] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

  const resendOTP = () => {
    if (disable) return;
    // Add your axios logic here for resending OTP
    // For now, let's simulate the resend
    alert('Resending OTP...');
    setDisable(true);
    setTimer(60);
  };

  const verifyOTP = () => {
    // Add your OTP verification logic here
    const enteredOTP = OTPinput.join(''); // Combine the array into a string
    // Replace the logic below with your OTP verification logic
    if (enteredOTP === '1234') {
      // OTP matches, proceed to the reset page
      // Replace 'reset' with the appropriate page or navigation logic
      // For example, navigation.navigate('ResetPage');
      console.log('OTP matches, proceed to the reset page');
    } else {
      // OTP does not match, handle accordingly
      alert('Incorrect OTP. Please try again.');
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
          We have sent a code to your email user@example.com
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

                // Automatically focus on the next input when a digit is entered
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
          disabled={false} // Add your condition for disabling the button
        >
          Verify Account
        </Button>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive code?{' '}
            <Text
              style={{
                color: disable ? 'gray' : 'blue',
                textDecorationLine: disable ? 'none' : 'underline',
              }}
              onPress={resendOTP}
            >
              {disable ? `Resend OTP in ${timerCount}s` : 'Resend OTP'}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 12,
    color: 'gray',
  },
});
