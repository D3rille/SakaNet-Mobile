import {useContext, useEffect, useState} from "react";
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { ActivityIndicator } from "react-native-paper";
import { AuthContext, useAuth } from "../context/auth";
import { useRootNavigationState, Redirect, Stack, router } from 'expo-router';
import React from 'react'

// import OrdersScreen from "../components/Orders/ordersScreen";

export default function Index(){
    const {user, isLoaded} = useAuth();
    const rootNavigationState = useRootNavigationState();
    
    useEffect(()=>{
        if(isLoaded && user?.role == "FARMER"){
            router.replace("/MyProducts");
        } else if (isLoaded && user?.role == "BUYER"){
            router.replace("/Products");
        } else if (isLoaded && !user){
            router.replace("/login");
        }

    },[user, isLoaded]);
    
    if (!rootNavigationState?.key) return null;
    

    // if(isLoaded && user){
    //     if(user.role == "FARMER"){
    //         return(<Redirect href="/MyProducts/"/>)
    //     } else if(user.role == "BUYER"){
    //         return(<Redirect href="/Products/"/>);
    //     }
    // } else if(isLoaded && !user){
    //     return(<Redirect href="/login"/>);
    // }

    return(
        <View
            style={{flex:1, justifyContent:"center", alignItems:"center"}}
        >
            <ActivityIndicator size = "large"/>
        </View>
    );
    // return (<OrdersScreen/>);

    
}

// const styles = StyleSheet.create({})


// export default function Index(){
//     const {user, isLoaded} = useAuth();
//     const rootNavigationState = useRootNavigationState();
//     <Stack.Screen options={{headerShown:false}}/>
//     if (!rootNavigationState?.key) return null;

//     if(isLoaded && user){
//         if(user.role == "FARMER"){
//             return(<Redirect href="/MyProducts/"/>)
//         } else if(user.role == "BUYER"){
//             return(<Redirect href="/Products/"/>);
//         }
//     } else if(isLoaded && !user){
//         return(<Redirect href="/login"/>);
//     }

//     return(<ActivityIndicator/>);
//     // return (<OrdersScreen/>);

    
// }