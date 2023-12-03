//@ts-nocheck
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function NotificationsHeader({ clearNotifs }) {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../../assets/images/notification-header.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Notifications</Text>
      <TouchableOpacity
        style={styles.clearAllButton}
        onPress={clearNotifs}
      >
        <MaterialIcons name="delete" size={24} color="#2E603A" />
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingVertical: 10,
    zIndex: 1
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    flex: 1, 
    marginLeft: 10,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 20,
  },
  clearAllText: {
    padding: 5,
    color: '#2E603A',
  },
});

export default NotificationsHeader;
