//@ts-nocheck
import React, { useState, useEffect } from 'react';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { View, Text, ScrollView, Image, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card, Avatar, Text as Txt, Button as Btn, Divider } from 'react-native-paper';
import PurchaseDialog from '../../components/MarketProducts/PurchaseDialog';
import { useMutation, useLazyQuery } from '@apollo/client';
import {PLACE_ORDER, GET_ORDERS} from '../../graphql/operations/order';
import { GET_PRODUCT } from '../../graphql/operations/product';
import defaultProfileImage from "../../assets/images/default_profile.jpg";
import {formatWideAddress} from "../../util/addresssUtils";
import { sakanetGreen } from '../../constants/Colors';
import Toast from "react-native-toast-message";
import PurchaseBottomSheet from './PurhcaseBottomSheet';
import { AntDesign } from '@expo/vector-icons';

export default function AvailableProducts({ products, setOpenSheet, getProduct, currentPage, setCurrentPage, totalPages}) {
    // const defaultProfileImage = require('../../assets/images/default_profile.jpg');
    const [modalVisible, setModalVisible] = useState(false);
    // const [selectedProduct, setSelectedProduct] = useState(null);
    // const [placeOrder, { loading: placeOrderLoading, error: placeOrderError, data: placeOrderData }] = useMutation(PLACE_ORDER, {
    //   // refetchQueries:[GET_ORDERS],
    //   onError: (error) => {
    //     Toast.show({
    //       type:"error",
    //       text1:error?.message
    //     })
    //     console.log(error.message);
    //   },
    //   onCompleted: (data) => {
    //     Toast.show({
    //       type:"success",
    //       text1:"Successfully placed Order"
    //     });
    //     console.log('Order placed successfully:', data);
    //     hide();
    //   },
    // });

    const show = (product) => 
    {
      // setModalVisible(true);
      setOpenSheet(true);
      // setSelectedProduct(product);
      getProduct({
        variables:{
          productId:product?._id
        }
      });

    };
    const hide = () => setModalVisible(false);
    // console.log(products[0]?.seller?.profile_pic)
    return (
      <View sytle={{flex:1}}>
        {products && products.length == 0 ? (
          <View style={{justifyContent:"center"}}>
            <Txt style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Products</Txt>
          </View>
        ):null}

        <ScrollView contentContainerStyle={styles.cardContainer}>
        
        {products && products.length > 0 ? products.map((product) => (
        <View key={product._id} style={styles.card}>
        <View style={styles.rowContainer}>
            <Avatar.Image
            source={product?.seller?.profile_pic
                ? { uri: product?.seller?.profile_pic }
                : defaultProfileImage
            }
            size={50}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{product.seller.name}</Text>
              <Text style={styles.address}> 
                {formatWideAddress(product?.seller?.address)}
              </Text>
              <View style={styles.ratingContainer}>
                  <StarRatingDisplay
                  rating={product.seller.rating}
                  onChange={() => {}}
                  starSize={18}
                  gap={0}
                  />
                  <Text>({product?.seller.rating})</Text>
              </View>
            </View>
        </View>
        <View style={{margin:5, flexWrap:"wrap", padding:5}}>
            <Txt style={{flexWrap:"wrap", width:"100%"}}>
              {product?.product_description}
            </Txt>
        </View>
        <Divider/>
          <Image source={{ uri: product.item.photo }} style={styles.image} />
        <Divider/>
        <View style={{paddingTop: 5, paddingBottom:10}}>
          <Text style={styles.title}>
              {product.item.englishName}
          </Text>
          <Text style={styles.stock}>
              Stocks: {product.stocks} {product.unit}
          </Text>
          <Text style={styles.stock}>
              Price: ₱{product.price}/{product.unit}
          </Text>
        </View>
        <Btn
          buttonColor={sakanetGreen}
          textColor='white'
          onPress={() => {
            show(product)
          }}
        >
          Buy Now
        </Btn>
        </View>
    )):null}

    {/* Pagination */}
    {products?.length > 0 ? (<View style={{marginVertical:10, alignItems:"center", marginBottom:20}}>
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
      </View>):null}

    </ScrollView>

      {/* {selectedProduct && (
            <PurchaseDialog 
            modalVisible={modalVisible} 
            hide={hide} 
            placeOrder={placeOrder} 
            selectedProduct={selectedProduct}
            placeOrderLoading={placeOrderLoading}
            placeOrderError={placeOrderError} />
      )} */}
    </View>

  );
  
}

const styles = StyleSheet.create({
    cardContainer: {
      paddingHorizontal: 16,
      paddingBottom:50
    },
    card: {
      marginVertical: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#fff',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom:10
    },
    textContainer: {
      marginLeft: 16,
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    address: {
      fontSize: 14,
      color: '#888',
    },
    image: {
      width: '100%',
      height: 200,
      marginVertical: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
