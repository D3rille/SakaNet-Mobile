import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function ChatsListHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  const onKebabPress = () => {
    console.log('Kebab icon pressed'); 
  };

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../../assets/images/Chats.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Chats</Text>

      <View style={styles.searchSection}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
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

      <TouchableOpacity onPress={onKebabPress}>
        <Ionicons name="ellipsis-vertical" size={20} color="gray" style={styles.icon} />
      </TouchableOpacity>
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
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
    marginTop: 25,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F8',
    borderRadius: 20,
    paddingHorizontal: 6,
    marginTop: 25,
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
  icon: {
    padding: 5,
    fontSize: 30,
    marginTop: 25,
  },
});

export default  ChatsListHeader;
