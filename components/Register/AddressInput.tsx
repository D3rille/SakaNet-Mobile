//@ts-nocheck
import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet, SafeAreaView,
  ScrollView, Image, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RadioButton, Text } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressInputs = ({handleSubmit, handleInputChange, userData, goBack}) => {
  const [userType, setUserType] = useState('FARMER');
  const placeAddresCompoponent = {
    REGION: 'administrative_area_level_1',
    MUNICPALITY: 'locality',
    BARANGAY: 'sublocality_level_1',
    AREA: 'sublocality_level_2',
    STREET: 'route',
    PROVINCE: 'administrative_area_level_2',
  }


//Google Place Auto Complete (Quick Search Back-end)
  function getAddressComponent(address_components, key) {
    const value = address_components
      .filter(aComp => aComp.types.includes(key))
      .map(item => item.long_name)
      .join(', ');
    return value;
  }

  const updateUserDataWithAddress = (details) => {
    if (details && details.address_components) {
      const addressComponent = details.address_components;
      const street = getAddressComponent(addressComponent, placeAddresCompoponent.STREET);
      const barangay = getAddressComponent(addressComponent, placeAddresCompoponent.BARANGAY);
      const cityOrMunicipality = getAddressComponent(addressComponent, placeAddresCompoponent.MUNICPALITY);
      const region = getAddressComponent(addressComponent, placeAddresCompoponent.REGION);
      const province =  getAddressComponent(addressComponent, placeAddresCompoponent.PROVINCE);
      handleInputChange('address.street', street);
      handleInputChange('address.barangay', barangay);
      handleInputChange('address.cityOrMunicipality',  cityOrMunicipality);
      handleInputChange('address.region', region);
      handleInputChange('address.province', province);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../../assets/images/wave-bg.png")}
          style={styles.backgroundImage}
        />
        <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps='always'>
          <View style={styles.header}>
            <Text style={styles.headerText}>Enter Address</Text>
          </View>
          <View style={styles.inputContainer}>
          
            {/* Google Autocomplete */}
            <View style={styles.inputWrapper}>
              <GooglePlacesAutocomplete
                placeholder="Quick Search"
                minLength={2}
                returnKeyType={'default'}
                fetchDetails={true}
                disableScroll={true}
                listViewDisplayed={false}
                onPress={(data, details = null) => {
                  updateUserDataWithAddress(details);
                }}
                query={{
                  key: 'AIzaSyAdcZcD7Nq7CitMFBFAGBrLlOGtetZCcVg',
                  language: 'en',
                  components: "country:ph",
                }}
                styles={{
                  
                  textInput: {
                    paddingVertical: 10,
                  },
                  predefinedPlacesDescription: {
                    color: "#1faadb",
                  },
                }}
              />
            </View>
            <AddressInput placeholder="Street" type="street" handleInputChange={handleInputChange} userData={userData.address.street} />
            <AddressInput placeholder="Barangay" type="barangay" handleInputChange={handleInputChange} userData={userData.address.barangay}  />
            <AddressInput placeholder="City/Municipality" type="cityOrMunicipality" handleInputChange={handleInputChange} userData={userData.address.cityOrMunicipality}  />
            <AddressInput placeholder="Province" type="province" handleInputChange={handleInputChange} userData={userData.address.province}  />
            <AddressInput placeholder="Region" type="region" handleInputChange={handleInputChange} userData={userData.address.region}  />
          </View>
          <View style={styles.radioButtonContainer}>
            <Text style={styles.userTypeText}>Select User Type: </Text>
            <View style={styles.radioButtonGroup}>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="FARMER"
                  status={userType === 'FARMER' ? 'checked' : 'unchecked'}
                  onPress={() =>  {handleInputChange("role", "FARMER"); setUserType("FARMER")}
                    
                  }
                  color="#2E603A"
                />
                <Text>Farmer</Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="BUYER"
                  status={userType === 'BUYER' ? 'checked' : 'unchecked'}
                  onPress={() => {handleInputChange("role", "BUYER") ; setUserType("BUYER")}}
                  color="#2E603A"
                />
                <Text>Buyer</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
              <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const AddressInput = ({ placeholder, handleInputChange, type, userData }) => (
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={(text) => handleInputChange(`address.${type}`, text)}
      value={userData}
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
  headerText: {
    paddingTop:20,
    fontWeight:'bold',
    fontSize: 22,
    marginTop:20
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "space-between",
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
    paddingVertical: 10,
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
