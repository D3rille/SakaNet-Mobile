import {useState} from "react";
import { Text, View, StyleSheet, Image, SafeAreaView, ScrollView, Button, ActivityIndicator} from 'react-native';
import { Divider  } from 'react-native-paper';

import OrderItem from "./orderItem";
import HeadTabs from "./headTabs";


export default function OrdersScreen({status, handleChangeStatus}){
  //Pending, Accepted, For Completion, Completed
  const [orderStatus, setOrderStatus] = useState("Pending");

  return (
        <View style={styles.container}>
          <HeadTabs handleChangeStatus={handleChangeStatus}/>
          <ScrollView>
           <OrderItem status={status}/>
          </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
   container: { 
    flex:1,
    // alignItems:"center",
    // justifyContent:"center",
  },
  tabs:{
    height:100, 
    width:100
  }
  
});
