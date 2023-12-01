// @ts-nocheck
import React from 'react';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { View, Text, ScrollView, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Text as Txt, Button as Btn, Divider } from 'react-native-paper';
import defaultProfileImage from "../../assets/images/default_profile.jpg";
import {formatWideAddress} from "../../util/addresssUtils";
import { sakanetGreen } from '../../constants/Colors';


const ProductCard = ({product, show}) => {
  return (
    <View style={styles.card}>
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
                  // onChange={() => {}}
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
  )
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

export default ProductCard