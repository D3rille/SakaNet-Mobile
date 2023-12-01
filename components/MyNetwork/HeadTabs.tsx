//@ts-nocheck
import {useRef, useState} from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { sakanetGreen } from "../../constants/Colors";

const HeadTabs = ({setTab, activeIndex, setActiveIndex}) => {
    const tabs = ["My Connections", "Groups You Manage", "Joined Groups"];
    const scrollRef = useRef(null);
    const itemsRef = useRef(tabs);
    // const [activeIndex, setActiveIndex] = useState(0);
    

    const selectTab = (index) => {
      const selected = itemsRef.current[index];
    
      if (selected) {
        const interval = setInterval(() => {
          selected.measure((x) => {
            if (x > 0) {
              scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
              clearInterval(interval);
            }
          });
        }, 50);
      }
    
      setActiveIndex(index);
    };

  return (
    <View style={{padding:10}}>
       <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => {
                selectTab(index);
                setTab(tab);
                }}>
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      height: 130,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: {
        width: 1,
        height: 10,
      },
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
  
    searchBtn: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      gap: 10,
      padding: 14,
      alignItems: 'center',
      width: 280,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#c2c2c2',
      borderRadius: 30,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 1,
        height: 1,
      },
    },
    filterBtn: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#A2A0A2',
      borderRadius: 24,
    },
    categoryText: {
      fontSize: 18,
    //   fontFamily: 'mon-sb',
      color: "grey",
    },
    categoryTextActive: {
      fontSize: 18,
    //   fontFamily: 'mon-sb',
      color: sakanetGreen,
    },
    categoriesBtn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 8,
      paddingHorizontal:8,
      paddingTop:4
    },
    categoriesBtnActive: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: sakanetGreen,
      borderBottomWidth: 2,
      paddingBottom: 8,
      paddingHorizontal:8,
      paddingTop:4
      
    },
  });
  

export default HeadTabs