//@ts-nocheck
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Text, Divider, Button, ActivityIndicator } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useQuery } from '@apollo/client';

import { GET_CONNECTION_REQUESTS } from '../../graphql/operations/myNetwork';
import { formatShortAddress } from '../../util/addresssUtils';
import DefaultProfile from "../../assets/images/default_profile.jpg";

type AcceptedRequests = {
  [key: number]: boolean;
};

const ConnectionRequests = ({acceptConnection, declineConnection}) => {

  const {data, loading, error} = useQuery(GET_CONNECTION_REQUESTS);

  if(loading){
    return(
      <>
        <Text style={styles.headerText}>Connection Requests</Text>
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <ActivityIndicator size={"large"}/>
        </View>
      </>
    );
  } else if(error){
    return(
      <>
        <Text style={styles.headerText}>Connection Requests</Text>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>Error Loading Connection Requests</Text>
        </View>
      </>
    )
  }

  if(data?.getConnectionRequests?.length == 0){
    return(
      <>
        <Text style={styles.headerText}>Connection Requests</Text>
        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
          <Text>No Connection Requests</Text>
        </View>
      </>
    )
  }

  return (
    <View>
      <Text style={styles.headerText}>Connection Requests</Text>
      <Card style={styles.card}>
        <ScrollView>
          {data && data?.getConnectionRequests.length > 0 ? (
            data?.getConnectionRequests?.map((request:any, index:number) => (
              <React.Fragment key={request.requesterId}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={
                        request?.profile_pic ? {uri:request?.profile_pic}: DefaultProfile
                      }
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>
                      {request.requesterName}
                    </Text>
                    <Text style={styles.userLocation} numberOfLines={1} ellipsizeMode='tail'>
                      {formatShortAddress(request.address)}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                  <Button
                    mode="outlined"
                    color="#FE8C47"
                    onPress={() => {
                      acceptConnection({variables:{"requester":request.requesterId}});
                    }}
                    style={styles.acceptButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Accept
                  </Button>
                    {/* {acceptedRequests[request.id] ? (
                      <View style={styles.iconWrapper}>
                        <Ionicons name="checkmark-done" size={24} color="#FE8C47" />
                      </View>
                    ) : (
                      <Button
                        mode="outlined"
                        color="#FE8C47"
                        onPress={() => handleAccept(request.id)}
                        style={styles.acceptButton}
                        labelStyle={styles.buttonLabel}
                      >
                        Accept
                      </Button>
                    )} */}
                    <TouchableOpacity onPress={() => {declineConnection({variables:{"requester":request.requesterId}})}}>
                      <Ionicons name="close-circle" size={24} color="#2E603A" />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
                {index < data?.getConnectionRequests?.length - 1 ? <Divider />:null}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.centeredMessage}>
              <Text>No Connection Requests yet</Text>
            </View>
          )}
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 20,
    color: '#404140',
  },
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    backgroundColor: '#FDFDFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginTop: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E603A',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  details: {
    justifyContent: 'center',
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#404140',
    maxWidth: '88%',
  },
  userLocation: {
    fontSize: 12,
    color: 'gray',
    maxWidth: '88%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    borderColor: '#FE8C47',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonLabel: {
    color: '#FE8C47',
    fontSize: 9,
  },
  iconWrapper: {
    marginRight: 30,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ConnectionRequests;
