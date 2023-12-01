//@ts-nocheck
import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { SegmentedButtons, Button, Menu, Divider, Text, ActivityIndicator, RadioButton, TextInput as TextField, Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sakanetGreen, sakanetOrange } from "../../constants/Colors";
import {useMutation} from "@apollo/client";
import Toast from "react-native-toast-message";
import {router} from "expo-router";

import { formatDate } from "../../util/dateUtils";
import { CREATE_PRODUCT, GET_MY_PRODUCTS } from "../../graphql/operations/product";

const AddProductBottomSheet = ({openSheet, setOpenSheet, data, loading, error}) => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const [category, setCategory] = useState('Sell');
  const [openMenu, setOpenMenu] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState("");

  // Inputs
  const [price, setPrice] = useState(0);
  const [stocks, setStocks] = useState(0);
  const [minimum_order, setMinimum_order] = useState(0);
  const [unit, setUnit] = useState("kg");
  const [until, setUntil] = useState(new Date());
  const [harvestDate, setHarvestDate] = useState(new Date());
  const [modeOfDelivery, setModeOfDelivery] = useState("pick-up")
  const [area_limit, setArea_limit] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(()=>{
    if(openSheet && snapPoints){
      sheetRef.current?.snapToIndex(2);
    }
  },[openSheet, snapPoints]);


  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  // const handleSheetChange = useCallback((index:number) => {
  //   console.log("handleSheetChange", index);
  // }, []);
  const handleSnapPress = useCallback((index:number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setOpenSheet(false);
  }, []);

  const onUntilChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setOpenDatePicker(false);
    setUntil(currentDate);
  }, []);

  const onHarvestDateChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setOpenDatePicker(false);
    setHarvestDate(currentDate);
  }, []);

  // render
  // const renderItem = useCallback(
  //   (item:any) => (
  //     <View key={item} style={styles.itemContainer}>
  //       <Text>{item}</Text>
  //     </View>
  //   ),
  //   []
  // );

  // Reset state of inputs
  const resetInputs = () => {
    setPrice(0);
    setCategory("Sell");
    setStocks(0);
    setArea_limit("");
    setMinimum_order(0);
    setDescription("");
    setPickUpLocation("");
    setUnit("kg");
    setModeOfDelivery("pick-up");
    setUntil(new Date());
    setHarvestDate(new Date());
  };

  // returns true if all required input requirements are met
  const allowSubmit = () => {
    if(!price || !stocks|| !minimum_order || !until || !unit ){
      return false;

    } 
    if(category=="Pre-Sell" && !harvestDate){
      return false;
    }
    if(modeOfDelivery=="pick-up" && !pickUpLocation){
      return false;
    }

    return true;
  }

  const [createProduct, {data:createProdLoading}] = useMutation(CREATE_PRODUCT,{
    refetchQueries:[GET_MY_PRODUCTS],
    onCompleted:()=>{
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: "Product created",
      });
      resetInputs();
      router.replace("/(tabs)/MyProducts/");
    }, 
    onError:(error)=>{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error Creating Product',
        text2: error?.message ?? "",
      });
    }
  });

  // Create Product but without the photo upload
  const executeCreateProduct = () => {
    createProduct({variables:{
      "product": {
        "category": category,
        "itemId": data?._id ,
        "product_description": description,
        "photo": "",
        "price": price ? parseFloat(price):0,
        "stocks": stocks? parseInt(stocks):0,
        "minimum_order": minimum_order ? parseFloat(minimum_order):0,
        "until":  until?.toISOString(),
        "area_limit": area_limit,
        "pickup_location":modeOfDelivery == "pick-up" ? pickUpLocation: "",
        "dateOfHarvest":category == "Pre-Sell" ? harvestDate?.toISOString():"",
        "modeOfDelivery": modeOfDelivery,
        "unit": unit,
      }
    }});
  };

  
  return (
    <View style={styles.container}>
      <BottomSheet
        style={{padding:10}}
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        // onChange={handleSheetChange}
        enablePanDownToClose={true}
        onClose={()=>{
          setOpenSheet(false);
          resetInputs();
        }}
      >
        {loading ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ActivityIndicator size={"large"}/>
          </View>
        ):null}

        {error ? (
          <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
            <Text>Error Loading Product Information</Text>
          </View>
        ):null}

        {data && !loading ? (<BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Avatar.Image size={100} source={{uri:data?.photo}} />
          </View>
          <Text variant="titleMedium" style={{textAlign:"center"}}>
          {!data.name.tagalog ? data.name.english : `${data.name.tagalog} | ${data.name.english}`} ({data.type})
          </Text>
        {/* <Button title="Close" onPress={() => handleClosePress()} /> */}
          <View style={{padding:10}}>
            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={[
                {
                  value: 'Sell',
                  label: 'Sell',
                },
                {
                  value: 'Pre-Sell',
                  label: 'Pre-Sell',
                },
              ]}
            />
            {/* Price and Stocks */}
            <View style={{flex:1, flexDirection:"row", marginTop:12}}>
                <TextField
                  outlineStyle={{borderColor:"black"}}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.textInput,{flex:1}]}
                  label="Price"
                  value={price.toString()}
                  onChangeText={text => setPrice(text ? parseFloat(text):0)}
                />

                <TextField
                  outlineStyle={{borderColor:"black"}}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.textInput,{flex:1}]}
                  label="Stock"
                  value={stocks.toString()}
                  onChangeText={text => setStocks(text ? parseFloat(text):0)}
                />  
              
            </View>
            {/* MinOrder, unit,*/}
            <View style={{flex:1, flexDirection:"row"}}>
              <View style={{flex:1, flexDirection:"row", alignItems:"center", marginRight:10}}>
                <TextField
                  outlineStyle={{borderColor:"black"}}
                  mode="outlined"
                  style={[styles.textInput,{flex:1}]}
                  label="Unit"
                  value={unit}
                  readOnly={true}
                />
                
                <Menu
                  visible={openMenu}
                  onDismiss={()=>setOpenMenu(false)}
                  anchorPosition="bottom"
                  anchor={
                    <TouchableOpacity
                      onPress={()=>setOpenMenu(true)}
                      style={{
                        flex:1
                      }}
                      style={{
                        borderWidth:1, 
                        justifyContent:"center", 
                        alignItems:"center", 
                        height:50, 
                        width:30, 
                        marginTop:5,  
                        borderRadius:4
                      }}
                    >
                      <AntDesign name="caretdown" size={12} color="black" />
                    </TouchableOpacity>
                  }>
                    {data?.units.map(unit=>(
                      <Menu.Item key={unit} onPress={() => {
                        setUnit(unit);
                        setOpenMenu(false)
                        }} title={unit} />
                    ))}

                    {/* <Divider /> */}
                </Menu>
              </View>
              <TextField
                outlineStyle={{borderColor:"black"}}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.textInput,{flex:1}]}
                label="Minimum Order"
                value={minimum_order.toString()}
                onChangeText={text => setMinimum_order(text ? parseFloat(text):0)}
              />  
            </View>

            {/* Mode of Delivery */}
            <View style={{flex:1, flexDirection:"row"}}>
              <View style={[styles.textInput, {flex:1, flexDirection:"row", borderRadius:4, borderWidth:1, padding:10}]}>
                <View style={{flex:1, borderRightWidth:1, justifyContent:"center"}}>
                    <Text variant="" style={{textAlign:"center"}}>
                      Mode of Delivery
                    </Text>
                </View>
                <View style={{flex:2, flexDirection:"row", justifyContent:"space-evenly"}}>
                  <RadioButton.Group 
                    onValueChange={newValue => setModeOfDelivery(newValue)} 
                    value={modeOfDelivery}
                    style={{flexDirection:"row"}}
                  >
                    <View style={{flex:1, flexDirection:"row"}}>
                      <View style={{marginHorizontal:10}}>
                        <Text>Pick-up</Text>
                        <RadioButton value="pick-up" />
                      </View>
                      <View style={{marginHorizontal:10}}>
                        <Text>Delivery</Text>
                        <RadioButton value="delivery" />
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
            </View>

            {/* Area Limit */}
            <View style={{flex:1, flexDirection:"row"}}>
              <TextField
                outlineStyle={{borderColor:"black"}}
                mode="outlined"
                style={[styles.textInput,{flex:1}]}
                label="Area Limit"
                value={area_limit}
                onChangeText={text => setArea_limit(text)}
              />
            </View>

            {/* Until */}
            <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
              <TouchableOpacity
                style={[styles.textInput,{flex:1}]}
                onPress={()=>setOpenDatePicker("until")}
              >
                <TextField
                  outlineStyle={{borderColor:"black"}}
                  mode="outlined"
                  label="Time Limit"
                  value={formatDate(until, "LL")}
                  editable={false}
                />
              </TouchableOpacity>
              {openDatePicker == "until" ? (<DateTimePicker
                testID="dateTimePicker"
                value={until}
                mode={"date"}
                is24Hour={true}
                onChange={onUntilChange}
              />):null}
            </View>
            
            {/* Harvest Date */}
            {category == "Pre-Sell" ?(<View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
              <TouchableOpacity
                style={[styles.textInput,{flex:1}]}
                onPress={()=>setOpenDatePicker("harvestDate")}
              >
                <TextField
                  outlineStyle={{borderColor:"black"}}
                  mode="outlined"
                  label="Date of Harvest"
                  value={formatDate(harvestDate, "LL")}
                  editable={false}
                />
              </TouchableOpacity>
               
              {openDatePicker == "harvestDate" ? (<DateTimePicker
                testID="dateTimePicker"
                value={harvestDate}
                mode={"date"}
                is24Hour={true}
                onChange={onHarvestDateChange}
              />):null}

            </View>):null}

            {/* Pickup Location */}
            {modeOfDelivery == "pick-up" ? (<View style={{flex:1, flexDirection:"row"}}>
              <TextField
                outlineStyle={{borderColor:"black"}}
                mode="outlined"
                style={[styles.textInput,{flex:1}]}
                label="Pick-up Location"
                value={pickUpLocation}
                onChangeText={text => setPickUpLocation(text)}
              />  
            </View>):null}

            {/* Description */}
            <View style={{flex:1, flexDirection:"row"}}>
              <TextField
                outlineStyle={{borderColor:"black"}}
                mode="outlined"
                style={[styles.textInput, {flex:1, height:80}]}
                label="Description"
                value={description}
                onChangeText={text => setDescription(text)}
                multiline={true}
              />

            </View>

            <View style={{flex:1, marginBottom:40, marginTop:20, flexDirection:"row"}}>
              <Button
                buttonColor="green"
                textColor="white"
                onPress={()=>{
                  executeCreateProduct();
                }}
                style={{margin:5, padding:4, flex:1}}
                disabled={!allowSubmit()}
                loading={createProdLoading}
              >
                Add Product
              </Button>
              <Button
              buttonColor="red"
              textColor="white"
              onPress={()=>{handleClosePress()}}
              style={{margin:5, padding:4, flex:1}}
              >
                Cancel
              </Button>
            </View>
          </View>
          {/* {data.map(renderItem)} */}
        </BottomSheetScrollView>):null}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position:"absolute",
    width:"100%",
    height:"100%",
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
    paddingTop:10
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  textInput:{
    
    marginVertical: 8,
    marginHorizontal:4,
  }
});

export default AddProductBottomSheet;