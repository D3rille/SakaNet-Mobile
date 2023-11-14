//@ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { router } from 'expo-router';


export default function AvailableMarketProducts({ products }) {
  return (
    <ScrollView contentContainerStyle={styles.cardContainer}>
      {products.map((product) => (
        <View key={product._id} style={styles.card}>
          <Image source={{ uri: product.photo }} style={styles.image} />
          <Text style={styles.title}>
            {product.name.tagalog && `${product.name.tagalog} | `}{product.name.english}
          </Text>
          <Button
            title=" View Available Market Products"
            color="#2F603B"
            onPress={() => {
              router.push({
                pathname: '/Products/[productid]',
                params: {
                  id: product._id,
                },
              });  
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  description: {
    marginTop: 8,
  },
  
});

{/*

        UI

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

type ProductItem = {
  id: string;
  name: string;
  image: string;
};

const products: ProductItem[] = [
  { id: '1', name: 'Very Long Product Name That Exceeds the Limit', image: 'path_to_image' },
  { id: '2', name: 'Product 2', image: 'path_to_image' },
  { id: '3', name: 'Product 3', image: 'path_to_image' },
  { id: '4', name: 'Product 4', image: 'path_to_image' },
  { id: '5', name: 'Product 5', image: 'path_to_image' },
  { id: '6', name: 'Product 6', image: 'path_to_image' },
    { id: '1', name: 'Very Long Product Name That Exceeds the Limit', image: 'path_to_image' },
  { id: '2', name: 'Product 2', image: 'path_to_image' },
  { id: '3', name: 'Product 3', image: 'path_to_image' },
  { id: '4', name: 'Product 4', image: 'path_to_image' },
  { id: '5', name: 'Product 5', image: 'path_to_image' },
  { id: '6', name: 'Product 6', image: 'path_to_image' },
];

const AvailableMarketProducts = () => {

  const renderItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productNameContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id}
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

export default AvailableMarketProducts;


*/}