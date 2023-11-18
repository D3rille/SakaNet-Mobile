import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constants/index';
import NewMessageModal from '../../../components/Messages/NewMessageModal'; 
import ChatsListHeader from '../../../components/Messages/ChatsListHeader';
import ChatItems from '../../../components/Messages/ChatItems';
import { BottomSheetMethods } from '../../../components/Messages/BottomSheetScrollView'; 

const Messages = () => {
    const newMessageModalRef = useRef<BottomSheetMethods>(null);

    const handleAddPress = () => {
        newMessageModalRef.current?.expand();
    };

    return (
        <View style={styles.container}> 
            <ChatsListHeader />
            <View style={styles.cardContainer}>
                <ChatItems />
            </View>

            <TouchableOpacity 
                style={styles.addIconContainer} 
                onPress={handleAddPress}>
                <Icon name="add-outline" size={50} color='white' />
            </TouchableOpacity>

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
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        width: '100%',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: COLORS.orange,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 5, 
    },
});

export default Messages;
