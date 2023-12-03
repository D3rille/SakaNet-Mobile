//@ts-nocheck
import React from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useMutation } from '@apollo/client';
import ChatsListHeader from '../../../components/Notifications/NotificationsHeader';
import { useSubs } from '../../../context/subscriptionProvider';
import { GET_NOTIFICATIONS, DELETE_NOTIFICATION, CLEAR_NOTIFICATIONS } from "../../../graphql/operations/notification";
import { COLORS } from '../../../constants/index';
import Notification from "../../../components/Notifications/notification";

const Notifications = () => {
  const { notifData } = useSubs();

  const [deleteNotif] = useMutation(DELETE_NOTIFICATION, {
    refetchQueries: [GET_NOTIFICATIONS]
  });

  const [clearNotifs] = useMutation(CLEAR_NOTIFICATIONS, {
    refetchQueries: [GET_NOTIFICATIONS]
  });

  if (!notifData?.getNotifications || notifData?.getNotifications === []) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No Notifications</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatsListHeader clearNotifs={clearNotifs} />
      <View style={styles.cardContainer}>
        {!notifData.getNotifications || notifData.getNotifications === [] ? (
          <Text style={{ flex: 1 }}>No Notifications</Text>
        ) : null}
        <FlatList
          style={{ paddingBottom: 30, paddingTop: 10 }}
          data={notifData?.getNotifications}
          renderItem={({ item }) => <Notification notif={item} deleteNotif={deleteNotif} />}
          keyExtractor={item => item._id}
        />
      </View>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    height: screenHeight * 0.77,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    width: '100%',
    paddingTop: 5,
    overflow: 'hidden'
  },
});

export default Notifications;
