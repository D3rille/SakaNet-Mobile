// @ts-nocheck
import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Searchbar, Button, Text as Txt } from 'react-native-paper';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
// import AvailableMarketProducts from '../../../components/MarketProducts/AvailableMarketProducts';
import {GET_ALL_MARKET_PRODUCTS, GET_AVAILABLE_MARKET_PRODUCTS, SEARCH_ALL_PRODUCT, SEARCH_AVAILABLE_PRODUCT } from '../../../graphql/operations/product';
import { useQuery, useLazyQuery } from '@apollo/client';
import MarketProducts from '../../../components/MarketProducts/MarketProducts';
import { AuthContext } from '../../../context/auth';
import {Picker} from '@react-native-picker/picker';
import { COLORS, SIZES } from '../../../constants/index';
import CustomHeader from '../../../constants/CustomHeader';


const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocus, setSearchFocus] = useState(false);
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
        limit: 10,
        page: currentPage,
      },
    }
  );

  const onChangeSearch = query => 
  {
    setSearchQuery(query);
    searchProduct();
  };

  const onQueryClear = () =>{
    setSearchQuery("");
  }
  
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
    let totalPages;
    if (data) {
      if (activeComponent === "available") {
        if (searchQuery && searchData) {
          productData = searchData.searchAvailableMarketProduct;
          totalProduct = productData.length;
          console.log("Searched", productData)

        } else {
          productData = data.getAvailableMarketProducts.product;
          totalProduct = data?.getAvailableMarketProducts.totalProduct;
        }
        totalPages = Math.ceil(totalProduct / 10);
      } else {
        if (searchQuery && searchData) {
          productData = searchData.searchAllMarketProduct;
          totalProduct = productData.length;
          console.log("Searched", productData)
        } else {
          productData = data.getAllMarketProducts.product;
          totalProduct = data?.getAllMarketProducts.totalProduct;
        }
    
        const regex = new RegExp(`^${searchQuery}`, 'i');
        // Add pagination later
        totalPages = Math.ceil(totalProduct / 10);
      }
  }
     
      const getButtonStyle = (buttonStatus) => ({
        ...styles.toggleButton,
        backgroundColor: activeComponent === buttonStatus ? COLORS.orange : 'transparent',
      });
    
      const getTextStyle = (buttonStatus) => ({
        color: activeComponent === buttonStatus ? 'white' : COLORS.orange,
        fontSize: SIZES.small,
      });
    

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={{paddingVertical:10}}>
        <View style={styles.searchAndSortSection}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={25} style={{ marginLeft: 20 }} />
            <TextInput placeholder="Search" style={styles.input} 
              onChangeText={onChangeSearch}
            />
          </View>
        </View>
      </View> */}
      <CustomHeader search ={onChangeSearch} setSearchFocus = {setSearchFocus} query={searchQuery} onClear={onQueryClear}/>
      {/* Picker  */}
      <View>
      <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) => {
                setCategory(itemValue);
            }}
            style={styles.picker}
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
      </View>

      <View style={styles.toggleContainer}>
        <Button
          compact
          onPress={() => setActiveComponent('all')}
          style={getButtonStyle('all')}
          labelStyle={getTextStyle('all')}
        >
          All
        </Button>
        <Button
          compact
          onPress={() => setActiveComponent('available')}
          style={getButtonStyle('available')}
          labelStyle={getTextStyle('available')}
        >
          Available
        </Button>
      </View>
      {/* Display if data but no result */}
      {productData && productData.length == 0 && (
        <View style={{flex:1, justifyContent:"center"}}>
          <Txt style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Products</Txt>
        </View>
      )}
      <MarketProducts  products={productData} />

      {/* Pagination */}
      {!searchFocus && productData?.length > 0 && (<View style={{marginVertical:10, alignItems:"center", marginBottom:20}}>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity
            onPress={()=>{
              if(currentPage !=1 ){
                setCurrentPage(currentPage-1);
              }
            }}
            disabled={currentPage == 1}
          >
            <AntDesign name="caretleft" size={24} color={currentPage == 1 ? "#c5c5c5" : "black"} />
          </TouchableOpacity>
          <Text style={{marginHorizontal:20}}>{currentPage}</Text>
          <TouchableOpacity
            onPress={()=>{
              if(currentPage != totalPages){
                setCurrentPage(currentPage + 1);
              }
            }}
            disabled={currentPage == totalPages}
          >
            <AntDesign name="caretright" size={24} color={currentPage == totalPages ? "#c5c5c5" : "black"} />
          </TouchableOpacity>
        </View>
      </View>)}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  searchAndSortSection: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  sortBtn: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  toggleContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggleButton: {
    borderRadius: 20,
    flex: 1,
    margin: 0,
  },
  picker: {
    marginHorizontal: 25,
  },

});

export default Products;



