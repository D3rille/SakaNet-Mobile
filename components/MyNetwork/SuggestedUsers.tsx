//@ts-nocheck
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Card, Button, Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import DefaultProfile from "../../assets/images/default_profile.jpg";
import DefaultCover from "../../assets/images/default_cover.png";
import { formatShortAddress } from '../../util/addresssUtils';

const Suggestions = ({requestConnection, suggestedUsersResults}) => {
  const [connectedUsers, setConnectedUsers] = useState<{ [key: string]: boolean }>({});

  const {data, error, loading} = suggestedUsersResults;

  if(loading){
    return(
      <>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
          <View>
            <Text style={styles.headerText}>Suggested Users</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{
                suggestedUsersResults.refetch();
              }}
            >
              <FontAwesome name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <ActivityIndicator size="large"/>
        </View>
      </>
    );
  } else if(error){
    return(
      <>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
          <View>
            <Text style={styles.headerText}>Suggested Users</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{
                suggestedUsersResults.refetch();
              }}
            >
              <FontAwesome name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>Error Loading Suggested Users</Text>
        </View>
      </>
    )
  }

  if(data?.getSuggestedUsers?.length==0){
    return(
      <>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
          <View>
            <Text style={styles.headerText}>Suggested Users</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{
                suggestedUsersResults.refetch();
              }}
            >
              <FontAwesome name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>No Suggested Users</Text>
        </View>
      </>
    )
  }


  return (
    <View style={styles.container}>
      <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
        <View>
          <Text style={styles.headerText}>Suggested Users</Text>
        </View>
        <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
          <TouchableOpacity
            onPress={()=>{
              suggestedUsersResults.refetch();
            }}
          >
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </View>

      </View>
      {data && data?.getSuggestedUsers?.length > 0 ? (
        <ScrollView style={styles.scrollView} horizontal={true}>
          {data?.getSuggestedUsers.map((user:any, index:number) => (
            <Card key={user._id} style={styles.card}>
              <Image source={
                user?.cover_photo ? {uri:user?.cover_photo}: DefaultCover
                } style={styles.headerImage} />
              <View style={styles.avatarContainer}>
                <Avatar.Image size={64} source={
                  user?.profile_pic ? {uri:user?.profile_pic}: DefaultProfile
                } style={styles.avatar} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>{user.username}</Text>
                <Text style={styles.userLocation} numberOfLines={1} ellipsizeMode='tail'>{formatShortAddress(user?.address)}</Text>
              </View>
              <Button
                mode="outlined"
                style={[styles.connectButton]}
                labelStyle={styles.connectButtonText}
                onPress={() => {requestConnection({variables:{"connectTo":user._id}})}}
                // disabled={connectedUsers[user.id]}
              >
                {connectedUsers[user.id] ? 'Request Sent' : 'Connect'}
              </Button>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noSuggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggested users yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20,
    // marginTop: 20,
    color: '#404140'
  },
  scrollView: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  card: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#FDFDFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginBottom: 10,
  },
  headerImage: {
    height: 70,
    width: '100%',
    backgroundColor: '#FE8C47',
    borderRadius: 20
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#2E603A',
    padding: 5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 35
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  userLocation: {
    fontSize: 11,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  connectButton: {
    borderWidth: 1,
    borderColor: '#FE8C47',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center',
  },
  connectedButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  connectButtonText: {
    color: '#FE8C47',
    fontSize: 12
  },
  noSuggestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: '#404140'
  },
});

export default Suggestions;
