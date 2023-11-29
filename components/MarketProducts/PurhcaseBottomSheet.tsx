//@ts-nocheck
import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Button, ScrollView } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import StarRatingDisplay from 'react-native-star-rating-widget';
import { TextInput, Text, ActivityIndicator, RadioButton, Avatar,  DataTable, MD2Colors, Button as Btn } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sakanetGreen, sakanetOrange } from "../../constants/Colors";
import {useMutation} from "@apollo/client";
import Toast from "react-native-toast-message";
import {router} from "expo-router";

import { formatDate, timePassed } from "../../util/dateUtils";
import { CREATE_PRODUCT, GET_MY_PRODUCTS } from "../../graphql/operations/product";
import { ADD_TO_CART, GET_CART_ITEMS } from "../../graphql/operations/cart";
import defaultProfileImage from "../../assets/images/default_profile.jpg";
import { formatWideAddress } from "../../util/addresssUtils";
import { formatToCurrency } from "../../util/currencyFormatter";

const PurchaseBottomSheet = ({openSheet, setOpenSheet, placeOrder, data, loading, error}) => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // Inputs
  const [contactNumber, setContactNumber] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [addToCart] = useMutation(ADD_TO_CART);
  

  useEffect(()=>{
    if(openSheet && snapPoints){
      sheetRef.current?.snapToIndex(2);
    }
  },[openSheet, snapPoints]);


  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setOpenSheet(false);
  }, []);

  let product;
  let seller;
  if(data?.product){
    product = data?.product;
    
  }
  if(data?.seller){
    seller = data?.seller;
  }

  const executeAddToCart = () => {
    addToCart({variables:{
            "order": {
              "type": product?.category == "Sell" ? "Order":"Pre-Order",
              "productId": product?._id,
              "seller": {
                "id": seller?.id,
                "name": seller?.name
              },
              "quantity": parseFloat(quantity),
              "modeOfPayment": modeOfPayment,
              "modeOfDelivery":product.modeOfDelivery,
              "deliveryAddress": deliveryAddress,
              "phoneNumber": contactNumber.trim(),
              "unit": product?.unit,
              "photo": product.photo ? product.photo : product.item.photo
            }
        },
        refetchQueries:[GET_CART_ITEMS],
        onCompleted:()=>{
          Toast.show({
            type:"success",
            text1: "Succesfully Added to Cart"
          })
            // handleClose();
        },
        onError:(error)=>{
            Toast.show({
              type:"error",
              text1: error?.message
            })
            // console.error(error.message);
        }
    })
  }


  const handleBuyNow = () => {
    // console.log(contactNumber)
    placeOrder({
      variables: {
        order: {
          type: product?.category === 'Sell' ? 'Order' : 'Pre-Order',
          productId: product?._id,
          seller: {
            id: seller?.id,
            name: seller?.name,
          },
          quantity: parseFloat(quantity),
          modeOfPayment: modeOfPayment,
          modeOfDelivery: product?.modeOfDelivery,
          deliveryAddress: deliveryAddress,
          phoneNumber: contactNumber,
          unit: product?.unit,
          photo: product.photo ? product.photo : product.item.photo,
        },
      },
    });
  };
  
  return (
    <View style={styles.container}>
      
      <BottomSheet
        style={{padding:10}}
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        // onChange={handleSheetChange}
        enablePanDownToClose={true}
        onClose={()=>{
          setOpenSheet(false);
          // resetInputs();
        }}
        
      >
        {loading ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ActivityIndicator size={"large"}/>
          </View>
        ):null}

        {error ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
            <Text>Error Loading Product Information</Text>
          </View>
        ):null}

        {data && !loading ? (
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <View style={styles.rowContainer}>
              <Avatar.Image
              source={seller?.profile_pic
                  ? { uri: seller?.profile_pic }
                  : defaultProfileImage
              }
              size={50}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{seller.name}</Text>
                <Text style={styles.address}> 
                  {formatWideAddress(seller?.address)}
                </Text>
                <View style={styles.ratingContainer}>
                    <StarRatingDisplay
                    rating={seller.rating}
                    onChange={() => {}}
                    starSize={18}
                    gap={0}
                    />
                    <Text>({seller.rating})</Text>
                </View>
              </View>
            </View>
            <Image source={{uri:product.item.photo}} style={{flex:1, width:"100%", height:200}} />
          </View>
          {/* Product name and price */}
          <View style={styles.textContainer}>
            <Text style={styles.productName}>
                {product.item.tagalogName ? `${product.item.tagalogName} | ${product.item.englishName}`: product.item.englishName}
            </Text>
            <Text style={styles.stock}>
                Price: {formatToCurrency(product.price, 2)}/{product.unit}
            </Text>
          </View>
          {/* Input quantity and contact number*/}
          <View style={{paddingVertical:5, paddingHorizontal:10}}>
            <TextInput
              mode="outlined"
              label="Quantity"
              placeholder="0"
              value={quantity.toString()}
              onChangeText={(text) => parseFloat(setQuantity(text))}
              keyboardType="number-pad"
            />
            <TextInput
              mode="outlined"
              label="Contact Number"
              placeholder="0"
              value={contactNumber}
              onChangeText={(text) => setContactNumber(text)}
            />
          </View>

          <Text style={{paddingHorizontal:10, paddingTop:10}}>Mode of Payment</Text>
          <View style={[styles.radioButtonRow, {paddingHorizontal:10, paddingBottom:10}]}>
            <RadioButton.Group onValueChange={newValue => setModeOfPayment(newValue)} value={modeOfPayment}>
          <View style={styles.radioButtonRow}>

            <View style={styles.radioButtonRow}>
              <Text>Cash</Text>
              <RadioButton value="Cash"  color="#2F603B"/>
            </View>
            <View style={styles.radioButtonRow}>
              <Text>Online</Text>
              <RadioButton value="Online" color="#2F603B" />
            </View>
            </View>
          </RadioButton.Group>
          </View>

          <View style={styles.buttonRow}>
              <Btn
                buttonColor={sakanetGreen}
                textColor="white"
                // style={{borderRadius:4}}
                onPress={handleBuyNow}
              >Buy Now</Btn>
              <Btn
                buttonColor={sakanetGreen}
                textColor="white"
                // style={{borderRadius:4}}
                onPress={()=>{
                  executeAddToCart()
                }}
              >Add to Cart</Btn>
              
          </View>

          {/* Product Details */}
            <View style={styles.productDetails}>
                <DataTable>
                <DataTable.Header>
                    <DataTable.Title
                    >
                        Product Details
                    </DataTable.Title>
                </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>Product Id</DataTable.Cell>
                        <DataTable.Cell>
                        <Text style={{flexWrap:"wrap"}}>
                          {product._id}
                        </Text>
                        </DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Category</DataTable.Cell>
                        <DataTable.Cell>
                        <View style={product.category == "Pre-Sell" ? styles.preOrderBox : styles.orderBox}>
                          <Text style={styles.categoryText}>
                            {product.category == "Pre-Sell" ? "PRE-ORDER" : "Order"}
                          </Text>
                        </View>
                      </DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Stocks</DataTable.Cell>
                        <DataTable.Cell>{product.stocks}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Minimum Order</DataTable.Cell>
                        <DataTable.Cell>{product.minimum_order}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Seller Address</DataTable.Cell>
                        <DataTable.Cell>
                          <Text style={{flexWrap:"wrap"}}>
                            {formatWideAddress(seller.address)}
                          </Text>
                        </DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Delivery Method</DataTable.Cell>
                        <DataTable.Cell>{product.modeOfDelivery}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Pickup Location</DataTable.Cell>
                        <DataTable.Cell>
                        <Text style={{flexWrap:"wrap"}}>
                          {product.pickup_location}
                        </Text>
                        </DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Closing</DataTable.Cell>
                        <DataTable.Cell>{timePassed(product.until)}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>
        </BottomSheetScrollView>):null}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom:0,
    position:"absolute",
    width:"100%",
    height:"100%",
    // paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
    paddingTop:10, 
    paddingBottom:50
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  textInput:{
    
    marginVertical: 8,
    marginHorizontal:4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5
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
  productName:
    {
     fontSize: 16,
     fontWeight: "bold",
    },
    radioButtonRow:
    {
        flexDirection: 'row',
        alignItems:"center"
    },
    buttonRow:
    {
        flexDirection: 'row',
        gap: 10,
    },
    productDetails:
    {
        flex: 1,
    },
    
    preOrderBox: {
      backgroundColor: "#FE8C47",
      borderRadius: 8,
      width: "fit-content",
      padding: 2,
      paddingHorizontal: 8,
    },
    orderBox: {
      backgroundColor: "#2F613A",
      borderRadius: 8,
      width: "fit-content",
      padding: 2,
      paddingHorizontal: 8,
    },
    categoryText: {
      color: "white",
      fontSize: 12,
    },
});

export default PurchaseBottomSheet;