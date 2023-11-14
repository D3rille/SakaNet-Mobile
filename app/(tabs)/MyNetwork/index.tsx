import {useState} from "react";
import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';
import {router} from "expo-router";

import CustomDialog from "../../"

const MyNetwork = () => {
    const {logout} = useAuth();
    const [visible, setVisible] = useState("");
    return (
        <View>
            <Text>My Network</Text>
            <Button title="Logout" onPress={()=>{
                logout();
                router.replace("/login/");
            }}/>
            <Button title="Show dialog" onPress={()=>{
                logout();
                router.replace("/login/");
            }}/>
        </View>
    );
}

export default MyNetwork;