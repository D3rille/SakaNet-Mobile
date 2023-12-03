//@ts-nocheck
import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import { Appbar, Card, Avatar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../../constants/index';
import { useNavigation, router } from 'expo-router';
import MenuHeader from "../../../components/Menu/MenuHeader";
import { sakanetGreen } from '../../../constants/Colors';
import { useAuth } from '../../../context/auth';
import client from '../../../graphql/apollo-client';
import { useSubs } from '../../../context/subscriptionProvider';
import DefaultProfile from "../../../assets/images/default_profile.jpg";

// const defaultAvatarUri = 'https://via.placeholder.com/150'; 
// const userName = 'Juan Dela Cruz';
const screenHeight = Dimensions.get('window').height;

const Menu = () => {
    const {logout} = useAuth();
    const {profile} = useSubs();
    
    return (
        <View style={styles.container}>
            <MenuHeader />
            <Card style={styles.profileCard} onPress={() => router.push("/(tabs)/Menu/MyProfile")}>
                <Card.Title
                    title={profile?.profile?.username}
                    left={(props) => <Avatar.Image {...props} source={
                        profile?.profile?.profile_pic ? {uri: profile?.profile?.profile_pic} : DefaultProfile
                    } />}
                    leftStyle={styles.avatar}
                />
            </Card>
            <View style={styles.bottomContainer}>
                <Card style={styles.bottomCard} onPress={() => console.log('Bottom Card pressed')}>
                <View style={styles.cardContainer}>
               {/* <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/Menu/Settings")}>
                    <Ionicons name="settings" size={24} color={COLORS.green} />
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity> */}
                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/Menu/Orders")}>
                            <Ionicons name="list" size={24} color={COLORS.green} />
                            <Text style={styles.menuText}>Orders</Text>
                        </TouchableOpacity>
                {/*     <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/Menu/Groups")}>
                            <FontAwesome5 name="users" size={20} color={COLORS.green} />
                            <Text style={styles.menuText}>Groups</Text>
                        </TouchableOpacity> */}
                        {/* Log Out Button */}
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => {
                                logout();
                                router.replace("/login");
                            }}
                        >
                            <Ionicons name="exit-outline" size={24} color={COLORS.green} />
                            <Text style={styles.menuText}>Log Out</Text>
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
    profileCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 4,
        top:20
    },
    avatar: {
        marginRight: 10,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        bottom:-30
    },
    bottomCard: {
        backgroundColor: '#FCFDFE',
        marginHorizontal: 1,
        borderTopWidth: 2.5,
        borderColor: '#EBEBEB',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        //paddingBottom:10,
        height: screenHeight / 3.5 
        
    },
    cardContainer: {
        marginTop: 20, 
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: '#EBEBEB',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginBottom: 10,
        //width: Dimensions.get('window').width - 60,
        marginVertical: 5
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
    },
});

export default Menu;
