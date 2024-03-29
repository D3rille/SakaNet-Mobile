//@ts-nocheck
import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import {BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { RadioButton, Button,  TextInput as TextField } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";

import { formatDate } from "../../util/dateUtils";



export default FilterBottomSheet = ({ sheetRef, updateFilters, snapPoints }) => {
  const [deliveryFilter, setDeliveryFilter] = useState(""); // Delivery Filter
  const [priceRange, setPriceRange] = useState([0, 1000]); // Price Range Filter
  const [currentLocation, setCurrentLocation] = useState(""); // Area Limit Filter
  const [selectedDate, setSelectedDate] = useState(null); // Date Filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const applyFilters = () => {
    updateFilters({
      modeOfDelivery: deliveryFilter, 
      area_limit: currentLocation,
      maxPrice: priceRange[1],
      minPrice: priceRange[0],
      until: date.toISOString(),
    });
   

  };

  const [date, setDate] = useState(new Date());
  const [show,setShow] = useState(false);
  const [mode, setMode] = useState("date");
  
   // console.log("Min",priceRange[0]);
    // console.log("Max",priceRange[1]);
    // console.log(date)

  const onChange = (e, selectedDate) =>
  {
    setShow(false);
    setDate(selectedDate);
    // setSelectedDate(selectedDate);
  }

  const showMode = (modetoShow) => 
  {
    setShow(true);
    setMode(modetoShow);
  }
  return (
  //   <BottomSheet
  //     ref={sheetRef}
  //     index={-1}
  //     snapPoints={snapPoints}
  //     enablePanDownToClose={true}
  //     activeOffsetY={[-1, 1]} 
  //     failOffsetX={[-5, 5]} 
            
  //   >
  <BottomSheetModalProvider>
      <View style={styles.container}>
        <BottomSheetModal
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
          on
        >
          <View style={{paddingHorizontal:20, paddingVertical:10}}>
            <Text>Mode of Delivery</Text>
            <RadioButton.Group onValueChange={newValue => setDeliveryFilter(newValue)} value={deliveryFilter}>
            <View style={styles.rowContainer}>

              <View style={styles.radioButtonRow}>
                <Text>All</Text>
                <RadioButton value=""  color="#2F603B"/>
              </View>
              <View style={styles.radioButtonRow}>
                <Text>Pickup</Text>
                <RadioButton value="pick-up" color="#2F603B" />
              </View>
              <View style={styles.radioButtonRow}>
                <Text>Delivery</Text>
                <RadioButton value="delivery" color="#2F603B" />
              </View>
              </View>
            </RadioButton.Group>

        
            <View style={styles.priceRangeRow}>
            <TextInput
              style={{flex:1}}
              keyboardType="number-pad"
              mode="outlined"
              label="Minimum Price"
              defaultValue="0"
              onChangeText={(price) => setPriceRange([parseInt(price), priceRange[1]])}
            />
            <TextInput
             style={{flex:1}}
              keyboardType="number-pad"
              defaultValue="1000"
              mode="outlined"
              label="Maximum Price"
              onChangeText={(price) => setPriceRange([priceRange[0], parseInt(price)])}

            />
            </View>

            <TextInput
              style={{marginBottom:5}}
              mode="outlined"
              label="Area Limit"
              placeholder="ex. Quezon"
              onChangeText={(location) => setCurrentLocation(location)}

            />

              <TouchableOpacity
                onPress={()=>showMode("date")}
              >
                <TextField
                  outlineStyle={{borderColor:"black"}}
                  mode="outlined"
                  label="Date of Harvest"
                  value={formatDate(date, "LL")}
                  editable={false}
                />
              </TouchableOpacity>

            {show ? (
              <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            ):null}
            
            {/* <Button style={styles.button} mode="contained" onPress={() => showMode("date")}  buttonColor="#2F603B">
              Set Time Limit      
            </Button> */}
          
            <Button   style={styles.button} mode="contained" onPress={() => applyFilters()}  buttonColor="#2F603B">
                Search
            </Button>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
   
    marginBottom: 10,
  },
  rowContainer:
  {
    flexDirection: 'row',
    gap: 10,
  },
  priceRangeRow:
  {
    flexDirection: 'row',
    marginBottom:5,
    gap: 10,

  },
  button:
  {
    padding: 1,
    margin: 10,
  }
});
