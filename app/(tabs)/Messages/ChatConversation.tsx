import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Bubble, GiftedChat, Send, InputToolbar, IMessage } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { COLORS } from '../../../constants/index';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

function ChatConversationHeader({
  name,
  onBackPress,
}: {
  name: string;
  onBackPress: () => void;
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back-outline" size={24} color="gray" />
      </TouchableOpacity>
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

const ChatConversation = ({ route }: { route: any }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation(); // Use the useNavigation hook

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello world',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 4,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);

  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

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
          marginBottom: 5, 
          borderRadius: 25,
          backgroundColor: COLORS.pageBg,
        }}
      />
    );
  };

  const onBackPress = () => {
    navigation.goBack(); 
  };

  return (
    <>
      {/* <ChatConversationHeader name={route?.name ?? 'Default User'} onBackPress={onBackPress} /> */}
      <GiftedChat
      
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderInputToolbar={renderInputToolbar} 
      />

      <View style={styles.chatContainer}>
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
  },
  headerContainer: {
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
    height: 100,
    paddingHorizontal: 10,
  },
  titleTouchable: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  backButton: {
    padding: 5,
    marginTop: 20,
  },
  kebabButton: {
    padding: 5,
    marginRight: 10,
    marginTop: 20,
  },
});
