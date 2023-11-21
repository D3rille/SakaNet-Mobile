import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BottomSheetScrollView from './BottomSheetScrollView';
import Icon from 'react-native-vector-icons/Ionicons';

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const NewMessageModal = forwardRef<BottomSheetMethods>((props, ref) => {
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const suggestedUsers = [
        { id: '1', name: 'User One' },
        { id: '2', name: 'User Two' },
        { id: '3', name: 'User Three' },
    ];

    useImperativeHandle(ref, () => ({
        expand: () => {
            bottomSheetRef.current?.expand();
        },
        close: () => {
            bottomSheetRef.current?.close();
        },
    }));

    const handleUserSelect = (userName: string) => {
        setSearchQuery((prevSearchQuery) => {
            return prevSearchQuery ? `${prevSearchQuery}, ${userName}` : userName;
        });
    };

    return (
        <BottomSheetScrollView
            ref={bottomSheetRef}
            snapTo="90%"
            backgroundColor="white"
            backDropColor="rgba(0,0,0,0.5)"
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Message</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="To:"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    multiline // allows input to wrap to a new line
                />
            </View>

            <TouchableOpacity style={styles.createGroupButton}>
                <View style={styles.iconWithCircle}>
                    <Icon name="people" size={20} color="gray" />
                </View>
                <Text style={styles.createGroupText}>Create a new group</Text>
                <Icon name="chevron-forward" size={20} color="gray" style={styles.chevronIcon} />
            </TouchableOpacity>

            <Text style={styles.suggestedTitle}>Suggested</Text>
            {suggestedUsers.map((user) => (
                <TouchableOpacity key={user.id} style={styles.userContainer} onPress={() => handleUserSelect(user.name)}>
                    <Text style={styles.suggestedUser}>{user.name}</Text>
                </TouchableOpacity>
            ))}
        </BottomSheetScrollView>
    );
});

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelText: {
        position: 'absolute',
        left: 15,
        fontSize: 16,
        color: 'blue',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#fafafa',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 10,
        marginHorizontal: 15,
        marginRight: 15
    },
    createGroupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    createGroupText: {
        marginLeft: 10,
    },
    iconWithCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    chevronIcon: {
        marginLeft: 'auto',
    },
    suggestedTitle: {
        fontSize: 16,
        color: 'lightgray',
        padding: 10,
    },
    userContainer: {
        marginHorizontal: 15,
        paddingVertical: 8,
    },
    suggestedUser: {

    },
});

export default NewMessageModal;
