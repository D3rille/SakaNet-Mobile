import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import client from "../graphql/apollo-client";
// import {ApolloWrapper} from "../graphql/apollo-client";
import {AuthProvider} from "../context/auth";
import { ApolloProvider } from "@apollo/client";
import Toast from 'react-native-toast-message';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Sample from './sample';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'login',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/Poppins-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ApolloProvider client={client}>
      <RootLayoutNav />
    // </ApolloProvider>
  );
}

// HEADER (TOP APP BAR)

function CustomHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/images/LOGO-ONLY-FINAL.png")}
        style={styles.logo}
      />
      <View style={styles.searchSection}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        {searchQuery ? (
          <Ionicons
            name="close-outline"
            size={20}
            color="gray"
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        ) : null}
      </View>
      <Ionicons name="notifications-outline" size={24} color="#2E603A" style={styles.notificationIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    height: 100,
    paddingHorizontal: 10,
  },
  logo: {
    width: 30, 
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 15,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F8',
    borderRadius: 20,
    paddingHorizontal: 6,
    marginTop: 20,
    height: 40,
    flex: 1, 
  },
  searchIcon: {
    padding: 5,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#F9F9F8',
    color: '#2D2C2D',
    borderRadius: 20,
  },
  clearIcon: {
    padding: 5,
  },
    notificationIcon: {
    padding: 5,
    fontSize:30,
    marginTop:18,
  },
});


function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return(
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" 
            options={{
                header: () => <CustomHeader />, 
              }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="paper" />
            <Stack.Screen name="Signup" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
        <Toast/>
        </AuthProvider>
    </ApolloProvider>
    
  
  );
}
