import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Avatar } from 'react-native-paper';

const initialData = [
  {
    id: '1',
    name: 'Lucena Farmers',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri',
    joined: false
  },
    {
    id: '2',
    name: 'Mauban Farmer',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri',
    joined: false
  },
    {
    id: '3',
    name: 'Farmers Group',
    userAvatar: 'avatar-image-uri',
    headerImg: 'header-image-uri',
    joined: false
  },
];

const SuggestedGroups = () => {
  const [suggestionsData, setSuggestionsData] = useState(initialData);

 const handleJoin = (id: string) => {
    const newData = suggestionsData.map(item => 
      item.id === id ? { ...item, joined: true } : item
    );
    setSuggestionsData(newData);

    // Remove the item from the list after a delay
    setTimeout(() => {
      setSuggestionsData(suggestionsData.filter(item => item.id !== id));
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Suggested Groups</Text>
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
              </View>
              <Button
                mode="outlined"
                style={[styles.joinButton, user.joined && styles.joinedButton]}
                labelStyle={styles.joinButtonText}
                onPress={() => handleJoin(user.id)}
                disabled={user.joined}
              >
                {user.joined ? 'Joined' : 'Join'}
              </Button>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noSuggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggested groups yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15, 
    marginHorizontal: 20,
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
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 10,
  },
  headerImage: {
    height: 70, 
    width: '100%',
    backgroundColor: '#FE8C47',
    borderRadius:20
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
    marginTop:35
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'center',
    maxWidth: '80%',
  },
  joinButton: {
    borderWidth: 1,
    borderColor: '#FE8C47',
    borderRadius: 20,
    marginHorizontal: 25,
    marginBottom: 10,
    marginTop: 10
  },
  joinButtonText: {
    color: '#FE8C47',
    fontSize:12
  },
  joinedButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
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

export default SuggestedGroups;
