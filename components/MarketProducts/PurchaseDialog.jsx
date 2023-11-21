import React, {useState, useEffect} from 'react';
import { View, Text, Button, Modal, StyleSheet, ScrollView} from 'react-native';
import {Card, Avatar, TextInput,  RadioButton, DataTable, ActivityIndicator, MD2Colors} from 'react-native-paper';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { formatWideAddress } from "../../util/addresssUtils";
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT } from '../../graphql/operations/product';
import { PLACE_ORDER} from '../../graphql/operations/product'
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import Toast from 'react-native-toast-message';


const PurchaseDialog = ({ modalVisible, hide, selectedProduct, placeOrder, placeOrderLoading, placeOrderError}) => {
    const defaultProfileImage = require('../../assets/images/default_profile.jpg');
    const [contactNumber, setContactNumber] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
  
        getProduct();

    }, []);

    
    const [getProduct, { data, loading, error }] = useLazyQuery(GET_PRODUCT, {
      variables: {
        productId: selectedProduct?._id,
      },
      onError: (error) => {
        console.log(error.message);
      },
    });
    if (loading) return  <ActivityIndicator animating={true} color={MD2Colors.red800} />  ;

    
    const product = data?.getProduct?.product;
    const seller = data?.getProduct?.seller;

   
    const handleBuyNow = async() => {
      console.log(contactNumber)
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
            modeOfDelivery: product.modeOfDelivery,
            deliveryAddress: deliveryAddress,
            phoneNumber: contactNumber,
            unit: product?.unit,
            photo: product.photo ? product.photo : product.item.photo,
          },
        },
      });
    };
  
      if (placeOrderLoading) return  <ActivityIndicator animating={true} color={MD2Colors.red800} />  ;
      if (placeOrderError) return console.log("Error", error)
    return (
      data ? (
    <Modal
      visible={modalVisible}
      animationType="slide" 
      onRequestClose={hide}
      propagateSwipe={true}
    >
      <Button title="Cancel" onPress={hide} />

      <ScrollView>

        <View>
          <Card>
            <Card.Cover source={{ uri:  product.item.photo }} />

            <View style={styles.rowContainer}>
          <Avatar.Image
            source={seller.profile_pic
              ? { uri: seller.profile_pic }
              : defaultProfileImage
            }
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{product.seller.name}</Text>
            <View style={styles.ratingContainer}>
              <StarRatingDisplay
                rating={seller.rating}
                onChange={() => {}}
                starSize={20}
                gap={0}
              />
              <Text>{`${seller.rating}(${seller.reviewerCount ?? 0})`}</Text>
          </View> 
              <Text style={styles.productName}>
                  {product.item.tagalogName ? `${product.item.tagalogName} | ${product.item.englishName}`: product.item.englishName}
              </Text>
              <Text style={styles.stock}>
                  Price: ₱{product.price}/{product.unit}
              </Text>
          </View>
        </View>

        <View style={styles.inputRow}>
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

          <Text>Mode of Payment</Text>
          <View style={styles.radioButtonRow}>
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
              <Button title="Buy Now" onPress={handleBuyNow} />
              <Button title="Add to Cart" onPress={()=>{}} />
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
                        <DataTable.Cell>{product._id}</DataTable.Cell>
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
                        <DataTable.Cell>{formatWideAddress(seller.address)}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Delivery Method</DataTable.Cell>
                        <DataTable.Cell>{product.modeOfDelivery}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Pickup Location</DataTable.Cell>
                        <DataTable.Cell>{product.pickup_location}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>Closing</DataTable.Cell>
                        <DataTable.Cell>{product.until}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>

          </Card>
        </View>
      </ScrollView>
      <Toast/>

    </Modal>
      ):null
  );
};

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
    inputRow: {
        flexDirection: 'row',
        gap: 20,
        padding: 10,
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
  


export default PurchaseDialog;
