//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Avatar, Text as Txt } from 'react-native-paper';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Bubble, GiftedChat, Send, InputToolbar, IMessage } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, router } from 'expo-router';
import {useQuery, useMutation} from "@apollo/client";
import Toast from 'react-native-toast-message';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

import { GET_MESSAGES, SEND_MESSAGE, NEW_MESSAGE, GET_CONVERSATIONS, READ_CONVO, GET_UNREAD_CONVO } from '../../../graphql/operations/chat';
import { COLORS } from '../../../constants/index';
import { useNavigation } from '@react-navigation/native';
import { useSubs } from '../../../context/subscriptionProvider';
import DefaultProfile from  "../../../assets/images/default_profile.jpg";

const screenHeight = Dimensions.get('window').height;

function ChatConversationHeader({
  avatar,
  name,
  onBackPress,
}: {
  avatar:string,
  name: string;
  onBackPress: () => void;
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back-outline" size={24} color="gray" />
      </TouchableOpacity>
      <Avatar.Image size={35} source={
        avatar ? {uri:avatar} : DefaultProfile
      } />
      <TouchableOpacity onPress={() => { console.log("Name pressed"); }} style={styles.titleTouchable}>
        <Text style={styles.title}>{name}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log("Kebab icon pressed")}
        style={styles.kebabButton}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

function processMessages(chatArr:any){
  const newChatArr = chatArr?.map((chat:any)=>{
    return{
      _id:chat?._id,
      text:chat?.message ?? "",
      user:{
        _id:chat.sender,
        name:chat.username,
        avatar:chat.profile_pic
      },
      createdAt:new Date(chat.createdAt),
      system: !Boolean(chat.sender),
      conversationId:chat.conversationId

    }
  });

  return newChatArr;
}

const ChatConversation = () => {
  const {profile} = useSubs();
  const {convoId, userId} = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const navigation = useNavigation(); // Use the useNavigation hook
  const [loaded, setLoaded] = useState(false);
 
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const {
    data:getMessagesData, 
    loading:getMessagesLoading, 
    error:getMessagesError, 
    fetchMore:fetchMoreMessages,
    subscribeToMore:subscribeToNewMessage} = useQuery(GET_MESSAGES, {
    onCompleted:(data)=>{
      if(!loaded){let new_messages = processMessages(data?.getMessages?.messages)?.reverse();
      setMessages(new_messages);
      setLoaded(true);}
    },
    variables:{
        conversationId:convoId ?? "",
        limit:10,
        cursor:null
    },
    // onError:(error)=>{
    //     toast.error(error.message);
    // }
  });

  const getMoreMessages = () =>{
    if(getMessagesData?.getMessages?.hasNextPage){
        fetchMoreMessages({
            variables:{
                conversationId:convoId ?? "",
                limit:10,
                cursor: getMessagesData?.getMessages?.endCursor
            },
            onError:(error)=>{
                Toast.show({
                  type:"error",
                  text1:"Something went wrong",
                  text2:error?.message ?? ""
                })
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  getMessages: {
                    ...prev.getMessages,
                    endCursor:fetchMoreResult?.getMessages?.endCursor,
                    hasNextPage: fetchMoreResult?.getMessages?.hasNextPage,
                    messages:[...fetchMoreResult?.getMessages?.messages, ...prev?.getMessages?.messages],
                  }
                });
                
            },
        });
    }
  }

  // useEffect(()=>{
  //   handleReadConvo();
  // },[convoId])
  
  useEffect(() => {
    const unsubscribe = subscribeToNewMessage({
      document: NEW_MESSAGE,
      variables: { conversationId: convoId ?? "" },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;
        
        // Check if prev.getMessages is undefined and initialize it
        if (!prev?.getMessages) {
          return {
            getMessages: {
              messages: [newMessage]
            }
          };
        }
        let arrivedMessage = {
          _id:newMessage?._id,
          text:newMessage?.message ?? "",
          user:{
            _id:newMessage.sender,
            name:newMessage.username,
            avatar:newMessage.profile_pic
          },
          createdAt:new Date(newMessage.createdAt),
          system: !Boolean(newMessage.sender),
          conversationId:newMessage.conversationId
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, arrivedMessage));
  
        
        // return {
        //   getMessages: {
        //     ...prev?.getMessages,
        //     messages: [...(prev?.getMessages?.messages || []), newMessage]
        //   }
        // };
      }
    });
  
    return () => {
      // Cleanup: Unsubscribe from the subscription when the component unmounts
      unsubscribe();
    };
  }, [convoId]);

  useEffect(() => { 
    if(getMessagesData?.getMessages && !getMessagesLoading){
      let messages = getMessagesData?.getMessages?.messages;
      setMessages(messages ? processMessages(messages)?.reverse(): []);
    }
  }, [getMessagesData, getMessagesLoading]);
  

  // const onSend = useCallback((messages: IMessage[] = []) => {
  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  // }, []);
  
  const handleSendMessage = ( conversationId, message) =>  {
    try {
      sendMessage({
          variables:{conversationId, message},
          refetchQueries:[{
              query:GET_MESSAGES,
              variables:{conversationId}
          }],
          onError:(error)=>{
              Toast.show({
                type:"error",
                text1:"Cannot send message",
                text2: error?.message ?? ""
              })
          }
      });
      
    } catch (error) {
      console.log(error)
    }
  }

  const renderSend = (props: React.ComponentProps<typeof Send>) => {
    return (
      <Send {...props}>
        <View>
          <FontAwesome5 
            name='paper-plane'
            style={{ marginBottom: 5, marginRight: 5 }}
            size={28}
            color={COLORS.green}
            solid
          />
        </View>
      </Send>
    );
  };


  const renderBubble = (props: React.ComponentProps<typeof Bubble>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.green,
            marginBottom: 10,
            padding:3
          },
          left: {
            backgroundColor: COLORS.pageBg,
            marginBottom: 10,
            padding:3
          }
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name='angle-double-down' size={22} color='#333' />;
  };

  const renderInputToolbar = (props:any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          marginLeft: 10,
          marginRight: 10, 
          // marginBottom: 5, 
          borderRadius: 25,
          backgroundColor: COLORS.pageBg,
        }}
      />
    );
  };

  const onBackPress = () => {
    router.back();
  };


  return (
    <>
    <ChatConversationHeader
      avatar = {getMessagesData?.getMessages?.recipientPic}
      name={getMessagesData?.getMessages?.recipientUsername ? getMessagesData?.getMessages?.recipientUsername : "User"} 
      onBackPress={onBackPress} 
    />
    <View style={styles.chatContainer}>
    {messages ? (<GiftedChat
        text={messageInput}
        onInputTextChanged={setMessageInput}
        messages={messages ? messages : []}
        onSend={()=>handleSendMessage(convoId, messageInput)}
        user={{
          _id: profile?.profile?._id,
          name: profile?.profile?.username,
          avatar: profile?.profile?.profile_pic
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderInputToolbar={renderInputToolbar}
        showAvatarForEveryMessage={true}
        loadEarlier={!getMessagesLoading && getMessagesData?.getMessages?.hasNextPage}
        onLoadEarlier={()=>getMoreMessages()}
        infiniteScroll={true}
        isLoadingEarlier={getMessagesLoading}
        renderLoadEarlier={()=><ActivityIndicator/>}
        renderLoading={()=>(
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ActivityIndicator size="large"/>
          </View>
        )}
      />):null}
      {/* {getMessagesData?.getMessages?.messages && !getMessagesLoading ? ():(
        <View style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>
          <Txt>No Conversation Yet</Txt>
        </View>
      )} */}
   </View>
   </>
  );
};

export default ChatConversation;

const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',  
    bottom: 0, 
    height: "100%",
    width: '100%',
    backgroundColor: '#FFF',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    paddingTop:90,
  },
  headerContainer: {
    position:"absolute",
    width:"100%", 
    top:0,
    zIndex:1,
    // marginBottom:5, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    // height: 90,
    paddingTop:35,
    paddingBottom:15,
    paddingHorizontal: 10,
  },
  titleTouchable: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    overflow:"hidden"
    // marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    padding: 5,
    marginRight:10,
    // marginTop: 20,
  },
  kebabButton: {
    padding: 5,
    marginRight: 10,
    // marginTop: 20,
  },
});
