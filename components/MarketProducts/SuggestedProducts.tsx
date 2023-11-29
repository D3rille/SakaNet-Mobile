//@ts-nocheck
import React, { useState } from 'react';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { View, Text, ScrollView, Image, Button, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { Card, Avatar, Text as Txt, Button as Btn, Divider } from 'react-native-paper';
import PurchaseDialog from '../../components/MarketProducts/PurchaseDialog';
import defaultProfileImage from "../../assets/images/default_profile.jpg";
import { sakanetGreen } from '../../constants/Colors';
import {formatWideAddress} from "../../util/addresssUtils";


export default function SuggestedProducts({ products, productId, setOpenSheet, getProduct }) {
    // const defaultProfileImage = require('../../assets/images/default_profile.jpg');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const show = (product) => 
    {
      setOpenSheet(true);
      getProduct({
        variables:{
          productId:product?._id
        }
      })

    };
    const hide = () => setModalVisible(false);

    return (
      <View>
        {products && products.length == 0 ? (
          <View style={{justifyContent:"center"}}>
            <Txt style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Products</Txt>
          </View>
        ):null}
        {products && products.length > 0 ? (
        <ScrollView contentContainerStyle={styles.cardContainer}>
          {products.map((product) => (
            <View key={product._id} style={styles.card}>
              <View style={styles.rowContainer}>
                <Avatar.Image
                  source={product?.seller?.profile_pic
                    ? { uri: product.seller.profile_pic }
                    : defaultProfileImage
                  }
                  size={50}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{product.seller.name}</Text>
                  <Text style={styles.address}>
                    {formatWideAddress(product?.seller?.address)}
                    {/* {product.seller && ` ${product.seller.address.cityOrMunicipality}, ${product.seller.address.province}`} */}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <StarRatingDisplay
                      rating={product.seller.rating}
                      onChange={() => {}}
                      starSize={18}
                      gap={0}
                    />
                    <Text>({product.seller.rating})</Text>
                  </View>
                </View>
              </View>
              {product?.product_description ? (<View style={{margin:5, flexWrap:"wrap"}}>
                  <Txt>
                    {product?.product_description}
                  </Txt>
              </View>): null}
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
          ))}
        </ScrollView>
      ):null}


      {selectedProduct ? (
        <PurchaseDialog modalVisible={modalVisible} hide={hide} selectedProduct={selectedProduct} />
      ):null}
    </View>
  );
        
}

const styles = StyleSheet.create({
    cardContainer: {
      paddingHorizontal: 16,
      paddingBottom:100
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
  
