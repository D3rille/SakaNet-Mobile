 // @ts-nocheck
import React, { useContext, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import {GET_AVAILABLE_PRODUCTS, GET_SUGGESTED_PRODUCT} from '../../../graphql/operations/product';
import { useQuery, useLazyQuery} from '@apollo/client';
import { ActivityIndicator, MD2Colors, Button } from 'react-native-paper';
import { AuthContext } from '../../../context/auth';
import {Picker} from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import SuggestedProducts from '../../../components/MarketProducts/SuggestedProducts';
import AvailableProducts from '../../../components/MarketProducts/AvailableProducts';
import FilterBottomSheet from '../../../components/MarketProducts/FilterBottomSheet';
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { COLORS, SIZES } from '../../../constants/index';
import Icon from 'react-native-vector-icons/Ionicons';

 
 export default function App() {
   const { user } = useContext(AuthContext);
   const [productsType, setProductsType] = useState("Sell"); // Order or Preorder
   const [productsSortBy, setProductsSortBy] = useState("available"); // Available or Suggested Products
   const [filters, setFilters] = useState({
    modeOfDelivery: "",
    area_limit: "",
    maxPrice: 1000,
    minPrice: 0,
    until: null,
  });


  const local = useLocalSearchParams(); //Product ID from Dynamic Route
  const productId = local.id
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false); //Toggle BottomSheet
  const sheetRef = useRef<BottomSheetModal>(null); //Bottom sheet Reference

  const snapPoints = useMemo(() => [ "60%", "100%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);
  // const handleClosePress = useCallback(() => {
  //   sheetRef.current?.close();
  // }, []);

  const { data, loading, error } = useQuery(
    productsSortBy === "available" ? GET_AVAILABLE_PRODUCTS : GET_SUGGESTED_PRODUCT,
    {
      variables: {
        category: productsType,
        itemId: productId,
        filter: filters,
        page: 1,
        limit: 6,
      },
    }
  );

    console.log("Filers", filters)
      if (loading) return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
      if (error) return <p>Error: {error.message}</p>;


      let productData = [];

      if (data) {

        if (productsSortBy === "available" && data.getAvailableProducts) {
          productData = data.getAvailableProducts.product;
        } else if (productsSortBy === "suggested" && data.getSuggestedProducts) {
          productData = data.getSuggestedProducts.product;
        } 
      }
  
  const updateFilters = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      
    });
    console.log(newFilters)
  };
    
  const getButtonStyle = (buttonStatus: StatusType) => ({
    ...styles.toggleButton,
    backgroundColor: productsType === buttonStatus ? COLORS.orange : 'transparent',
  });

  const getTextStyle = (buttonStatus: StatusType) => ({
    color: productsType === buttonStatus ? 'white' : COLORS.orange,
    fontSize: SIZES.small,
  });


   return (
     <SafeAreaView style={styles.container}> 
     <View  style={styles.headerContainer}>
         <Picker
             selectedValue={productsSortBy}
             style={styles.picker}
             onValueChange={(itemValue, itemIndex) => {
                 setProductsSortBy(itemValue);
             }}
             >
             <Picker.Item label="Available Seller" value="available" />
             <Picker.Item label="Suggested Seller" value="suggested" />
         </Picker>
      
          <TouchableOpacity style={styles.sortBtn} onPress={handleSnapPress}>
            <Icon name="filter" size={30} color={'white'} />
          </TouchableOpacity>
          </View>
  
          <View style={styles.toggleContainer}>
            <Button
              compact
              onPress={() => setProductsType('Sell')}
              style={getButtonStyle('Sell')}
              labelStyle={getTextStyle('Sell')}
            >
              Order
            </Button>
            <Button
              compact
              onPress={() => setProductsType('Pre-Sell')}
              style={getButtonStyle('Pre-Sell')}
              labelStyle={getTextStyle('Pre-Sell')}
            >
              Pre-Order
            </Button>
          </View>
         
         {productsSortBy === 'suggested' && productData ? (
          <SuggestedProducts product={productData} productId={productId} />
        ) : null}

        {productsSortBy === 'available' && productData ? (
          <AvailableProducts product={productData} productId={productId} />
        ) : null}

         <FilterBottomSheet 
         sheetRef={sheetRef} 
         updateFilters={updateFilters} 
         snapPoints={snapPoints} />
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
 
   headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 40, // Adjust the height as needed
  },
  toggleContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
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
  sortBtn: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
 });
 