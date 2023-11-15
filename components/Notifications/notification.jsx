import {useState} from "react";
import {View, Image, Text, StyleSheet} from "react-native";
import {Card, Avatar, IconButton} from "react-native-paper";

import DefaultProfile from "../../assets/images/default_profile.jpg";
import {timePassed} from "../../util/dateUtils";

export default function Notification ({notif, deleteNotif}){
  return(
    <View style={styles.container}>

      <IconButton
        icon="close"
        style={styles.closeIcon}
        size={20}
        onPress={() =>{
          deleteNotif({variables:{notificationId:notif._id}});
        }}
      />
      
      <View style={{flex:1, padding:"auto"}}>
        <Avatar.Image size={70} source={
          notif?.profile_pic ? {uri:notif.profile_pic}: DefaultProfile
          } />
      </View>

      <View style={{flex:3}}>
        <Text style={styles.username}>
          {notif?.from ?? "username"}
        </Text>
        <Text style={styles.paragraph}>
          {notif?.message ?? "no message"}
        </Text>
        <Text style={styles.notifTimeStamp}>
          {timePassed(notif?.createdAt)}
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexDirection:"row",
  },
  username:{
    fontWeight:"bold",
  },
  notifTimeStamp:{
    fontSize:11
  },
  paragraph: {
    marginBottom:5,
    fontSize: 14,
  },
  closeIcon:{
    position:"absolute",
    top:0,
    right:0
  }
});