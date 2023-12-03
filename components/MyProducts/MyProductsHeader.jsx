import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { COLORS, SIZES } from '../../constants/index';

const MyProductsHeader = ({handleSortPress, handleFilterChange, setSearchFocus, searchProduct}) => {
  return (
    <View style={{paddingVertical:10}}>
      <View style={styles.searchAndSortSection}>
        {/* <TouchableOpacity style={styles.sortBtn} onPress={(event)=>{searchProduct()}}>
          <Icon name="search" size={30} color={'white'} />
        </TouchableOpacity> */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={25} style={{ marginLeft: 20 }} />
          <TextInput 
          placeholder="Search" 
          style={styles.input}
          onChange={text=>handleFilterChange(text)} 
          onFocus={()=>setSearchFocus(true)}
          onBlur={()=> setSearchFocus(false)}
          />
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={()=>handleSortPress()}>
          <Icon name="filter" size={30} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
      width: 40,
      height: 40,
      backgroundColor: COLORS.green,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft: 10,
    },
  });

export default MyProductsHeader