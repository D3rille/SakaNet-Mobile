//@ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import {router} from "expo-router";

import { useAuth } from '../../context/auth';
import { timePassed } from '../../util/dateUtils';
import DefaultProfile from "../../assets/images/default_profile.jpg";
import { formatWideAddress } from '../../util/addresssUtils';

interface FindUserToChatProps {
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

const SearchUserItem = ( {avatar, name, address, onPress} ) => {
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
                    {trimText(address, 33)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const FindUserToChatResult = ({data}) => {
    const {user} = useAuth();
    const navigation = useNavigation();

    // console.log(data)
    if(data){
        return(
            <View style={styles.chatItemsContainer}>
                <FlatList
                    data={data}
                    renderItem={({item}) =>
                        <SearchUserItem
                            key={item._id}
                            avatar={item?.profile_pic}
                            name={item?.username}
                            address={formatWideAddress(item?.address)}
                            onPress={() => router.push("/(tabs)/Messages/ChatConversation")}
                            // onPress={() => navigation.navigate('ChatConversation', { name: item.name })}
                        />
                    }
                    keyExtractor={item => item._id}
                 />
            </View>
        )
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
        fontWeight: 'bold',
        fontSize: 16,
        overflow: 'hidden',
    },
    address: {
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

export default FindUserToChatResult;
