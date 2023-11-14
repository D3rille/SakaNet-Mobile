 // @ts-nocheck
import React, { useContext, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput, ScrollView} from 'react-native';
import {GET_AVAILABLE_PRODUCTS, GET_SUGGESTED_PRODUCT} from '../../../graphql/operations/product';
import { useQuery, useLazyQuery} from '@apollo/client';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { AuthContext } from '../../../context/auth';
import {Picker} from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import SuggestedProducts from '../../../components/MarketProducts/SuggestedProducts';
import AvailableProducts from '../../../components/MarketProducts/AvailableProducts';
import FilterBottomSheet from '../../../components/MarketProducts/FilterBottomSheet';
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";

 
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
          console.log(productData)
        } 
      }
  
  const updateFilters = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      
    });
    console.log(newFilters)
  };
    


   return (
     <SafeAreaView style={styles.container}> 
     <View>
         <Picker
             selectedValue={productsSortBy}
             onValueChange={(itemValue, itemIndex) => {
                 setProductsSortBy(itemValue);
             }}
             >
             <Picker.Item label="Available Seller" value="available" />
             <Picker.Item label="Suggested Seller" value="suggested" />
         </Picker>
         <Button
          title="Filter"
          onPress={handleSnapPress}
          />
          </View>
     <View style={styles.buttonContainer}>
         <View style={{ flex: 1 }}>
             <Button
             title="Order"
             onPress={() => setProductsType("Sell")}
             color={productsType === "Sell" ? '#007BFF' : '#333'}
             />
         </View>
         <View style={{ flex: 1 }}>
             <Button
             title="Pre-Order"
             onPress={() => setProductsType('Pre-Sell')}
             color={productsType === 'Pre-Sell' ? '#007BFF' : '#333'}
             />
         </View>
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
 
   header: {
     fontSize: 20,
     fontWeight: 'bold',
     textAlign: 'center',
     margin: 5,
   },
   userInfoContainer: {
    flexDirection: 'row', // This places the avatar and user info side by side
    alignItems: 'center', // This centers them vertically
  },


   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
   },
 });
 