//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Button, FAB, Dialog, Portal, Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import SellProducts from '../../../components/MyProducts/SellProduct';
import PreSellProducts from '../../../components/MyProducts/PreSellProduct';
import OpenClosedBottomSheet from '../../../components/MyProducts/OpenClosedBottomSheet'; 
import { COLORS, SIZES } from '../../../constants/index';
import { Stack, useRouter, Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; 
import { useQuery, useLazyQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';

import MyProductsHeader from '../../../components/MyProducts/MyProductsHeader';
import { GET_MY_PRODUCTS, SEARCH_MY_PRODUCTS } from '../../../graphql/operations/product';

// If status can only be 'sell' or 'presell'
type CategoryType = 'sell' | 'presell';

const Product = () => {
  const router = useRouter();
  const [status, setStatus] = useState<CategoryType>('open'); // open, closed
  const [category, setCategory] = useState("Sell"); // Sell, Pre-Sell
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const [productData,  setProductData] = useState({});
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { loading, error, data } = useQuery(
    GET_MY_PRODUCTS,
    {
      variables: {
        category:category,
        limit:8,
        page:currentPage,
        status:status
      },
    }
  );

  const [
    searchProduct,
    { data: searchData, error: searchError, loading: searchLoading },
  ] = useLazyQuery(
    SEARCH_MY_PRODUCTS,
    {
      variables: {
        category:category,
        status:status,
        searchInput: filter,
      },
    }
  );


  useEffect(()=>{
    if (filter && searchData) {
      setProductData(searchData.searchMyProducts);
      setTotalProduct(productData.length);
    } else if(data && !loading){
      setProductData(data.getMyProducts.product);
      setTotalProduct(data?.getMyProducts.totalProduct);
    }

    setTotalPages(Math.ceil(totalProduct / 10));

  }, [data, loading, searchData, searchLoading, filter, totalProduct])
  
  // Define the type for the ref
  const bottomSheetRef = useRef<{ open: () => void }>(null);

  const getButtonStyle = (buttonStatus: CategoryType) => ({
    ...styles.toggleButton,
    backgroundColor: category === buttonStatus ? COLORS.orange : 'transparent',
  });

  const getTextStyle = (buttonStatus: CategoryType) => ({
    color: category === buttonStatus ? 'white' : COLORS.orange,
    fontSize: SIZES.small,
  });


  
  // const renderProductList = () => {
  //   if (category === 'sell') {
  //     return <SellProducts />;
  //   } else if (category === 'presell') {
  //     return <PreSellProducts />;
  //   }
  // };
  const handleFilterChange = (text:string) =>{
    setFilter(text);
  }

  const handleSortPress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open(); 
    }
  };

  // const handleOpenDetails = () =>{
  //   setOpenDialog("details");
  // }

  // if(loading){
  //   return(
  //     <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
  //       <ActivityIndicator size={"large"}/>
  //     </View>
  //   );
  // } else if(error){
  //   return(
  //     <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
  //       <Text>Error Loading My Products</Text>
  //     </View>
  //   )
  // }

  return (
    
    <SafeAreaView style={styles.container}>

      <MyProductsHeader 
      handleSortPress = {handleSortPress}
      handleFilterChange = {handleFilterChange}
      setSearchFocus = {setSearchFocus}
      searchProduct = {searchProduct}
      />

      {/* {openDialog == "details" && (<DetailsDialog visible={Boolean(openDialog)} setVisibility={setOpenDialog}/>)} */}

      <View style={styles.toggleContainer}>
        <Button
          compact
          onPress={() => {
            setCategory('Sell');
            setCurrentPage(1);
            setTotalPages(1);
          }}
          style={getButtonStyle('Sell')}
          labelStyle={getTextStyle('Sell')}
        >
          Sell
        </Button>
        <Button
          compact
          onPress={() => {
            setCategory('Pre-Sell');
            setCurrentPage(1);
            setTotalPages(1);
          }}
          style={getButtonStyle('Pre-Sell')}
          labelStyle={getTextStyle('Pre-Sell')}
        >
          Pre-sell
        </Button>
      </View>


      {loading && (<View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
        <ActivityIndicator size={"large"}/>
      </View>)}

      {error && (<View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
        <Text>Error Loading My Products</Text>
      </View>)}

      {data && !loading && (<ScrollView contentContainerStyle={{flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between"}}>
        {productData.length > 0 && productData?.map((product)=>(
            <SellProducts key={product._id} product = {product}/>
          )
        )}
        {productData && productData.length == 0 && (
        <View style={{flex:1, justifyContent:"center", paddingVertical:50}}>
          <Text style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Products</Text>
        </View>
        )}
      </ScrollView>)}
      {/* {renderProductList()} */}

      
      {/* Pagination */}
      {!searchFocus && productData.length > 0 && (<View style={{marginVertical:10, alignItems:"center", marginBottom:30}}>
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

      {/* Add Product Floating Button */}
      
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => {router.push("(tabs)/MyProducts/addProduct/")}}
      />
    

      {/* Bottom Sheet */}
      <OpenClosedBottomSheet ref={bottomSheetRef} status={status} setStatus={setStatus}/>
    </SafeAreaView>
  );
  if(data && !loading){
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:COLORS.orange
  },
  // ... other styles you might have
});

export default Product;