import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import DefaultProfile from "../../assets/images/default_profile.jpg";
import { timePassed } from "../../util/dateUtils";

export default function Notification({ notif, deleteNotif }) {
  const rightSwipeActions = () => {
    return (
      <View style={styles.deleteBox}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    );
  };

  const swipeFromRightOpen = () => {
    deleteNotif({ variables: { notificationId: notif._id } });
  };

  return (
    <Swipeable
      renderRightActions={rightSwipeActions}
      onSwipeableRightOpen={swipeFromRightOpen}
    >
      <View style={styles.container}>
        <View style={styles.avatarSection}>
          <Avatar.Image size={60} source={notif?.profile_pic ? { uri: notif.photo } : DefaultProfile} />
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.username}>
            {notif?.from ?? 'username'}
          </Text>
          <Text style={styles.paragraph}>
            {notif?.message ?? 'no message'}
          </Text>
        </View>

        <Text style={styles.notifTimeStamp}>
          {timePassed(notif?.createdAt)}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  avatarSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 6,
    justifyContent: 'center',
    marginLeft:10
  },
  username: {
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 5,
    fontSize: 14,
  },
  notifTimeStamp: {
    flex: 2,
    fontSize: 11,
    textAlign: 'right',
    alignSelf: 'center',
    paddingRight:10
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
