import {useContext, useEffect, useState} from "react";
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext, useAuth } from "../context/auth";
import { useRootNavigationState, Redirect, Stack } from 'expo-router';
import React from 'react'



const index = () => {
    const {user} = useAuth();
    // const [userInfo, setUserInfo] = useState(null);
    const rootNavigationState = useRootNavigationState();

    // useEffect(()=>{
    //     if(user){
    //         setUserInfo(user);
    //     }
    // },[user]);

    if (!rootNavigationState?.key) return null;

    if(user){
        return (
            <>
                <Stack.Screen options={{ headerShown: false }}/>
                <Redirect href={'/Products'} />
            </>
        )

    } else{
        return (
            <>
                <Stack.Screen options={{ headerShown: false }}/>
                <Redirect href={'/login'} />
            </>
        )
    }
}
export default index

const styles = StyleSheet.create({})