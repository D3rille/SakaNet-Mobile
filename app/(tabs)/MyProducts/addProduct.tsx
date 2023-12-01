//@ts-nocheck
import React, { useRef, useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import {Text, ActivityIndicator} from "react-native-paper"
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constants/index';
import {useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { AntDesign } from '@expo/vector-icons';
import Toast from "react-native-toast-message"; 
// import BottomSheet from "@gorhom/bottom-sheet";
import DatePicker from 'react-native-date-picker';

import { 
  GET_ALL_MARKET_PRODUCTS, SEARCH_ALL_PRODUCT, CREATE_PRODUCT, 
  GET_MARKET_PRODUCT, SEARCH_MY_PRODUCTS, GET_MY_PRODUCTS
} from "../../../graphql/operations/product";
import { formatToCurrency } from '../../../util/currencyFormatter';
import AddProductBottomSheet from '../../../components/MyProducts/AddProductBottomSheet';

// type ProductItem = {
//   id: string;
//   name: string;
//   image: string;
// };

const ProductCard = ({product, setOpenSheet, getDataForModal}) =>{
  return(
    <View style={{marginHorizontal:10}}>
      <TouchableOpacity 
      // key={product?._id} 
      style={styles.card}
      onPress={()=>{
        setOpenSheet(true);
        getDataForModal({
          variables:{
            productId:product._id
          }
        })
      }}
      >
        <Image
          source={{ uri: product?.photo }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productNameContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {!product.name.tagalog ? product.name.english : `${product.name.tagalog} | ${product.name.english}` } 
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const AddProduct = () => {
  const [openProdModal, setOpenProdModal] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [filter, setFilter] = useState("");
  const [searchFocus, setSearchFocus]=useState(false);

  const [productData,  setProductData] = useState({});
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [openSheet, setOpenSheet] = useState(false);

  // const sheetRef = useRef<BottomSheet>(null);

  const { loading, error, data } = useQuery(
    GET_ALL_MARKET_PRODUCTS,
    {
        variables: {
        type: selectedCategory,
        // limit:(searchFocus && filter)?136:10,
        limit:10,
        page: currentPage,
        },
    }
  );

  const [searchProduct,{data:searchData, error:searchError, loading:searchLoading}]=useLazyQuery(
    SEARCH_ALL_PRODUCT,
    {
        variables: {
            type: selectedCategory,
            searchInput: filter
        },
    }
  );  

  const [getDataForModal,{data:modalData, error:errorModalData, loading:loadingModalData}]=useLazyQuery(GET_MARKET_PRODUCT);

  useEffect(()=>{
    if (filter && searchData) {
      setProductData(searchData.searchAllMarketProduct);
      setTotalProduct(productData.length);
    } else if(data && !loading){
      setProductData(data.getAllMarketProducts.product);
      setTotalProduct(data?.getAllMarketProducts.totalProduct);
    }

    setTotalPages(Math.ceil(totalProduct / 10));

  }, [data, loading, searchData, searchLoading, filter, totalProduct])

  return (
    <SafeAreaView style={styles.container}>

      {loading ? (<View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
        <ActivityIndicator size={"large"}/>
      </View>):null}

      {error ? (<View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
        <Text>Error Loading Products</Text>
      </View>):null}

      {/* Product Cards */}
      {data && !loading ? (<ScrollView contentContainerStyle={{flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", paddingTop:10}}>
        {productData?.length > 0 ? productData?.map((product)=>(
          <ProductCard key={product._id} product={product} setOpenSheet={setOpenSheet} getDataForModal={getDataForModal}/>
        )):null}
      </ScrollView>):null}

      {/* Pagination */}
      {!searchFocus && !loading ? (<View style={{marginVertical:10, alignItems:"center", marginBottom:30}}>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity
          onPress={()=>{
            if(currentPage !=1 ){
              setCurrentPage(currentPage-1);
            }
          }}
          >
            <AntDesign name="caretleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{marginHorizontal:20}}>{currentPage}</Text>
          <TouchableOpacity
            onPress={()=>{
              if((currentPage != totalPages) && !loading){
                setCurrentPage(currentPage + 1);
              } else if(currentPage == totalPages){
                Toast.show({
                  type: 'info',
                  text1: 'You have reached the end.'
                });
              }
            }}
          >
            <AntDesign name="caretright" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>):null}
      
        <AddProductBottomSheet 
          openSheet={openSheet} 
          setOpenSheet={setOpenSheet} 
          data={modalData?.getMarketProduct} 
          loading={loadingModalData}
          error={errorModalData}
        />

    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  cardContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: 160,
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
  addIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default AddProduct;
