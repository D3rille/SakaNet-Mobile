import { View, StyleSheet, TouchableOpacity } from 'react-native'
import {Button, Text, Card} from "react-native-paper";
import React, {useState} from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 

import {sakanetGreen, sakanetOrange} from "../../constants/Colors";
import { formatToCurrency } from '../../util/currencyFormatter';
import OrderDetailsDialog from "./OrderDetailsDialog";
import DeclineOrderDialog from "./declineOrderDialog";
import CustomDialog from "../popups/customDialog";

const OrderItem = ({
    status, 
    order, 
    role,
    handleUpdateStatus,
    handleDeclineOrder,
    handleCancelOrder,
    handleReturnStock,

}) => {
    const [openDialog, setOpenDialog] = useState("");
    const [reason, setReason] = useState("");
    return (
        <>
        {openDialog == "details" ? (<OrderDetailsDialog visible={Boolean(openDialog)} setVisibility={setOpenDialog} order={order} />):null}
        {openDialog == "declineOrder" ? (
            <DeclineOrderDialog
                title={"Decline Order"}
                message={"Please state a reason for declining the order"}
                setVisible={setOpenDialog}
                visible={Boolean(openDialog)}
                callback={()=>{handleDeclineOrder(order._id, reason);}}
                reason={reason}
                setReason={setReason}
            />
        ):null}
        {openDialog == "acceptOrder" ? (
            <CustomDialog
                title={"Accept Order"}
                message={"Are you sure you want to accept this order?"}
                setVisible={setOpenDialog}
                visible={Boolean(openDialog)}
                callback={()=>handleUpdateStatus(order._id, "Pending", "Accepted", null, false)}
                
            />
        ):null}

        {openDialog == "markComplete" ? (
            <CustomDialog
                visible={Boolean(openDialog)}
                setVisible={setOpenDialog}
                title={"Complete Order"}
                message={"Mark this order as complete?"}
                btnDisplay={0}
                callback={() => {
                    handleUpdateStatus(order._id, "Accepted", "For Completion", order?.buyer?.id, order?.modeOfPayment );
                }}
          />
        ):null}

        {openDialog == "returnToStock" ? (
            <CustomDialog
                visible={Boolean(openDialog)}
                setVisible={setOpenDialog}
                title={"Return stock?"}
                message={
                    `Are you sure you want to return stock? This will delete the record of the order on both buyer and seller side.` +
                    `Returning a stock will restock your product offering, regardlesswhether the product is closed or open except` +
                    `if the product was already deleted. Proceed?
                `}
                btnDisplay={0}
                callback={()=>{
                    handleReturnStock(order?._id, order?.productId);
                }}
          />
        ):null}
        {openDialog == "cancelOrder" ? (
            <CustomDialog
                visible={Boolean(openDialog)}
                setVisible={setOpenDialog}
                title={"Cancel Order"}
                message={"Are you sure you want to cancel order?"}
                btnDisplay={0}
                callback={()=>{
                    handleCancelOrder(order._id);
                }}
          />
        ):null}
        {openDialog == "receivedOrder" ? (
            <CustomDialog
                visible={Boolean(openDialog)}
                setVisible={setOpenDialog}
                title={"Receive Order"}
                message={"By clicking YES, you are acknowledging that you have received the order, Proceed?"}
                btnDisplay={0}
                callback={()=>{
                    handleUpdateStatus(order._id, "For Completion", "Completed", null, false)
                }}
          />
        ):null}

        <Card style={{backgroundColor:"white", marginVertical:10}}>
            <Card.Content>
                <View style={{flexDirection:"row"}}>
                    <View >
                        <Text style={{
                            backgroundColor:order?.type == "Order" ? sakanetGreen : sakanetOrange,
                            color:"white",
                            paddingHorizontal:8,
                            paddingVertical:2,
                            textAlign:"center",
                            borderRadius:8
                        }}>
                            {order?.type}
                        </Text>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', flexDirection:"row", justifyContent:"flex-end"}}>
                        <Text style={{paddingHorizontal:8, paddingVertical:2}}>
                            {status == "Accepted" && role == "BUYER" ? "Preparing Order" : status}
                        </Text>
                        <TouchableOpacity
                            onPress={()=>setOpenDialog("details")}
                        >
                            <MaterialIcons name="more-vert" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:"row",  paddingVertical:15, paddingHorizontal:30 }}>
                    <View style={{flex:1}}>
                        <Text>{order?.marketProductName ?? "???"}</Text>
                        <Text>{formatToCurrency(order?.price ?? 0)}/{order?.unit}</Text>
                        <Text>{role == "BUYER" ? "Seller: ":"Buyer: "}{role == "BUYER" ? order?.seller?.name : order?.buyer?.name}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text>Quantity:{order?.quantity ?? 0}</Text>
                        <Text>Total Price: {formatToCurrency(order?.totalPrice)}</Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Actions>
                {/* Pending - Farmer side*/}
                {status == "Pending" && role == "FARMER" ? (<>
                    <Button mode="contained" buttonColor="green" onPress={()=>{
                        setOpenDialog("acceptOrder");
                    }}>Accept</Button>
                    <Button mode= "contained" buttonColor='red'
                        onPress={()=>setOpenDialog("declineOrder")}
                    >Decline</Button>
                </>):null}
                {/* Pending - Buyer side */}
                {status == "Pending" && role == "BUYER" ? (<>
                    <Button mode= "contained" buttonColor='red' onPress={()=>setOpenDialog("cancelOrder")}>Cancel</Button>
                </>):null}
                {/* Accepted - Farmer side */}
                {status == "Accepted" && role == "FARMER" ? (<>
                    <Button mode="contained" buttonColor="green" onPress={()=> setOpenDialog("markComplete")}>Complete</Button>
                </>):null}
                {/* For Completion - Farmer side */}
                {status == "For Completion" && role == "FARMER" ? (<>
                    <Button mode="contained" buttonColor="green" onPress={()=>setOpenDialog("returnToStock")}>Return to Stock ?</Button>
                </>):null}
                {/* For Completion - Buyer side */}
                {status == "For Completion" && role == "BUYER" ? (<>
                    <Button mode="contained" buttonColor="green" onPress={()=>setOpenDialog("receivedOrder")}>Received Order</Button>
                </>):null}
            </Card.Actions>
        </Card>
        
        </>
        
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