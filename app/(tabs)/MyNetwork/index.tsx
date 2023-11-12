import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ConnectionRequests from '../../../components/MyNetwork/ConnectionRequests';
import SuggestedUsers from '../../../components/MyNetwork/SuggestedUsers';
import SuggestedGroups from '../../../components/MyNetwork/SuggestedGroups';

const MyNetwork = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>

        <TouchableOpacity onPress={() => console.log('Card Pressed')}>
          <Card style={styles.manageCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardText}>Manage My Network</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </Card.Content>
          </Card>
        </TouchableOpacity>

        <ConnectionRequests  />

        <SuggestedUsers />

        <SuggestedGroups />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  contentContainer: {
    paddingTop: 30, 
  },
  manageCard: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginTop: 40,
    height: 50,
    backgroundColor: '#FDFDFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  cardText: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MyNetwork;

{/* WITH PULL DOWN TO REFRESH

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';

import ConnectionRequests from './components/MyNetwork/ConnectionRequests';
import SuggestedUsers from './components/MyNetwork/SuggestedUsers';
import SuggestedGroups from './components/MyNetwork/SuggestedGroups';

const REFRESH_AREA_HEIGHT = 100;

const MyNetwork = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000); 
  };

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isRefreshing ? 1 : 0),
      height: withTiming(isRefreshing ? REFRESH_AREA_HEIGHT : 0),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.refreshContainer, animatedHeaderStyle]}>
        <Lottie
          source={require(''../../../components/pullToRefresh/circlesRotate.json')}
          autoPlay
          loop
        />
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        onScroll={animatedScrollHandler}
        scrollEventThrottle={16}
        onScrollEndDrag={() => {
          if (scrollY.value <= -50) { 
            refresh();
          }
        }}
      >
        <TouchableOpacity onPress={() => console.log('Card Pressed')}>
          <Card style={styles.manageCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardText}>Manage My Network</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </Card.Content>
          </Card>
        </TouchableOpacity>

        <ConnectionRequests />
        <SuggestedUsers />
        <SuggestedGroups />

      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  contentContainer: {
    paddingTop: 30,
  },
  manageCard: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginTop: 40,
    height: 50,
    backgroundColor: '#FDFDFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  cardText: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  refreshContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});

export default MyNetwork;







*/}
