import { View, StyleSheet, TouchableOpacity } from 'react-native'
import {Button, Text, Card} from "react-native-paper";
import React from 'react'
import {sakanetGreen, sakanetOrange} from "../../constants/Colors";

const OrderItem = ({status}) => {
  return (
    <Card style={{backgroundColor:"white", marginVertical:10}}>
        <Card.Content>
            <View style={{flexDirection:"row"}}>
                <View >
                    <Text style={{
                        backgroundColor:sakanetGreen,
                        color:"white",
                        paddingHorizontal:8,
                        paddingVertical:2,
                        textAlign:"center",
                        borderRadius:8
                    }}>
                        {"Order"}
                    </Text>
                </View>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <Text style={{paddingHorizontal:8, paddingVertical:2}}>{status}</Text>
                </View>
            </View>
            <View style={{flexDirection:"row",  padding:30 }}>
                <View style={{flex:1}}>
                    <Text>Product</Text>
                    <Text>Price/unit</Text>
                    <Text>{"Seller  "}User</Text>
                </View>
                <View style={{flex:1}}>
                    <Text>Quantity:{5}</Text>
                    <Text>Total Price: {102}</Text>
                </View>
            </View>
        </Card.Content>
        <Card.Actions>
            {/* <Text>Pending...</Text> */}
            <Button mode="contained" buttonColor="green" style={{}}>Accept</Button>
            <Button mode= "contained" buttonColor='red'>Decline</Button>
        </Card.Actions>
    </Card>
  )
}


const styles = StyleSheet.create({
    container:{
        // flex:1, 
        paddingHorizontal:30,
        paddingVertical:20,
    },
    productName:{
        fontWeight:"bold",
        fontSize:16
    },
    

});
export default OrderItem