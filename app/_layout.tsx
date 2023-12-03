//@ts-nocheck
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
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomHeader from '../constants/CustomHeader';
import { PaperProvider } from 'react-native-paper';
import {SubscriptionProvider} from "../context/subscriptionProvider"; 



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
  const colorScheme = useColorScheme();
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
    
      <RootLayoutNav />
  );
}

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', height: "100%", padding: 10}}
      contentContainerStyle={{ paddingHorizontal: 5,}}
      text1Style={{
        fontSize: 12,
        fontWeight: '400'
      }}

    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', height: "100%", padding: 10}}

      text1Style={{
        fontSize: 12
      }}
      contentContainerStyle={{ paddingHorizontal: 15}}
      

      text1NumberOfLines={10}

      text2Style={{
        fontSize: 10
      }}
    />
  ),
 
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return(
    <ApolloProvider client={client}>
      <AuthProvider>
        <SubscriptionProvider>
        <PaperProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="index" options={{headerShown:false}}/>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="paper" />
                  <Stack.Screen name="login" options={{headerShown:false}}/>
                  <Stack.Screen name="Signup" options={{headerShown:false}} />
                  <Stack.Screen name="Cart" options={{presentation:"modal", headerShown:false}} />
                </Stack>
              </ThemeProvider>
            </GestureHandlerRootView>
            <Toast  config={toastConfig}/>
          </PaperProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

