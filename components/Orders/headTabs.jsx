import {useRef, useState} from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const HeadTabs = ({handleChangeStatus}) => {
    const statuses = ["Pending", "Accepted", "For Completion", "Completed"];
    const scrollRef = useRef(null);
    const itemsRef = useRef(statuses);
    const [activeIndex, setActiveIndex] = useState(0);
    

    const selectCategory = (index) => {
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
    <View>
       <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}>
          {statuses.map((status, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => {
                  handleChangeStatus(status);
                  selectCategory(index);
                }}>
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {status}
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
      color: '#000',
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
      borderBottomColor: '#000',
      borderBottomWidth: 2,
      paddingBottom: 8,
      paddingHorizontal:8,
      paddingTop:4
      
    },
  });
  

export default HeadTabs