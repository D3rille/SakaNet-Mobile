import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import SellProducts from '../../components/FarmerSide (MyProducts)/SellProduct';
import PreSellProducts from '../../components/FarmerSide (MyProducts)/PreSellProduct';
import OpenClosedBottomSheet from '../../components/FarmerSide (MyProducts)/OpenClosedBottomSheet'; 
import { COLORS, SIZES } from '../../constants/index';

type StatusType = 'sell' | 'presell';

const Product = () => {
  const [status, setStatus] = useState<StatusType>('sell');
  const bottomSheetRef = useRef<{ open: () => void }>(null);

  const getButtonStyle = (buttonStatus: StatusType) => ({
    ...styles.toggleButton,
    backgroundColor: status === buttonStatus ? COLORS.orange : 'transparent',
  });

  const getTextStyle = (buttonStatus: StatusType) => ({
    color: status === buttonStatus ? 'white' : COLORS.orange,
    fontSize: SIZES.small,
  });

  const renderProductList = () => {
    if (status === 'sell') {
      return <SellProducts />;
    } else if (status === 'presell') {
      return <PreSellProducts />;
    }
  };

  const handleSortPress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open(); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchAndSortSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={25} style={{ marginLeft: 20 }} />
          <TextInput placeholder="Search" style={styles.input} />
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={handleSortPress}>
          <Icon name="filter" size={30} color={'white'} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <Button
          compact
          onPress={() => setStatus('sell')}
          style={getButtonStyle('sell')}
          labelStyle={getTextStyle('sell')}
        >
          Sell
        </Button>
        <Button
          compact
          onPress={() => setStatus('presell')}
          style={getButtonStyle('presell')}
          labelStyle={getTextStyle('presell')}
        >
          Pre-sell
        </Button>
      </View>

      {renderProductList()}

      {/* Bottom Sheet */}
      <OpenClosedBottomSheet ref={bottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  searchAndSortSection: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  sortBtn: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  toggleContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggleButton: {
    borderRadius: 20,
    flex: 1,
    margin: 0,
  },
});

export default Product;