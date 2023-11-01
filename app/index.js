import {useContext} from "react";
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext } from "../context/authorization";
import { useRootNavigationState, Redirect, Stack } from 'expo-router';
import React from 'react'



const index = () => {
    const rootNavigationState = useRootNavigationState();

    if (!rootNavigationState?.key) return null;
    
    return (
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <Redirect href={'/Products'} />
        </>
    )
}
export default index

const styles = StyleSheet.create({})