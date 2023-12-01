//@ts-nocheck

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';

const AllMarketProducts = ({ products}) => {

  const renderItem = ({ item: product }) => (
    <TouchableOpacity
      key={product._id}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/Products/[productid]/',
          params: {
            productid: product._id,
          },
        })
      }
    >
      <Image
        source={{ uri: product.photo }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productNameContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name.tagalog && `${product.name.tagalog} | `}{product.name.english}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={product => product._id}
      numColumns={2}
      columnWrapperStyle={styles.cardContainer}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '47%', 
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden', 
  },
  productImage: {
    height: 120,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#ccc',
  },
  productNameContainer: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    overflow: 'hidden',
  },
});

export default AllMarketProducts;
