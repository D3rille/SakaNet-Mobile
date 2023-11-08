
 // @ts-nocheck
 import React, { useContext, useState } from 'react';
 import { View, Text, SafeAreaView, StyleSheet, Button, TextInput, ScrollView} from 'react-native';
 import {GET_AVAILABLE_PRODUCTS, GET_SUGGESTED_PRODUCT} from '../../../graphql/operations/product';
 import { Searchbar } from 'react-native-paper';
 import { useQuery, useLazyQuery } from '@apollo/client';
 import { ActivityIndicator, MD2Colors } from 'react-native-paper';
 import { AuthContext } from '../../../context/auth';
 import {Picker} from '@react-native-picker/picker';
 import { useLocalSearchParams } from 'expo-router';
 import { Image } from 'expo-image';
import SuggestedProducts from '../../../components/MarketProducts/SuggestedProducts';

 
 export default function App() {
   const [activeComponent, setActiveComponent] = useState('all');
   const { user } = useContext(AuthContext);
   const [productsType, setProductsType] = useState("Sell"); // Order or Preorder
   const [productsSortBy, setProductsSortBy] = useState("available"); // Available or Suggested Products
   const [deliveryFilter, setDeliveryFilter] = useState(""); // Delivery Filter
   const [priceRange, setPriceRange] = useState([0, 1000]); // Price Range Filter
   const [currentLocation, setCurrentLocation] = useState(""); // Area Limit Filter
   const [selectedDate, setSelectedDate] = useState(null); // Date Filter
   const [currentPage, setCurrentPage] = useState(1); // Pagination
   const [filters, setFilters] = useState({
     modeOfDelivery: "",
     area_limit: "",
     maxPrice: 1000,
     minPrice: 0,
     until: null,
   });
   const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const local = useLocalSearchParams(); //Product ID from Dynamic Route

  const { data, loading, error } = useQuery(GET_SUGGESTED_PRODUCT, {
        //Available Product
        variables: {
          category: "Sell",
          itemId: local.id,
          filter: filters,
          page: 1,
          limit: 6,
        },
      })

      if (loading) return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
      if (error) return <p>Error: {error.message}</p>;

      let suggestedProductData; 

      if (data && data.getSuggestedProducts) {
        suggestedProductData = data.getSuggestedProducts.product;
      }

   return (
     <SafeAreaView style={styles.container}> 
         <Picker
             selectedValue={productsSortBy}
             onValueChange={(itemValue, itemIndex) => {
                 setProductsSortBy(itemValue);
             }}
             >
             <Picker.Item label="Available Seller" value="available" />
             <Picker.Item label="Suggested Seller" value="suggested" />
         </Picker>
     <View style={styles.buttonContainer}>
         <View style={{ flex: 1 }}>
             <Button
             title="Order"
             onPress={() => setActiveComponent('all')}
             color={activeComponent === 'all' ? '#007BFF' : '#333'}
             />
         </View>
         <View style={{ flex: 1 }}>
             <Button
             title="Pre-Order"
             onPress={() => setActiveComponent('available')}
             color={activeComponent === 'available' ? '#007BFF' : '#333'}
             />
         </View>
         </View>
         <SuggestedProducts  product={suggestedProductData}/>
     </SafeAreaView>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ecf0f1',
     padding: 8,
     paddingBottom: 100,
   },
 
   header: {
     fontSize: 20,
     fontWeight: 'bold',
     textAlign: 'center',
     margin: 5,
   },
   userInfoContainer: {
    flexDirection: 'row', // This places the avatar and user info side by side
    alignItems: 'center', // This centers them vertically
  },


   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
   },
 });
 