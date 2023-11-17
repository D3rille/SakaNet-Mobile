//@ts-nocheck
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';

import DefaultProfile from "../../assets/images/default_profile.jpg";
import { JOIN_POOL_GROUP, GET_SUGGESTED_GROUPS } from '../../graphql/operations/poolGroup';

const SuggestedGroups = ({suggestedGroupsResults}) => {
  const [joinPoolGroup] = useMutation(JOIN_POOL_GROUP);
  const handleJoinPoolGroup = (poolGroupId) =>{
    joinPoolGroup({
        variables:{
            poolGroupId
        },
        refetchQueries:[GET_SUGGESTED_GROUPS], 
        onCompleted:()=>{
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Success',
            text2: "Membership application sent.",
          });
        },
        onError:(error)=>{
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Success',
            text2: "Membership application sent.",
          });
        }
    })
}

  const {data, error, loading} = suggestedGroupsResults;

  if(loading){
    return(
      <>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
          <View>
            <Text style={styles.headerText}>Suggested Groups</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{suggestedGroupsResults.refetch();}}
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
            <Text style={styles.headerText}>Suggested Groups</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{suggestedGroupsResults.refetch();}}
            >
              <FontAwesome name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>Error Loading Suggested Groups</Text>
        </View>
      </>
    )
  }

  if(!data && data?.getSuggestedGroups?.length==0){
    return(
      <>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
          <View>
            <Text style={styles.headerText}>Suggested Groups</Text>
          </View>
          <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
            <TouchableOpacity
              onPress={()=>{suggestedGroupsResults.refetch();}}
            >
              <FontAwesome name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>No Suggested Groups</Text>
        </View>
      </>
    )
  }


  return (
    <View style={styles.container}>
      <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:20, marginBottom:10}}>
        <View>
          <Text style={styles.headerText}>Suggested Groups</Text>
        </View>
        <View style={{ alignItems:"flex-start", paddingHorizontal:10}}>
          <TouchableOpacity
            onPress={()=>{}}
          >
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {data && data?.getSuggestedGroups?.length > 0 ? (
        <ScrollView style={styles.scrollView} horizontal={true}>
          {data?.getSuggestedGroups.map(group => (
            <Card key={group.id} style={styles.card}>
              <Image source={{ uri: group?.cover_photo ?? "" }} style={styles.headerImage} />
              <View style={styles.avatarContainer}>
                <Avatar.Image size={64} source={
                   group?.profile_pic ? {uri:group?.profile_pic}: DefaultProfile
                  } style={styles.avatar} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>{group.groupName}</Text>
              </View>
              <Button
                mode="outlined"
                style={[styles.joinButton]}
                labelStyle={styles.joinButtonText}
                onPress={() =>{
                  handleJoinPoolGroup(group._id);
                }}
              >
                Join
              </Button>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noSuggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggested groups yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15, 
    marginLeft: 20,
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
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 10,
  },
  headerImage: {
    height: 70, 
    width: '100%',
    backgroundColor: '#FE8C47',
    borderRadius:20
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
    marginTop:35
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  joinButton: {
    borderWidth: 1,
    borderColor: '#FE8C47',
    borderRadius: 20,
    marginHorizontal: 25,
    marginBottom: 10,
    marginTop: 10
  },
  joinButtonText: {
    color: '#FE8C47',
    fontSize:12
  },
  joinedButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
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

export default SuggestedGroups;
