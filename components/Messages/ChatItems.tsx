//@ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import {router} from "expo-router";

import { useAuth } from '../../context/auth';
import { timePassed } from '../../util/dateUtils';
import DefaultProfile from "../../assets/images/default_profile.jpg";

interface ChatItemProps {
    avatar: string;
    name: string;
    message: string;
    time: string;
    onPress: () => void;
}

const trimText = (text: string, maxLength: number) => {
    if (text?.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text;
};

const ChatItem: React.FC<ChatItemProps> = ( {avatar, name, message, time, onPress} ) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.chatItem}>
            <Image source={
                avatar ? {uri:avatar}: DefaultProfile
                } style={styles.avatar} />
            <View style={styles.messageContainer}>  
                <Text style={styles.name} numberOfLines={1}>
                    {trimText(name, 30)}
                </Text>
                <Text style={styles.message} numberOfLines={1}>
                    {trimText(message, 33)}
                </Text>
            </View>
            <Text style={styles.time}>{time}</Text>
        </TouchableOpacity>
    );
};

const ChatItems = ({data, handleGetMoreConversations}) => {
    const {user} = useAuth();
    const navigation = useNavigation();
    // const highLightonUnreadConvo = !chat.hasSeenLastMessage.includes(user.id);
    // console.log(data[0])
    if(data){
        return(
            <View style={styles.chatItemsContainer}>
                <FlatList
                    data={data}
                    renderItem={({item}) =>
                        <ChatItem
                            key={item._id}
                            avatar={item?.profile_pic}
                            name={item?.name}
                            message={item?.lastMessage?.message}
                            time={timePassed(item?.lastMessage?.createdAt)}
                            onPress={() => router.push({
                                pathname:"/(tabs)/Messages/ChatConversation", 
                                params:{convoId:`${item._id}`, userId:null}
                            })}
                            // onPress={() => navigation.navigate('ChatConversation', { name: item.name })}
                        />
                    }
                    keyExtractor={item => item._id}
                    onEndReachedThreshold={0.1}
                    onEndReached={()=>handleGetMoreConversations()}
                 />
            </View>
        )

        // return (
    
        //     <ScrollView >
        //         <View style={styles.chatItemsContainer}>
        //             {data.map((item) => {
        //                 return(<ChatItem
        //                     key={item._id}
        //                     avatar={item?.profile_pic}
        //                     name={item?.name}
        //                     message={item?.lastMessage?.message}
        //                     time={timePassed(item?.lastMessage?.createdAt)}
        //                      onPress={() => router.push("/(tabs)/Messages/ChatConversation")}
        //                     // onPress={() => navigation.navigate('ChatConversation', { name: item.name })}
        //                 />)
        //             })}
        //         </View>
        //     </ScrollView>
        // );
    }
    
};

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.3,
        borderColor: '#ccc',
        marginHorizontal: 16,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },
    messageContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        // fontWeight: 'bold',
        fontSize: 16,
        overflow: 'hidden',
    },
    message: {
        color: '#666',
        fontSize: 14,
        overflow: 'hidden',
    },
    time: {
        color: '#999',
    },
    chatItemsContainer: {
        // marginVertical:10,
        // marginBottom: 60,
        marginTop: 10
        // marginBottom: 60,
    },
});

export default ChatItems;
