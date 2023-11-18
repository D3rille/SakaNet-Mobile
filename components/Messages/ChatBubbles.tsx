import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ListRenderItemInfo } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  createdAt: Date;
  user?: {
    name: string;
    avatar: string;
  };
}

interface ChatBubblesProps {
  messages: Message[];
  onSend: (messages: Message[]) => void; // Function to handle sending messages
}

const ChatBubbles: React.FC<ChatBubblesProps> = ({ messages, onSend }) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderBubble = (item: Message) => {
    const isReceived = item.type === 'received';
    return (
      <View style={[styles.messageContainer, isReceived ? styles.receivedContainer : styles.sentContainer]}>
        {isReceived && item.user && <Image source={{ uri: item.user.avatar }} style={styles.avatar} />}
        <View style={[styles.bubble, isReceived ? styles.receivedBubble : styles.sentBubble]}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => renderBubble(item);

  // Assuming you'll add a method to handle input and call onSend when a message is composed
  // Placeholder for the send button (could be integrated with an input component)
  const renderSendButton = () => (
    <MaterialCommunityIcons
      name="send-circle"
      size={32}
      color="#2e64e5"
      style={{ margin: 10 }}
      // Add onPress logic to send a message
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderSendButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  receivedBubble: {
    backgroundColor: '#2e64e5',
  },
  sentBubble: {
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
  },
});

export default ChatBubbles;
