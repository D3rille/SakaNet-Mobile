import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, ActivityIndicator } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 

import { timePassed, formatDate } from '../../util/dateUtils';
import {formatToCurrency} from "../../util/currencyFormatter";
import { useAuth } from '../../context/auth';

const OrderDetailsDialog = ({visible, setVisibility, order}) =>{

    const {user} = useAuth();
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
              <Text>Type: {order.type}</Text>
              <Text>Placed: {timePassed(order?.createdAt)}</Text>
              <Text>Order Id: {order._id}</Text>
              <Text>Product Id: {order.productId}</Text>
              <Text>Unit: {order.unit}</Text>
              <Text>{user.role == "FARMER" ? 'Buyer: ' : "Seller: "}{user.role == "FARMER" ? order.buyer.name : order.seller.name}</Text>
              <Text>Mode of Payment: {order.modeOfPayment}</Text>
              <Text>Mode of Delivery: {order.modeOfDelivery}</Text>
              {order.modeOfDelivery == "delivery" ? (<Text>Delivery Address: {order?.deliveryAddress}</Text>): null}
              {order.status == "Completed" ? (<Text>Accomplished: {formatDate(order?.accomplishedAt, "llll")}</Text>):null}
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    )
}
export default OrderDetailsDialog;