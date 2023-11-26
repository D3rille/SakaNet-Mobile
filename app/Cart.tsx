import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';


function MyCart() {
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };
  
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      seller: 'Farmer 1',
      productName: 'Product1 long long long long name',
      details: ['Detail1', 'Detail2'],
      price: '₱10.00',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      seller: 'Farmer 2',
      productName: 'Product2',
      details: ['Detail1', 'Detail2'],
      price: '₱30.00',
      imageUrl: 'https://via.placeholder.com/100',
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      setQuantities(prevQuantities => ({ ...prevQuantities, [id]: quantity }));
    }
  };

  const toggleItemSelection = (id, isSelected) => {
    setSelectedItems(prevItems => ({ ...prevItems, [id]: isSelected }));
  };

  const deleteSelectedItems = () => {
    setCartItems(cartItems.filter(item => !selectedItems[item.id]));
    setSelectedItems({});
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.id]) {
        const itemQuantity = quantities[item.id] || 1;
        const itemPrice = parseFloat(item.price.replace('₱', '')) || 0;
        return total + itemPrice * itemQuantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerText}>My Cart</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedItems}>
          <Ionicons name="trash-outline" size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.sellerAndPriceContainer}>
              <View style={styles.sellerContainer}>
                <FontAwesome5 name="store" size={16} color="black" style={styles.storeIcon} />
                <Text style={styles.sellerName}>{item.seller}</Text>
              </View>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottomSection}>
              <Checkbox
                status={selectedItems[item.id] ? 'checked' : 'unchecked'}
                onPress={() => toggleItemSelection(item.id, !selectedItems[item.id])}
                color={COLORS.green}
                style={styles.checkbox}
              />
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
                  {item.productName}
                </Text>
                {item.details.map((detail, index) => (
                  <Text key={index} style={styles.detailText}>{detail}</Text>
                ))}
              </View>
              <View style={styles.quantitySelector}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}>
                  <FontAwesome name="plus-square" size={22} color={COLORS.green} style={styles.iconButton} />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  onChangeText={(text) => updateQuantity(item.id, text)}
                  value={String(quantities[item.id] || 1)}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)} disabled={quantities[item.id] === 1}>
                  <FontAwesome name="minus-square" size={22} color={quantities[item.id] === 1 ? COLORS.pageBg : '#DFDFDF'} style={styles.iconButton} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Total: ₱{calculateTotalPrice()}</Text>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
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
    flex: 1,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 15,
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
    lexWrap: 'wrap' 
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
