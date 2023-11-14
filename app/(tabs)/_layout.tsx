import React, { useRef } from 'react';
import { Dimensions, TouchableOpacity, View, Animated, StyleSheet, Platform } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/index';

type IconName = string;

const TabLayout = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;


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
        }

        if (route.name === 'Products') {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: focused ? COLORS.green : 'gray',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === "android" ? 50 : 30,
              }}>
                <FontAwesome5 name={iconName} size={22} color='white' />
              </View>
            </TouchableOpacity>
          );
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;

      },
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 40,
        marginHorizontal: 20,
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
      <Tabs.Screen name="Products"
      options={{
          headerShown: false }} />
      <Tabs.Screen name="Notifications"
      options={{
          headerShown: false }} />
      <Tabs.Screen name="Menu"
      options={{
          headerShown: false }} />

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
