import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Appbar, Card, Avatar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../../constants/index';
import { useNavigation } from 'expo-router';

const defaultAvatarUri = 'https://via.placeholder.com/150'; 
const userName = 'Juan Dela Cruz';
const screenHeight = Dimensions.get('window').height;

const Menu = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Menu" titleStyle={styles.title}/>
            </Appbar.Header>
            <Card style={styles.profileCard} onPress={() => navigation.navigate('MyProfile')}>
                <Card.Title
                    title={userName}
                    left={(props) => <Avatar.Image {...props} source={{ uri: defaultAvatarUri }} />}
                    leftStyle={styles.avatar}
                />
            </Card>
            <View style={styles.bottomContainer}>
                <Card style={styles.bottomCard} onPress={() => console.log('Bottom Card pressed')}>
                <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings" size={24} color={COLORS.green} />
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
                    <Ionicons name="list" size={24} color={COLORS.green} />
                    <Text style={styles.menuText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Groups')}>
                    <FontAwesome5 name="users" size={20} color={COLORS.green} />
                    <Text style={styles.menuText}>Groups</Text>
                </TouchableOpacity>
                </View>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appbar: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        marginTop: -15,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'left',
    },
    profileCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 4,
    },
    avatar: {
        marginRight: 10,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCard: {
        backgroundColor: '#FCFDFE',
        marginHorizontal: 1,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        height: screenHeight / 2.3, 
        
    },
        cardContainer: {
        marginTop: 20, 
    },
        menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginBottom: 10,
        width: Dimensions.get('window').width - 32,
        marginVertical:5
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
    },
});

export default Menu;
