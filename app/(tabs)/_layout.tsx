//@ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, View, Animated, StyleSheet, Platform } from 'react-native';
import { Tabs, router } from "expo-router";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/index';
import {Badge} from "react-native-paper";
import { useMutation } from '@apollo/client';

import { useSubs } from '../../context/subscriptionProvider';
import { useAuth } from '../../context/auth';
import { READ_ALL_NOTIF, GET_NOTIFICATIONS } from '../../graphql/operations/notification';
import { SubscriptionProvider } from '../../context/subscriptionProvider';
import { useSegments } from 'expo-router';


type IconName = string;

const TabLayout = () => {
  const segment = useSegments();
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const {newNotifCount:notifCount} = useSubs();
  const {user, isLoaded} = useAuth();
  const [newNotifCount, setNewNotifCount] = useState(0);
  const [prodRoute, setProdRoute] = useState("Products");

  const noTabRoutes = ["ChatConversation", "addProduct"];
  //to check if segment needs to hide bottom nav
  const checkForNoTabRoutes = () =>{
    let included = false;
    for (let index = 0; index < segment.length; index++) {
      if(noTabRoutes.includes(segment[index])){
        included = true;
      } else{
        included = false;
      }
    }
    return included;
  }


  useEffect(()=>{
    setNewNotifCount(notifCount);
  },[notifCount]);

  const [readAllNotif] = useMutation(READ_ALL_NOTIF, {
    refetchQueries:[GET_NOTIFICATIONS]
  });

  useEffect(()=>{
    if(isLoaded && user?.role == "FARMER"){
      setProdRoute("MyProducts")
    }
  },[user, prodRoute, isLoaded]);


  return (
    <Tabs screenOptions={({ route, navigation }) => ({
      tabBarIcon: ({ focused, size }) => {
        let iconName;
        let color = focused ? COLORS.green : 'gray';

        switch (route.name) {
          case 'MyNetwork':
            iconName = 'people';
            break;
          case 'Messages':
            iconName = 'chatbubble-ellipses';
            break;
          case 'Products':
            iconName = 'store';
            break;
          case 'Notifications':
            iconName = 'notifications';
            break;
          case 'Menu':
            iconName = 'grid';
            break;
          case 'MyProducts':
            iconName = "store"
            break;
        }

        if (route.name === "Products") {
          return (
            <TouchableOpacity onPress={() => {
              router.push("/(tabs)/Products/");
              // if(user?.role == "FARMER"){
              //   navigation.navigate('MyProducts');
              // } else if(user?.role == "BUYER"){
              //   navigation.navigate('Products');
              // }
            }
            }>
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: focused ? COLORS.green : 'gray',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === "android" ? 30 : 10,
              }}>
                <FontAwesome5 name={iconName} size={22} color='white' />
              </View>
            </TouchableOpacity>
          );
        }

        if (route.name === "MyProducts") {
          return (
            <TouchableOpacity onPress={() => {
              router.push("/(tabs)/MyProducts/");
              // if(user?.role == "FARMER"){
              //   navigation.navigate('MyProducts');
              // } else if(user?.role == "BUYER"){
              //   navigation.navigate('Products');
              // }
            }
            }>
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: focused ? COLORS.green : 'gray',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === "android" ? 30 : 10,
              }}>
                <FontAwesome5 name={iconName} size={22} color='white' />
              </View>
            </TouchableOpacity>
          );
        }

        if(route.name == "Notifications"){
          return(
            <>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Notifications');
              readAllNotif();
            }}>
              {newNotifCount > 0 && (<Badge style={{position:"absolute", bottom:30, right:9, zIndex:1}}>{newNotifCount}</Badge>)}
              <Ionicons name={iconName as any} size={size} color={color} />
            </TouchableOpacity>
            </>
          );
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;

      },
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: 'white',
        display: checkForNoTabRoutes() ? "none":"flex",
        // position: 'absolute',
        // bottom: 40,
        // marginHorizontal: 20,
        height: 60,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: {
          width: 10,
          height: 10
        },
        paddingHorizontal: 20,
      },
    })}>

      {/* Tab Screens */}
      <Tabs.Screen name="MyNetwork"
      options={{
          headerShown: false }} />
      <Tabs.Screen name="Messages" 
      options={{
          headerShown: false }} />

      <Tabs.Screen name={prodRoute == "Products" ? "Products" : "MyProducts"}
          options={{
              headerShown: false }} />

      <Tabs.Screen name="Notifications"
      options={{
          headerShown: false }} />
      <Tabs.Screen name="Menu"
      options={{
          headerShown: false }} />
          
      <Tabs.Screen name={prodRoute == "Products" ? "MyProducts":"Products"}
      options={{
          headerShown:false,
          href: null }} />

    </Tabs>
  );
}

function getWidth() {
  let width = Dimensions.get("window").width;
  width = width - 80;
  return width / 5; 
}

const styles = StyleSheet.create({
  // Add your custom styles here if needed
});




export default TabLayout;
