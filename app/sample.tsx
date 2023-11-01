//@ts-nocheck
import {useContext, useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button } from 'react-native';
import {useQuery} from "@apollo/client";

import EditScreenInfo from '../components/EditScreenInfo';
import {TextInput} from "react-native";
import { Text, View } from '../components/Themed';
import {useState} from "react";
import {HELLO} from "../graphql/operations/auth";
// import client from '../graphql/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { AuthContext } from "../context/auth";
import { useRouter, Link, router } from "expo-router";

// export default function Sample(){
//   const router = useRouter();
//   const {user} = useContext(AuthContext);
//   if(!user){
//     router.push("/login");
//   } 
//   return(
//     <SampleScreen/>
//   );
  
// }

export default function SampleScreen() {
    // const router = useRouter();
    const {user, logout} = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [cred, setCred] = useState("");
    const [password, setpassword] = useState("");
    
    useEffect(()=>{
      if(user){
        setUserInfo(user);
      }
    },[user])

    const {data, loading, error} = useQuery(HELLO); 

    console.log(`user: ${userInfo?.id}`);

    if(loading){
      return(
        <View style={styles.container}>
          <Text style={styles.title}>Loading</Text>
        </View>
      )
    }

    if(error){
      console.log(error)
      return(
        <View style={styles.container}>
          <Text style={styles.title}>error</Text>
        </View>
      )
    }

    console.log(loading)
    console.log(data)

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Sample</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <Text>This is the Sample page.</Text>
          <Button title="Logout" onPress={()=>{
            router.push("/Products")
          }}/>
          <Text>{data?.hello}</Text>
          <View>
    
            <TextInput
            value={cred}
            onChangeText={setCred}
            placeholder='credentials'
            />
    
            <TextInput
            value={password}
            onChangeText={setpassword}
            placeholder='password'
            />
            
    
          </View>
    
    
          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
    if(data){
      
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
