import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View, Animated, StyleSheet, Platform, Keyboard } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/index';

const TabLayout = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const tabBarStyle = {
    ...styles.tabBar,
    bottom: keyboardVisible ? -90 : 0,
  };

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
                width: 70,
                height: 70,
                backgroundColor: focused ? COLORS.green : 'gray',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === "android" ? 30 : 20,
                borderWidth:5,
                borderColor: 'white',
              }}>
                <FontAwesome5 name={iconName} size={22} color='white' />
              </View>
            </TouchableOpacity>
          );
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;

      },
      tabBarShowLabel: false,
      tabBarStyle: tabBarStyle,
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    position: 'absolute',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: -5
    },
    shadowRadius: 5,
    elevation: 20,
    paddingHorizontal: 20,
  },

});

export default TabLayout;
