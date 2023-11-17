import {useContext, useEffect, useState} from "react";
import { ActivityIndicator, StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { AuthContext, useAuth } from "../context/auth";
import { useRootNavigationState, Redirect, Stack, router } from 'expo-router';
import React from 'react'

// import OrdersScreen from "../components/Orders/ordersScreen";

export default function Index(){
    const {user, isLoaded} = useAuth();
    const rootNavigationState = useRootNavigationState();
    <Stack.Screen options={{headerShown:false}}/>
    if (!rootNavigationState?.key) return null;

    if(isLoaded && user){
        if(user.role == "FARMER"){
            return(<Redirect href="/MyProducts/"/>)
        } else if(user.role == "BUYER"){
            return(<Redirect href="/Products/"/>);
        }
    } else if(isLoaded && !user){
        return(<Redirect href="/login"/>);
    }

    return(<ActivityIndicator/>);
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