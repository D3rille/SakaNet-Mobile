//@ts-nocheck
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Card, Avatar, Button,Divider, ActivityIndicator, Text as Txt } from 'react-native-paper';
import {useQuery, useLazyQuery} from "@apollo/client";
import Ionicons from "react-native-vector-icons/Ionicons";


import MyConnections from '../../../components/MyNetwork/ManageMyNetwork';
import defaultProfile from "../../../assets/images/default_profile.jpg";
import HeadTabs from '../../../components/MyNetwork/HeadTabs';
import { GET_CONNECTED_USERS } from '../../../graphql/operations/myNetwork';
import { GET_JOINED_GROUPS, GET_MANAGED_GROUPS } from '../../../graphql/operations/poolGroup';
import { formatWideAddress } from '../../../util/addresssUtils';


const ConnectedUser = ({data}) =>{
    return(
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={{flex:1}}>
                    <Avatar.Image
                        source={defaultProfile}
                        size={50}
                    />
                </View>
                <View style={{flex:2, flexDirection:"column"}}>
                    <Text style={styles.userName}>{data?.username}</Text>
                    <Text>{formatWideAddress(data?.address)}</Text>
                </View>
                <View style={{flex:1, alignItems:"flex-end"}}>
                    <TouchableOpacity
                        style={{borderWidth:1, padding:5, borderRadius:50, borderColor:"#FE8C47"}}
                    >
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={30}
                            color="#FE8C47"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}



const Group = ({data}) =>{
    return(
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={{flex:1}}>
                    <Avatar.Image
                        source={defaultProfile}
                        size={50}
                    />
                </View>
                <View style={{flex:2}}>
                    <Text style={styles.userName}>{data?.groupName}</Text>
                </View>
                <View style={{flex:1, alignItems:"flex-end"}}>
                </View>
            </View>
        </View>
    )
}
export default function ManageMyNetwork(){
    const [tab, setTab] = useState("My Connections");
    const [activeIndex, setActiveIndex] = useState(0);

    const [getConnections, {data:connectionsData, loading:connectionsLoading}] = useLazyQuery(GET_CONNECTED_USERS);
    const [getManagedGroups, {data:managedGroupsData, loading:managedGroupsLoading}] = useLazyQuery(GET_MANAGED_GROUPS);
    const [getJoinedGroups, {data: joinedGroupsData, loading:joinedGroupsLoading}] = useLazyQuery(GET_JOINED_GROUPS);

    useEffect(()=>{
        if(tab == "My Connections"){
            getConnections();
        } else if(tab == "Groups You Manage"){
            getManagedGroups();
        } else if(tab == "Joined Groups"){
            getJoinedGroups();
        }
    },[tab]);

    // if(connectionsLoading){
    //     return(
    //     <View style={{justifyContent:"center", alignItems:"center"}}>
    //         <ActivityIndicator size="large"/>
    //     </View>
    //     );

    // } 
    // if(connectionsLoading || managedGroupsLoading || joinedGroupsLoading){
    //     return(
    //     <View style={{justifyContent:"center", alignItems:"center"}}>
    //         <ActivityIndicator size="large"/>
    //     </View>
    //     );

    // } 
    return (
        <SafeAreaView style={styles.container}>
            <HeadTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} setTab={setTab}/>

            {/* My Connections */}
            {tab == "My Connections" ? (
            <View>
                {/* <Text style={styles.headerText}>My Connections</Text> */}
                <ScrollView>
                    {connectionsLoading ? (
                        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:100}}>
                            <ActivityIndicator size="large"/>
                        </View>
                    ):null}
                    {!connectionsLoading && connectionsData?.getConnectedUsers.length == 0 ?(
                        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                             <Txt style={styles.noDataLabel} variant="headlineSmall">No Connections</Txt>
                        </View>
                    ):null}
                    {!connectionsLoading && connectionsData ? connectionsData?.getConnectedUsers?.map((user, index)=>(
                        <ConnectedUser key={index} data={user}/>
                    )):null}
                    
                </ScrollView>

            </View >):null}

            {/*Groups you manage  */}
            {tab == "Groups You Manage" ? (
            <View>
                <ScrollView>
                    {managedGroupsLoading ? (
                        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:100}}>
                            <ActivityIndicator size="large"/>
                        </View>
                    ):null}
                    {!managedGroupsLoading && managedGroupsData && managedGroupsData?.getManagedGroups?.length == 0 ? (
                        <View style={styles.centerToScreen}>
                            <Txt style={styles.noDataLabel} variant="headlineSmall">No Groups</Txt>
                        </View>
                    ):null}
                    {!managedGroupsLoading && managedGroupsData && managedGroupsData?.getManagedGroups?.map((group, index)=>(
                        <Group key={index} data={group}/>
                    ))}
                </ScrollView>
            </View>):null}

            {/*Joined Groups  */}
            {tab == "Joined Groups" ? (
            <View>
                <ScrollView>
                    {joinedGroupsLoading ? (
                        <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:100}}>
                            <ActivityIndicator size="large"/>
                        </View>
                    ):null}
                    {!joinedGroupsLoading && joinedGroupsData?.getJoinedGroups?.length == 0 ?(
                        <View style={styles.centerToScreen}>
                            <Txt style={styles.noDataLabel} variant="headlineSmall">No Groups</Txt>
                        </View>
                    ):null}
                    {!joinedGroupsLoading && joinedGroupsData ? joinedGroupsData?.getJoinedGroups.map((group, index)=>{
                        <Group key={index} data={group}/>
                    }):null}
                </ScrollView>

            </View>):null}
            

            
        </SafeAreaView>
        
    )
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"
        // justifyContent:"flex-start",
        // alignItems:"center"
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 20,
        marginTop: 20,
        color: '#404140',
    },
    userName: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#404140",
        // maxWidth: "88%",
    },    
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10,
    },
    card: {
        alignSelf: "stretch",
        marginHorizontal: 20,
        backgroundColor: "#FDFDFF",
        // borderRadius: 10,
        // elevation: 3,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        
        
    },
    messageButton: {
        borderColor: "#FE8C47",
        borderWidth: 1,
        borderRadius: 20,
    },
    buttonLabel: {
    color: "#FE8C47",
    fontSize: 9,
    },
    centerToScreen:{
        flex:1, 
        justifyContent:"center", 
        alignItems:"center",
        padding:100
    },
    noDataLabel:{
        textAlign:"center", 
        color:"#c5c5c5", 
    }
})
