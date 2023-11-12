import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, Text } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';

interface User {
  id: string;
  name: string;
  location: string;
  userAvatar: string;
  headerImg: string;
}

const initialSuggestionsData: User[] = [
  {
    id: '1',
    name: 'Abelardo Jacobi',
    location: 'Pagbilao, Quezon',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri'
  },
  {
    id: '2',
    name: 'Abelardo Jacobi',
    location: 'Pagbilao, Quezon',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri'
  },
  {
    id: '3',
    name: 'Abelardo Jacobi',
    location: 'Pagbilao, Quezon',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri'
  },
];

const Suggestions = () => {
  const [connectedUsers, setConnectedUsers] = useState<{ [key: string]: boolean }>({});
  const [suggestionsData, setSuggestionsData] = useState<User[]>(initialSuggestionsData);

  const handleConnect = (userId: string) => {
    setConnectedUsers(prevState => ({
      ...prevState,
      [userId]: true
    }));

    // Remove from the list after a delay
    setTimeout(() => {
      setSuggestionsData(suggestionsData.filter(user => user.id !== userId));
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Suggested Users</Text>
      {suggestionsData.length > 0 ? (
        <ScrollView style={styles.scrollView} horizontal={true}>
          {suggestionsData.map(user => (
            <Card key={user.id} style={styles.card}>
              <Image source={{ uri: user.headerImg }} style={styles.headerImage} />
              <View style={styles.avatarContainer}>
                <Avatar.Image size={64} source={{ uri: user.userAvatar }} style={styles.avatar} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode='tail'>{user.name}</Text>
                <Text style={styles.userLocation} numberOfLines={1} ellipsizeMode='tail'>{user.location}</Text>
              </View>
              <Button
                mode="outlined"
                style={[styles.connectButton, connectedUsers[user.id] ? styles.connectedButton : null]}
                labelStyle={styles.connectButtonText}
                onPress={() => handleConnect(user.id)}
                disabled={connectedUsers[user.id]}
              >
                {connectedUsers[user.id] ? 'Request Sent' : 'Connect'}
              </Button>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noSuggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggested users yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 20,
    color: '#404140'
  },
  scrollView: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  card: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#FDFDFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginBottom: 10,
  },
  headerImage: {
    height: 70,
    width: '100%',
    backgroundColor: '#FE8C47',
    borderRadius: 20
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#2E603A',
    padding: 5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 35
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  userLocation: {
    fontSize: 11,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  connectButton: {
    borderWidth: 1,
    borderColor: '#FE8C47',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    flex: 1,
    justifyContent: 'center',
  },
  connectedButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  connectButtonText: {
    color: '#FE8C47',
    fontSize: 12
  },
  noSuggestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: '#404140'
  },
});

export default Suggestions;
