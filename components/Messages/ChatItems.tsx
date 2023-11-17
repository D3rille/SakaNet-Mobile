import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

interface ChatItemProps {
    avatar: string;
    name: string;
    message: string;
    time: string;
    onPress: () => void;
}

const trimText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text;
};

const ChatItem: React.FC<ChatItemProps> = ({ avatar, name, message, time, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.chatItem}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
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

const ChatItems = () => {
    const navigation = useNavigation();
    const dummyData = [
        {
            id: 1,
            avatar: 'https://via.placeholder.com/150',
            name: 'John Doe',
            message: 'Hey, this is a trial? This is a longer message to test truncation.',
            time: '11 mins',
        },
        {
            id: 2,
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            message: 'Let us talk tomorrow. I have something important to discuss.',
            time: '13 mins',
        },
        {
            id: 3,
            avatar: 'https://via.placeholder.com/150',
            name: 'Emily Johnson',
            message: 'send gcash',
            time: '15 mins',
        },
                {
            id: 4,
            avatar: 'https://via.placeholder.com/150',
            name: 'John Doe',
            message: 'Hey, this is a trial? This is a longer message to test truncation.',
            time: '11 mins',
        },
        {
            id: 5,
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            message: 'Let us talk tomorrow. I have something important to discuss.',
            time: '13 mins',
        },
        {
            id: 6,
            avatar: 'https://via.placeholder.com/150',
            name: 'Emily Johnson',
            message: 'send gcash',
            time: '15 mins',
        },
                {
            id: 7,
            avatar: 'https://via.placeholder.com/150',
            name: 'John Doe',
            message: 'Hey, this is a trial? This is a longer message to test truncation.',
            time: '11 mins',
        },
        {
            id: 8,
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            message: 'Let us talk tomorrow. I have something important to discuss.',
            time: '13 mins',
        },
        {
            id: 9,
            avatar: 'https://via.placeholder.com/150',
            name: 'Emily Johnson',
            message: 'send gcash',
            time: '15 mins',
        },

    ];

    return (
        <ScrollView>
            <View style={styles.chatItemsContainer}>
                {dummyData.map((item) => (
                    <ChatItem
                        key={item.id}
                        avatar={item.avatar}
                        name={item.name}
                        message={item.message}
                        time={item.time}
                        onPress={() => navigation.navigate('ChatConversation', { name: item.name })}
                    />
                ))}
            </View>
        </ScrollView>
    );
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
    message: {
        color: '#666',
        fontSize: 14,
        overflow: 'hidden',
    },
    time: {
        color: '#999',
    },
    chatItemsContainer: {
        marginTop: 20,
        marginBottom: 60,
    },
});

export default ChatItems;
