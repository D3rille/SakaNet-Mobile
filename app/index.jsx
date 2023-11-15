import {useContext, useEffect, useState} from "react";
import { ActivityIndicator, StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { AuthContext, useAuth } from "../context/auth";
import { useRootNavigationState, Redirect, Stack } from 'expo-router';
import React from 'react'

// import OrdersScreen from "../components/Orders/ordersScreen";

export default function Index(){
    const {user, isLoaded} = useAuth();
    const rootNavigationState = useRootNavigationState();
    <Stack.Screen options={{headerShown:false}}/>
    if (!rootNavigationState?.key) return null;

    if(isLoaded && user){
        return(<Redirect href="/Products/"/>);
    } else if(isLoaded && !user){
        return(<Redirect href="/login"/>);
    }

    return(<ActivityIndicator/>);
    // return (<OrdersScreen/>);

    
}

// const styles = StyleSheet.create({})