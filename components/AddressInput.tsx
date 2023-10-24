import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet, SafeAreaView,
  ScrollView, Image, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RadioButton, Text } from 'react-native-paper';

const AddressInputs = () => {
  const [userType, setUserType] = useState('farmer');

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
              source={require("./assets/LOGO-FINAL.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.inputContainer}>
            <AddressInput placeholder="Quick Search" />
            <AddressInput placeholder="Street" />
            <AddressInput placeholder="Barangay" />
            <AddressInput placeholder="City/Municipality" />
            <AddressInput placeholder="Province" />
            <AddressInput placeholder="Region" />
          </View>
          <View style={styles.radioButtonContainer}>
            <Text style={styles.userTypeText}>Select User Type: </Text>
            <View style={styles.radioButtonGroup}>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="farmer"
                  status={userType === 'farmer' ? 'checked' : 'unchecked'}
                  onPress={() => setUserType('farmer')}
                  color="#2E603A"
                />
                <Text>Farmer</Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="buyer"
                  status={userType === 'buyer' ? 'checked' : 'unchecked'}
                  onPress={() => setUserType('buyer')}
                  color="#2E603A"
                />
                <Text>Buyer</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.goBackButton}>
              <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const AddressInput = ({ placeholder }: { placeholder: string }) => (
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFF",
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginTop:10
  },
  inputContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
    paddingBottom: 20,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "#2E603A",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    paddingVertical: 10,
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "90%",
    resizeMode: "cover",
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    paddingHorizontal: 0,
    alignSelf: 'center',
    marginBottom: 20,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
  },
  userTypeText: {
    marginRight: 10, 
    fontWeight: 'normal',
  },
  buttonContainer: {
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight:'auto',
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
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },
  goBackButton: {
    borderColor: "#2E603A",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: 10,
  },
  goBackButtonText: {
    color: "#2E603A",
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddressInputs;
