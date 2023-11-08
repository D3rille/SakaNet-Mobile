//@ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';

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
              // Add your code to handle the button click, e.g., navigate to available market products page.
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
