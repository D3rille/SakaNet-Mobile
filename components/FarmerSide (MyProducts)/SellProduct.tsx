//@ts-nocheck
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/index';

import DetailsDialog from "./DetailsDialog";
import { formatToCurrency } from '../../util/currencyFormatter';

type ProductItem = {
  id: string;
  name: string;
  image: string;
};

// const products: ProductItem[] = [
//   { id: '1', name: 'Very Long Product Name mahaba mahaba mahaba', image: 'path_to_image' },
//   { id: '2', name: 'Product 2', image: 'path_to_image' },
//   { id: '3', name: 'Product 3', image: 'path_to_image' },
//   { id: '4', name: 'Product 4', image: 'path_to_image' },
//   { id: '5', name: 'Product 5', image: 'path_to_image' },
//   { id: '6', name: 'Product 6', image: 'path_to_image' },
//   { id: '1', name: 'Very Long Product Name mahaba mahaba mahaba', image: 'path_to_image' },
//   { id: '2', name: 'Product 2', image: 'path_to_image' },
//   { id: '3', name: 'Product 3', image: 'path_to_image' },
//   { id: '4', name: 'Product 4', image: 'path_to_image' },
//   { id: '5', name: 'Product 5', image: 'path_to_image' },
//   { id: '6', name: 'Product 6', image: 'path_to_image' },
// ];

const Sell = ({product}) => {
  const modalRef = useRef(null);
  const [openDialog, setOpenDialog] = useState("");

  const handleOpenDetails = () =>{
    setOpenDialog("details");
  }
 

  if(product){
    return (
      <View style={{marginHorizontal:10}}>
        {openDialog == "details" && (<DetailsDialog product={product} visible={Boolean(openDialog)} setVisibility={setOpenDialog}/>)}
        <TouchableOpacity 
        key={product?._id} 
        style={styles.card}
        onPress={()=>{handleOpenDetails()}}
        >
          <Image
            source={{ uri: product?.photo ? product.photo : product.item.photo }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productNameContainer}>
            <Text style={styles.productName} numberOfLines={2}>
            {product.item.tagalogName ? `${product.item.tagalogName} | `:""}{product.item.englishName} 
            </Text>
            <Text variant="labelSmall" style={{paddingBottom:5}}>
              {formatToCurrency(product.price)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

};

const styles = StyleSheet.create({
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

export default Sell;
