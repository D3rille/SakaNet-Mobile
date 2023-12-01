 // @ts-nocheck
import React, { useContext, useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import {GET_AVAILABLE_PRODUCTS, GET_SUGGESTED_PRODUCT, GET_PRODUCT} from '../../../graphql/operations/product';
import { PLACE_ORDER } from '../../../graphql/operations/order';
import { useQuery, useLazyQuery, useMutation} from '@apollo/client';
import { ActivityIndicator, MD2Colors, Button } from 'react-native-paper';
import { AuthContext } from '../../../context/auth';
import {Picker} from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import SuggestedProducts from '../../../components/MarketProducts/SuggestedProducts';
import AvailableProducts from '../../../components/MarketProducts/AvailableProducts';
import FilterBottomSheet from '../../../components/MarketProducts/FilterBottomSheet';
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { COLORS, SIZES } from '../../../constants/index';
import Icon from 'react-native-vector-icons/Ionicons';
import PurchaseBottomSheet from '../../../components/MarketProducts/PurhcaseBottomSheet';
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import { loadErrorMessages } from '@apollo/client/dev';

 
 export default function App() {
  //  const { user } = useContext(AuthContext);
   const [openSheet, setOpenSheet] = useState(false);
   const [productsType, setProductsType] = useState("Sell"); // Order or Preorder
   const [productsSortBy, setProductsSortBy] = useState("available"); // Available or Suggested Products
   const [currentPage, setCurrentPage] = useState(1);
  //  const [selectedProduct, setSelectedProduct] = useState(null);
   const [filters, setFilters] = useState({
    modeOfDelivery: "",
    area_limit: "",
    maxPrice: 1000,
    minPrice: 0,
    until: null,
  });

  useEffect(()=>{
    loadErrorMessages();
  },[])
  const [productData,  setProductData] = useState({});
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const [getProduct, { data:DialogData, loading:DialogLoading, error:DialogError }] = useLazyQuery(GET_PRODUCT, {
    onError: (error) => {
      console.log(error.message);
    },
  });

  const local = useLocalSearchParams(); //Product ID from Dynamic Route
  const productId = local.id
  const sheetRef = useRef<BottomSheetModal>(null); //Bottom sheet Reference

  const snapPoints = useMemo(() => [ "60%", "85%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);
  // const handleClosePress = useCallback(() => {
  //   sheetRef.current?.close();
  // }, []);

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted:(data)=>{
      Toast.show({
        type:"success",
        text1: data?.placeOrder
      })
    },
    onError:(error)=>{
      Toast.show({
        type:"error",
        text1:error?.message 
      })
    }
  });
  const { data, loading, error } = useQuery(
    productsSortBy === "available" ? GET_AVAILABLE_PRODUCTS : GET_SUGGESTED_PRODUCT,
    {
      variables: {
        category: productsType,
        itemId: productId,
        filter: filters,
        page: currentPage,
        limit: 10,
      },
    }
  );

  useEffect(()=>{
    if(data && !loading){
      if (productsSortBy === "available" && data.getAvailableProducts) {
        setProductData(data.getAvailableProducts.product);
        setTotalProduct(data?.getAvailableProducts?.totalProduct);
      } else if(productsSortBy === "suggested" && data.getSuggestedProducts){
        setProductData(data.getSuggestedProducts.product);
        setTotalProduct(data?.getSuggestedProducts?.totalProduct);
      }

    }

    setTotalPages(Math.ceil(totalProduct / 10));

  }, [data, loading, totalProduct, productsSortBy]);

    
  // if (loading) return (
  //   <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
  //     <ActivityIndicator animating={true} size="large" />
  //   </View>
  // );
  // if (error) return(
  //   <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
  //     <Text>Something went wrong</Text>
  //   </View>
  // );


  // let productData = [];
  // let totalProduct=0;
  // let totalPages=1;

  // if (data && !loading) {
  //   if (productsSortBy === "available" && data.getAvailableProducts) {
  //     productData = data.getAvailableProducts.product;
  //     totalProduct = data?.getAvailableProducts?.totalProduct;
  //     totalPages = Math.ceil(totalProduct/10);
  //   } else if (productsSortBy === "suggested" && data.getSuggestedProducts) {
  //     productData = data.getSuggestedProducts.product;
  //     totalProduct = data?.getSuggestedProducts?.totalProduct;
  //     totalPages = Math.ceil(totalProduct/10);
  //   } 
  // }

  
  const updateFilters = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      
    });
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
          <TouchableOpacity
            onPress={()=>router.back()}
            style={{marginRight:30}}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
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

          {loading ? (<View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ActivityIndicator size={"large"}/>
          </View>):null}

          {error ? (<View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
            <Text>Error Loading Products</Text>
          </View>):null}
         
         {/* {productsSortBy === 'suggested' && !loading && productData ? (
          <SuggestedProducts 
          products={productData} 
          setOpenSheet={setOpenSheet} 
          getProduct={getProduct}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          />
        ) : null} */}

        {/* {productsSortBy == 'available' && !loading && productData ? (
          ) : null} */}
        {!loading && productData ?(<AvailableProducts 
        products={productData} 
        setOpenSheet={setOpenSheet} 
        getProduct={getProduct}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        />):null}

         <FilterBottomSheet 
         sheetRef={sheetRef} 
         updateFilters={updateFilters} 
         snapPoints={snapPoints} />

        <PurchaseBottomSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        placeOrder={placeOrder}
        data = {DialogData?.getProduct}
        loading = {DialogLoading}
        error = {DialogError}
        />
     </SafeAreaView>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ecf0f1',
    //  padding: 8,
     paddingBottom: 100,
   },
 
   headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:20,
    // paddingTop:5
    marginTop:20,
    paddingVertical:10
    // marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 40, // Adjust the height as needed
  },
  toggleContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginVertical: 10,
    marginBottom:5,
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
 