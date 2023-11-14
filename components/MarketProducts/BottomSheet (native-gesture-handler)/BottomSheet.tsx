import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get('window').height;
const initialHeight = screenHeight * 0.4;

const BottomSheet = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = event.nativeEvent;
      translationY = translationY > initialHeight ? initialHeight : translationY;
      let finalPosition = translationY + 0.2 * velocityY;

      if (finalPosition < 0 || velocityY < -500) {
        Animated.spring(translateY, {
          toValue: 0,
          velocity: velocityY,
          useNativeDriver: true,
        }).start();
      } else if (finalPosition > initialHeight || velocityY > 500) {
        Animated.spring(translateY, {
          toValue: screenHeight,
          velocity: velocityY,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      } else {
        Animated.spring(translateY, {
          toValue: initialHeight,
          velocity: velocityY,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsVisible(true);
      Animated.timing(translateY, {
        toValue: initialHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    close: () => {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    },
  }));

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="none"
    >
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPressOut={() => {
          setIsVisible(false);
        }}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.draggableArea}>
              <Icon name="remove-outline" size={30} color="#000" />
            </View>

            <View style={styles.pickerContainer}>
              {[
                'All', 'Cereals', 'Root Crops', 'Beans and Legumes',
                'Condiments', 'Fruit Vegetables', 'Leafy Vegetables',
                'Fruits', 'Commercial Crops', 'Cut Flowers',
                'Livestock and Poultry (Backyard)',
              ].map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.item}
                  onPress={() => {
                    setIsVisible(false);
                  
                  }}
                >
                  <Text style={styles.itemText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
    minHeight: 200, 
  },
  draggableArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerContainer: {
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default BottomSheet;
