//@ts-nocheck
import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import client from "../graphql/apollo-client";
import { useNavigation} from '@react-navigation/native';

import {router} from "expo-router";
import { useSubs } from '../context/subscriptionProvider';

function CustomHeader({search, setSearchFocus, query, onClear}) {
  const{cartItemsCount} = useSubs();
  const navigateToCart = () => {
    router.push("/Cart/");
  };


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
          value={query}
          placeholder="Search"
          onChangeText={search}
          onFocus={()=>setSearchFocus(true)}
          onBlur={()=>setSearchFocus(false)}
          // onChangeText={(text: string) => setSearchQuery(text)}
          // value={searchQuery}
        />
        {query ? (
          <Ionicons
            name="close-outline"
            size={20}
            color="gray"
            style={styles.clearIcon}
            onPress={onClear}
          />
        ) : null}
      </View>

          <TouchableOpacity onPress={navigateToCart}>
            {cartItemsCount > 0 ? (<Badge style={{position:"absolute", bottom:25, right:9, zIndex:1}}>{cartItemsCount}</Badge>):null} 
            <Ionicons name="cart-outline" size={24} color="#2E603A" style={[styles.notificationIcon, {marginRight:cartItemsCount > 0 ? 10:0}]} />
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
  notificationIcon: {
    padding: 5,
    fontSize:30,
    marginTop:25,
  },
});

export default CustomHeader;