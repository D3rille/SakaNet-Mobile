//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { useLazyQuery, useQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';

import { COLORS } from '../../../constants/index';
import NewMessageModal from '../../../components/Messages/NewMessageModal'; 
import ChatsListHeader from '../../../components/Messages/ChatsListHeader';
import ChatItems from '../../../components/Messages/ChatItems';
import { BottomSheetMethods } from '../../../components/Messages/BottomSheetScrollView'; 
import {
    FIND_USER_TO_CHAT, 
    GET_CONVERSATIONS, 
    GET_UNREAD_CONVO, 
    UPDATE_CONVOS
} from "../../../graphql/operations/chat";
import { useAuth } from '../../../context/auth';
import FindUserToChatResult from '../../../components/Messages/FindUserToChatResult';


const Messages = () => {
  const {user} = useAuth();
  const [numPage, setNumPage] = useState(1);
  const newMessageModalRef = useRef<BottomSheetMethods>(null);
  const [searchFocus, setSearchFocus] = useState(false);

  const handleAddPress = () => {
      newMessageModalRef.current?.expand();
  };

  const {
      data:getConvosData, 
      loading:getConvosLoading, 
      subscribeToMore:subscribeToMoreConvos, 
      refetch:refetchConvos,
      fetchMore:getMoreConversations
    } = useQuery(GET_CONVERSATIONS,{
      variables:{
        limit:10,
        page:1
      },
      onError:(error)=>{
        Toast.show({
          type:"error",
          text1:"Cannot get Conversations."
        })
      }
    });

    useEffect(()=>{
      refetchConvos();
    },[])
  
    const handleGetMoreConversations = () =>{
      if(getConvosData?.getConversations?.hasNextPage){
        getMoreConversations({
          variables:{
            limit:10,
            page: numPage + 1
          },
          onCompleted:()=>{
            setNumPage(numPage + 1);
          },
          onError:(error)=>{
            Toast.show({
              type:"error",
              text1:"Something went wrong",
              text2: error?.message
            })
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              getConversations: {
                ...prev.getConversations,
                hasNextPage: fetchMoreResult?.getConversations?.hasNextPage,
                conversations:[...prev?.getConversations?.conversations, ...fetchMoreResult?.getConversations?.conversations],
              }
            });
            
          },
        })
      }
    }

    const [findUser, {data:findUserData, loading:findUserLoading}] = useLazyQuery(FIND_USER_TO_CHAT);

    useEffect(()=>{
      subscribeToMoreConvos({
        document:UPDATE_CONVOS,
        variables:{receiverId:user?.id ?? ""},
        updateQuery:(prev, {subscriptionData})=>{
          if(!subscriptionData.data) return prev;
          refetchConvos({
            variables:{
              limit:10,
              page:1
            },
            onCompleted:()=>{
              setNumPage(2);
            }
          });
        }
      });
    }, []);

    // console.log(findUserData)
    return (
        <View style={styles.container}> 
            <ChatsListHeader findUser={findUser} setSearchFocus={setSearchFocus}/>
            <View style={styles.cardContainer}>
                {getConvosLoading && (
                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <ActivityIndicator size="large"/>
                    </View>
                )}
                {getConvosData && !searchFocus && (
                    <ChatItems data={getConvosData?.getConversations?.conversations} handleGetMoreConversations={handleGetMoreConversations}/>
                )}

                {findUserData && searchFocus &&(
                    <FindUserToChatResult data={findUserData?.findUserToChat}/>
                )}
            </View>

            <FAB
                icon="plus"
                style={styles.fab}
                color="white"
                onPress={handleAddPress}
            />

            <NewMessageModal ref={newMessageModalRef} />
        </View>
    );
}
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        position: 'absolute',
        bottom: 0, 
        height: screenHeight * 0.83,
        backgroundColor: '#fff',
        // borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        width: '100%',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:COLORS.orange
      },
});

export default Messages;