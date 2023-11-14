import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";

interface AnimatedTabIconProps {
  name: string;
  type: "FontAwesome5" | "Ionicons";
  color?: string;
  label: string;
  isActive: boolean;
  onPressTab: (tabName: string) => void;
  size?: number;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  name,
  type,
  label,
  isActive,
  onPressTab,
  size = 28,
}) => {
  const iconRef = useRef<Animatable.View & any>(null);
  const textRef = useRef<Animatable.Text & any>(null);

  useEffect(() => {
    const duration = 500;
    if (isActive && iconRef.current) {
      iconRef.current.animate(
        {
          0: { scale: 0.5, translateY: 7 },
          0.92: { translateY: -34 },
          1: { scale: 1.2, translateY: -24 },
        },
        duration
      );
      textRef.current?.transitionTo({ opacity: 1 }, duration);
    } else if (iconRef.current) {
      iconRef.current.animate(
        {
          0: { scale: 1.2, translateY: -24 },
          1: { scale: 1, translateY: 0 },
        },
        duration
      );
      textRef.current?.transitionTo({ opacity: 0 }, duration);
    }
  }, [isActive]);

  const iconColor = isActive ? "#FFFEFE" : "#9DB2CE";

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPressTab(label)}
      style={styles.container}
    >
      <Animatable.View
        ref={iconRef}
        style={[styles.btn, isActive ? styles.activeBtn : {}]}
      >
        {type === "FontAwesome5" ? (
          <FontAwesome5 name={name} size={size} color={iconColor} />
        ) : (
          <Ionicons name={name as any} size={size} color={iconColor} />
        )}
      </Animatable.View>
      <Animatable.Text ref={textRef} style={styles.text}>
        {label}
      </Animatable.Text>
    </TouchableOpacity>
  );
};

const TabLayout = () => {
  const [activeTab, setActiveTab] = useState("Products");

  const handlePress = (tabName: string) => {
    setActiveTab(tabName);
  };


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2E603A",
        tabBarInactiveTintColor: "#9DB2CE",
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="Products"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedTabIcon
              type="FontAwesome5"
              name="store"
              size={23}
              label="Products"
              isActive={activeTab === "Products"}
              onPressTab={handlePress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MyNetwork"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedTabIcon
              type="Ionicons"
              name="people"
              size={33}
              label="My Network"
              isActive={activeTab === "My Network"}
              onPressTab={handlePress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"  // Updated from "Notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedTabIcon
              type="Ionicons"
              name="chatbubble-ellipses"  // Updated the icon
              size={28}
              label="Messages"  // Updated from "Notifications"
              isActive={activeTab === "Messages"}  // Updated from "Notifications"
              onPressTab={handlePress}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Menu"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AnimatedTabIcon
              type="Ionicons"
              name="grid"
              size={25}
              label="Menu"
              isActive={activeTab === "Menu"}
              onPressTab={handlePress}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    height: 70,
    position: "absolute",
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },

  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#FFFEFE",
    backgroundColor: "#FFFEFE",
    justifyContent: "center",
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#2E603A",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#2E603A",
    marginTop: -15,
  },
});

export default TabLayout;
