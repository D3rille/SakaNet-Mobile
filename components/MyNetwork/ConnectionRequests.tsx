import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

type AcceptedRequests = {
  [key: number]: boolean;
};

const ConnectionRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState<AcceptedRequests>({});
  const [connectionRequests, setConnectionRequests] = useState([
    {
      id: 1,
      userAvatar: 'https://via.placeholder.com/150',
      name: 'Juan dela Cruz',
      location: 'Pagbilao, Quezon',
    },
    {
      id: 2,
      userAvatar: 'https://via.placeholder.com/150',
      name: 'Juan Cruz',
      location: 'Quezon',
    },
  ]);

  const handleAccept = (id: number) => {
    setAcceptedRequests((prevAcceptedRequests) => ({
      ...prevAcceptedRequests,
      [id]: true,
    }));

    // Remove an accepted request after a delay
    setTimeout(() => {
      setConnectionRequests((prevRequests) => prevRequests.filter(request => request.id !== id));
    }, 2000);
  };

  const handleClose = (id: number) => {
    setConnectionRequests((prevRequests) => prevRequests.filter(request => request.id !== id));
  };

  return (
    <View>
      <Text style={styles.headerText}>Connection Requests</Text>
      <Card style={styles.card}>
        {connectionRequests.length > 0 ? (
          connectionRequests.map((request, index) => (
            <React.Fragment key={request.id}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: request.userAvatar }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.details}>
                  <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>
                    {request.name}
                  </Text>
                  <Text style={styles.userLocation} numberOfLines={1} ellipsizeMode='tail'>
                    {request.location}
                  </Text>
                </View>
                <View style={styles.actions}>
                  {acceptedRequests[request.id] ? (
                    <View style={styles.iconWrapper}>
                      <Ionicons name="checkmark-done" size={24} color="#FE8C47" />
                    </View>
                  ) : (
                    <Button
                      mode="outlined"
                      color="#FE8C47"
                      onPress={() => handleAccept(request.id)}
                      style={styles.acceptButton}
                      labelStyle={styles.buttonLabel}
                    >
                      Accept
                    </Button>
                  )}
                  <TouchableOpacity onPress={() => handleClose(request.id)}>
                    <Ionicons name="close-circle" size={24} color="#2E603A" />
                  </TouchableOpacity>
                </View>
              </Card.Content>
              {index < connectionRequests.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <View style={styles.centeredMessage}>
            <Text>No connection requests yet</Text>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 20,
    color: '#404140',
  },
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    backgroundColor: '#FDFDFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginTop: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E603A',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  details: {
    justifyContent: 'center',
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#404140',
    maxWidth: '88%',
  },
  userLocation: {
    fontSize: 12,
    color: 'gray',
    maxWidth: '88%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    borderColor: '#FE8C47',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonLabel: {
    color: '#FE8C47',
    fontSize: 9,
  },
  iconWrapper: {
    marginRight: 30,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ConnectionRequests;
