
 // @ts-nocheck
import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput } from 'react-native';
import { Card } from 'react-native-paper';
import {GET_ALL_MARKET_PRODUCTS, GET_AVAILABLE_MARKET_PRODUCTS, SEARCH_ALL_PRODUCT, SEARCH_AVAILABLE_PRODUCT } from '../../../graphql/operations/product';
import { Searchbar } from 'react-native-paper';
import AvailableMarketProducts from '../../../components/MarketProducts/AvailableMarketProducts';
import AllMarketProducts from '../../../components/MarketProducts/AllMarketProducts';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { AuthContext } from '../../../context/auth';
import {Picker} from '@react-native-picker/picker';


export default function App() {
  const [activeComponent, setActiveComponent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setCategory] = useState('');
  const { user } = useContext(AuthContext);

  const { loading, error, data } = useQuery(
    activeComponent === "available"
      ? GET_AVAILABLE_MARKET_PRODUCTS
      : GET_ALL_MARKET_PRODUCTS,
    {
      variables: {
        type: selectedCategory,
        // limit:(searchFocus && searchQuery)?136:10,
        limit: 5,
        page: 1,
      },
    }
  );

  const onChangeSearch = query => 
  {
    setSearchQuery(query);
    searchProduct();

  };

  
  const [searchProduct,{data:searchData, error:searchError, loading:searchLoading}]=useLazyQuery(
    activeComponent === "available"
    ? SEARCH_AVAILABLE_PRODUCT
    : SEARCH_ALL_PRODUCT,
  {
    variables: {
      type: selectedCategory,
      searchInput: searchQuery
    },
  }
  );

  
    if (loading) return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
    if (error) return <p>Error: {error.message}</p>;
    
    let productData;
    let totalProduct;
    if (data) {
        if (activeComponent === "available") {
          if (searchQuery && searchData) {
            productData = searchData.searchAvailableMarketProduct;
            totalProduct = productData.length;
          } else {
            productData = data.getAvailableMarketProducts.product;
            totalProduct = data?.getAvailableMarketProducts.totalProduct;
          }
        } else {
          if (searchQuery && searchData) {
            productData = searchData.searchAllMarketProduct;
            totalProduct = productData.length;
          } else {
            productData = data.getAllMarketProducts.product;
            totalProduct = data?.getAllMarketProducts.totalProduct;
          }
      
          const regex = new RegExp(`^${searchQuery}`, 'i');
          // Add pagination later
          // const totalPages = Math.ceil(totalProduct / 10);
        }
      }
     
      

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Market Products</Text>

        <View style={styles.searchAndSelect}>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                />
        </View>
        <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) => {
                setCategory(itemValue);
            }}
            >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Cereals" value="Cereals" />
            <Picker.Item label="Root Crops" value="Rootcrops" />
            <Picker.Item label="Beans and Legumes" value="Beans and Legumes" />
            <Picker.Item label="Condiments" value="Condiments" />
            <Picker.Item label="Fruit Vegetables" value="Fruit Vegetables" />
            <Picker.Item label="Leafy Vegetables" value="Leafy Vegetables" />
            <Picker.Item label="Fruits" value="Fruits" />
            <Picker.Item label="Commercial Crops" value="Commercial Crops" />
            <Picker.Item label="Cut Flowers" value="Cutflowers" />
            <Picker.Item label="Livestock and Poultry (Backyard)" value="Livestock and Poultry (Backyard)" />
        </Picker>
    <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
            <Button
            title="All"
            onPress={() => setActiveComponent('all')}
            color={activeComponent === 'all' ? '#007BFF' : '#333'}
            />
        </View>
        <View style={{ flex: 1 }}>
            <Button
            title="Available"
            onPress={() => setActiveComponent('available')}
            color={activeComponent === 'available' ? '#007BFF' : '#333'}
            />
        </View>
        </View>
            <Card>
                {activeComponent === 'available' && <AvailableMarketProducts  products={productData}/>}
                {activeComponent === 'all' && <AllMarketProducts  products={productData} />}
            </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
    paddingBottom: 100,
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
  },

  searchAndSelect: {
    justifyContent: 'space-between',
    padding: 8,
    margin: 5,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16, 
    minHeight: 40, 
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
