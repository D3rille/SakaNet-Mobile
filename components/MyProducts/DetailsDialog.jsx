import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, ActivityIndicator } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 

import { timePassed, formatDate } from '../../util/dateUtils';
import {formatToCurrency} from "../../util/currencyFormatter";

const DetailsDialog = ({visible, setVisibility, product}) =>{

    const hideDialog = () =>{
      setVisibility("");
    }
  
    return(
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Details</Dialog.Title>
          <TouchableOpacity style={{position:"absolute", top:0, right:0, margin:25}} onPress={()=>hideDialog()}>
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>
          <Dialog.ScrollArea>
            <ScrollView >
              <Text>Product Id: {product._id}</Text>
              <Text>Product Type: {product.item.product_type}</Text>
              <Text>Price: {formatToCurrency(product.price)}</Text>
              <Text>Unit: {product.unit}</Text>
              <Text>Available Stocks: {product.stocks}</Text>
              <Text>Minimum Order: {product.minimum_order}</Text>
              <Text>Until: {formatDate(product.until, "ll")}</Text>
              {product.category == "Pre-Sell" && (<Text>Harvest Date: {product.dateOfHarvest}</Text>)}
              <Text>Mode of Delivery: {product.modeOfDelivery}</Text>
              {product.modeOfDelivery == "pick-up" && (<Text>Pick-up Location: {product.pickup_location}</Text>)}
              <Text>Area Limit: {product.area_limit}</Text>
              <Text>Created: {timePassed(product.createdAt)}</Text>
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    )
}
export default DetailsDialog;