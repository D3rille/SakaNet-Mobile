import { View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Notification from "../../../components/Notifications/notification";
import {Button, Text, Divider, FAB} from "react-native-paper";
import { useMutation } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';

import { useSubs } from '../../../context/subscriptionProvider';
import { GET_NOTIFICATIONS, DELETE_NOTIFICATION, CLEAR_NOTIFICATIONS} from "../../../graphql/operations/notification";
import { sakanetGreen } from '../../../constants/Colors';

const Notifications = () => {
  // return(
  //   <View>
  //     <Text>Notifications</Text>
  //   </View>
  // )
  const { notifData } = useSubs();

  const [deleteNotif]= useMutation(DELETE_NOTIFICATION, {
    refetchQueries:[GET_NOTIFICATIONS]
  });

  const [clearNotifs] = useMutation(CLEAR_NOTIFICATIONS, {
    refetchQueries:[GET_NOTIFICATIONS]
  });


  if (!notifData?.getNotifications || notifData?.getNotifications == []) {
      return (
        <SafeAreaView style={styles.container}>
          <Text>No Notifications</Text>
        </SafeAreaView>
      );
  }
  

  return (
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <View style={{flex:1}}>
            <Text variant='headlineSmall' style={{padding:10}}>Notifications</Text>
          </View>
          <View style={{flex:1, justifyContent:"flex-end", alignItems:"flex-end"}}>
            <TouchableOpacity
            style={{padding:10, flexDirection:"row", alignItems:"center"}}
            >
              <MaterialIcons name="delete" size={24} color="red" />
              <Text style={{padding:5, color:"red"}}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Divider/>
        {(!notifData.getNotifications || notifData.getNotifications == []) ? (<Text style={{flex:1}}>No Notifications</Text>):null}
        <FlatList
            style={{paddingBottom:30, paddingTop:10}}
            data={notifData?.getNotifications}
            renderItem={({item}) => <Notification notif={item} deleteNotif={deleteNotif}/>}
            keyExtractor={item => item._id}
        />
        {/* <FAB
          icon="delete"
          label='Clear All'
          style={styles.fab}
          color='white'
          onPress={() => clearNotifs()}
        /> */}
      </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    clearButton:{
      flex:1,
      position:"fixed",
      bottom:0
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor:sakanetGreen
    },
})
export default Notifications;