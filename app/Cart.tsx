//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Checkbox, Text as Txt, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useSubs } from '../context/subscriptionProvider';
import {useMutation} from "@apollo/client";
import Toast from 'react-native-toast-message';
import { DELETE_CARTITEM, GET_CART_ITEMS, CLEAR_CART_ITEMS, CHECKOUT_CART } from '../graphql/operations/cart';

import { formatToCurrency } from '../util/currencyFormatter';
import CustomDialog from '../components/popups/customDialog';
import { sakanetGreen } from '../constants/Colors';

function MyCart() {
  const {cart, cartLoading} = useSubs();
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openDialog, setOpenDialog] = useState("");

  useEffect(()=>{
    let loadCart=[]
    if(cart){
      loadCart = cart.map(item=>({
        ...item,
        checked:false,
      }))
      setCartItems(loadCart);
    }
  },[cart]);

  const [deleteItem, {loading:deleteItemLoading}] = useMutation(DELETE_CARTITEM,{
    refetchQueries:[GET_CART_ITEMS],
    onError:()=>{
      Toast.show({
        type:"error",
        text1:error.message
      })
    }
  });
  const [clearCartItems, {loading:clearCartItemsLoading}] = useMutation(CLEAR_CART_ITEMS,{
    refetchQueries:[GET_CART_ITEMS],
    onError:()=>{
      Toast.show({
        type:"error",
        text1:error.message
      })
    }
  });

  const [checkOut, {loading:checkOutLoading}] = useMutation(CHECKOUT_CART,{
    refetchQueries:[GET_CART_ITEMS],
    onCompleted:()=>{
      Toast.show({
        type:"success",
        text1:"Checkout Successful"
      })
    }, 
    onError:(error)=>{
      Toast.show({
        type:"error",
        text1:error.message
      })
    }
  });

  // update quantity of cartItems
  const updateQuantity = (id, incre_decre) => {
    // const quantity = parseInt(newQuantity, 10);
    let items=[];
    // if (!isNaN(quantity) && quantity >= 1) {
    // }
    items = cartItems.map(item=>{
      if(item._id == id){
        return {
          ...item,
          quantity:item.quantity += incre_decre
        }
      } else{
        return item
      }
    });
    setCartItems(items);
    calculateTotalPrice(items);
  };

  // checkbox toggle function
  const toggleItemSelection = (id) => {
    let items = cartItems;
    items = cartItems.map(item=>{
      if(item?._id == id){
        if(item.checked){
          return {
            ...item,
            checked: false
          }
        } else if(!item.checked) {
          return {
            ...item,
            checked:true
          }
        }
      }
      return item
    });

    setCartItems(items)

    calculateTotalPrice(items)
  };

  //calculate the total price
  const calculateTotalPrice = (items) => {
    let total= 0;
    items.map(item=>{
      if(item.checked){
        total += item.quantity * item.price
      }
    })
    setTotalPrice(total);
    
  };

  // check if item is selected
  const checkIfSelected = (id) =>{
    const result = cartItems.find(item=>item?._id == id);
    return result.checked;
  }

  //delete selected items
  const deleteSelectedItems = () =>{
    let filteredItems = cartItems.filter(item=>item.checked)
    let selectedItems = filteredItems.map((item)=>{
      return item._id 
    })
    
    if(selectedItems.length > 0){

      clearCartItems({
        variables:{
          "cartItemIds":selectedItems
        }
      });
    }
    calculateTotalPrice(cartItems);
    uncheckAll();
    setTotalPrice(0)
  }

  // uncheck all items
  const uncheckAll = () =>{
    let items = cartItems.map(item=>{
      return {
        ...item,
        checked:false
      }
    });
    setCartItems(items)
  }

  //check if a product is selected
  const hasSelectedProd = () =>{
    let result = false
    for (let index = 0; index < cartItems?.length; index++) {
      if(cartItems[index].checked){
        result = true;
        break;
      }
    }
    return result;
  }

  //processes cartItem data to input format for graphql mutation
  const readyForCheckOut = () =>{
    let selectedItems = cartItems.filter(item=>item.checked);
    let checkOutItems = selectedItems.map(item=>({
      id:item._id,
      quantity: item.quantity,
      productId: item.productId,
      sellerId: item.seller.id
    }))
    return checkOutItems;
  }

  const executeCheckOut = () =>{
    checkOut({
      variables:{
        "cartItems": readyForCheckOut()
        
      }, 
      onCompleted:()=>{
        Toast.show({
          type:"success",
          text1:"CheckOut Successful"
        });
        setTotalPrice(0);
      }
    });
    
  };

  const renderItem = ({item}) => (
    <View key={item?._id} style={styles.itemContainer}>
      <View style={styles.sellerAndPriceContainer}>
        <View style={styles.sellerContainer}>
          <FontAwesome5 name="store" size={16} color="black" style={styles.storeIcon} />
          <Text style={styles.sellerName}>{item?.seller.name}</Text>
        </View>
        <Text style={styles.productPrice}>{formatToCurrency(item.price, 2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomSection}>
        <Checkbox
          status={checkIfSelected(item?._id) ? 'checked' : 'unchecked'}
          onPress={() => toggleItemSelection(item?._id)}
          color={COLORS.green}
          style={styles.checkbox}
        />
        <Image source={{ uri: item?.photo }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
            {item.marketProductName}
          </Text>
          <Text style={styles.detailText}>Unit: {item?.unit}</Text>
          <Text style={styles.detailText}>Seller: {item?.seller?.name}</Text>
          <Text style={styles.detailText}>Type: {item?.type}</Text>
          <Text style={styles.detailText}>Mode of Delivery: {item?.modeOfDelivery}</Text>
          <Text style={styles.detailText}>Mode of Payment: {item?.modeOfPayment}</Text>
          
        </View>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => updateQuantity(item?._id, 1)}>
            <FontAwesome name="plus-square" size={22} color={COLORS.green} style={styles.iconButton} />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            // onChangeText={(text) => updateQuantity(item?._id, text)}
            value={String(item.quantity || 1)}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => updateQuantity(item?._id, -1)} disabled={item.quantity === 1}>
            <FontAwesome name="minus-square" size={22} color={item.quantity === 1 ? COLORS.pageBg : '#DFDFDF'} style={styles.iconButton} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Cart</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          disabled={!hasSelectedProd()} 
          onPress={()=>{
            if(cartItems.length>0 && hasSelectedProd()){
              setOpenDialog("delete");
            }
          }}
          >
          <Ionicons name="trash-outline" size={22} color={hasSelectedProd() ? "gray" : "#e5e5e5"} />
        </TouchableOpacity>
      </View>
      {cartLoading ? (
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <ActivityIndicator size="large"/>
        </View>
      ):null}

      {!cartLoading && cartItems?.length>0 ? (<FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item)=> item?._id}
        contentContainerStyle={styles.bodyContainer}
        style={{ flex: 1 }}
      />) 
      :(
        <View style={[styles.bodyContainer, {justifyContent:"center"}]}>
          <Txt style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Cart Items</Txt>
        </View>
        )
      }

      {openDialog == "delete" ? (
        <CustomDialog
          visible={Boolean(openDialog)}
          setVisible={setOpenDialog}
          title={"Delete"}
          message={"Delete selected items from the cart?"}
          btnDisplay={0}
          callback={()=>deleteSelectedItems()}
        />
      ):null}

      {openDialog == "checkOut" ? (
        <CustomDialog
          visible={Boolean(openDialog)}
          setVisible={setOpenDialog}
          title={"CheckOut"}
          message={"Do you want to checkout the selected item/s? If yes, the orders will be automatically placed. Proceed?"}
          btnDisplay={0}
          callback={()=>executeCheckOut()}
        />
      ):null}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Total:{formatToCurrency(totalPrice)}</Text>
        <TouchableOpacity 
          style={[styles.placeOrderButton, {backgroundColor:!hasSelectedProd() ? "#c5c5c5":sakanetGreen}]}
          disabled={!hasSelectedProd()}
          onPress={()=>{
            setOpenDialog("checkOut");
            // if(cartItems.length>0 && hasSelectedProd()){
            // }
          }}
        >
          <Text style={styles.placeOrderButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 25,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 5,
  },
  bodyContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop:2,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  sellerAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  storeIcon: {
    marginRight: 5,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
  },
  detailText: {
    fontSize: 14,
    color: 'gray',
  },
  quantitySelector: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 10,
  },
  quantityInput: {
    padding: 5,
    marginVertical: 0,
    width: 50,
    textAlign: 'center',
  },
  iconButton: {
    // Styles for your icon buttons
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  totalPrice: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    flex: 1,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 10,
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight:'bold'
  },
});

export default MyCart;
