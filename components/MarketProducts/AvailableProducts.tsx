//@ts-nocheck
import React, { useState } from 'react';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { View, Text, ScrollView, Image, Button, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { Card, Avatar } from 'react-native-paper';
import PurchaseDialog from '../../components/MarketProducts/PurchaseDialog';
import { useMutation } from '@apollo/client';
import {PLACE_ORDER} from '../../graphql/operations/order'

export default function AvailableProducts({ product, productId }) {
    const defaultProfileImage = require('../../assets/images/default_profile.jpg');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [placeOrder, { loading: placeOrderLoading, error: placeOrderError, data: placeOrderData }] = useMutation(PLACE_ORDER, {
      onError: (error) => {
        console.log(error.message);
      },
      onCompleted: (data) => {
        console.log('Order placed successfully:', data);
      },
    });
    

    const show = (product) => 
    {
      setModalVisible(true);
      setSelectedProduct(product);

    };
    const hide = () => setModalVisible(false);
    return (
      <View>
        {product && product.length > 0 && ( 
        <ScrollView contentContainerStyle={styles.cardContainer}>
    {product.map((product) => (
        <View key={product._id} style={styles.card}>
        <View style={styles.rowContainer}>
            <Avatar.Image
            source={product.seller.profile_pic
                ? { uri: product.seller.profile_pic }
                : defaultProfileImage
            }
            />
            <View style={styles.textContainer}>
            <Text style={styles.name}>{product.seller.name}</Text>
            <View style={styles.ratingContainer}>
                <StarRatingDisplay
                rating={product.seller.rating}
                onChange={() => {}}
                starSize={20}
                gap={0}
                />
                <Text>({product.seller.rating})</Text>
            </View>
            <Text style={styles.address}> 
            {product.seller && ` ${product.seller.address.cityOrMunicipality}, ${product.seller.address.province}`}
            </Text>
            </View>
        </View>
        <Image source={{ uri: product.item.photo }} style={styles.image} />
        <Text style={styles.title}>
            {product.item.englishName}
        </Text>
        <Text style={styles.stock}>
            Stocks: {product.stocks} {product.unit}
        </Text>
        <Text style={styles.stock}>
            Price: ₱{product.price}/{product.unit}
        </Text>
        <Button
            title="Buy Now"
            color="#2F603B"
            onPress={() => {
            show(product)
            }}
        />
        </View>
    ))}
    </ScrollView>
     )}


    {selectedProduct && (
            <PurchaseDialog 
            modalVisible={modalVisible} 
            hide={hide} 
            placeOrder={placeOrder} 
            selectedProduct={selectedProduct}
            placeOrderLoading={placeOrderLoading}
            placeOrderError={placeOrderError} />
        )}</View>

    );
  
}

const styles = StyleSheet.create({
    cardContainer: {
      paddingHorizontal: 16,
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
  
