import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Modal } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OpenClosedBottomSheet = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const offset = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    open: () => setIsVisible(true),
    close: () => setIsVisible(false),
  }));

  const toggleSheet = () => {
    setIsVisible(!isVisible);
    offset.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-20, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < 220 / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(220, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const handlePress = (status: 'Open' | 'Closed') => {
    console.log(status + ' pressed');
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={toggleSheet}
    >
      <AnimatedPressable
        style={[styles.backdrop, StyleSheet.absoluteFill]}
        onPress={toggleSheet}
      />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, translateY]}>
          <View style={styles.draggableIndicator}></View>
          <Text style={styles.headerText}>Sort by</Text>
          <Pressable onPress={() => handlePress('Open')} style={styles.option}>
            <Text style={styles.optionText}>Open</Text>
          </Pressable>
          <View style={styles.divider}></View>
          <Pressable onPress={() => handlePress('Closed')} style={styles.option}>
            <Text style={styles.optionText}>Closed</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
    opacity: 0.5, 
  },
  sheet: {
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 16,
    height: 220,
    width: '100%',
    position: 'absolute',
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
  },
  draggableIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 18,
  },
  divider: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
});

export default OpenClosedBottomSheet;
