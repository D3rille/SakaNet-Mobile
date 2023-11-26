//@ts-nocheck
import { View, FlatList,StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from "@apollo/client";
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Text } from 'react-native-paper';

import HeadTabs from '../../../components/Orders/headTabs';
import OrderItem from '../../../components/Orders/orderItem';
import { useAuth } from '../../../context/auth';
import {
    GET_ORDERS, 
    UPDATE_STATUS, 
    CANCEL_ORDER, 
    DECLINE_ORDER, 
    SEND_SELLER_PAYMENT_CHANNELS,
    RETURN_STOCK
   } from "../../../graphql/operations/order";
import {GET_MY_PRODUCTS} from "../../../graphql/operations/product";

const Orders = () => {
    const {user} = useAuth();
    //Pending, Accepted, For Completion, Completed
    const [status, setStatus] = useState("Pending");
    const [activeIndex, setActiveIndex] = useState(0);

    const {data, loading, error, fetchMore:fetchMoreOrders, refetch:refetchOrders} = useQuery(GET_ORDERS,{
        variables:{
            status:status,
            limit: 10,
            cursor:null
        },
        onError:(error)=>{
            console.log(error);
        }
    });

    useEffect(()=>{
      if(data){
        refetchOrders();
      }
    },[data]);
    
    const handleGetMoreOrders = () =>{
        if(data?.getOrders?.hasNextPage){
          fetchMoreOrders({
            variables:{
              status:status,
              limit:10,
              cursor:data?.getOrders?.endCursor
            },
            onError:(error:any)=>{
              Toast.show({
                type:"error",
                text1: "Something went wrong",
                text2: error?.message
              });
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                getOrders: {
                  ...prev.getOrders,
                  endCursor:fetchMoreResult?.getOrders?.endCursor,
                  hasNextPage: fetchMoreResult?.getOrders?.hasNextPage,
                  orders:[...prev?.getOrders?.orders, ...fetchMoreResult?.getOrders?.orders],
                }
              });
              
            },
          })
        }
    }

    const [updateStatus] = useMutation(UPDATE_STATUS, {
        onError:(error)=>{
            Toast.show({
                type:"error",
                text1:"Something went wrong",
                text2: error?.message
            });
        }
    });

    const [sendSellerPaymentChannels] = useMutation(SEND_SELLER_PAYMENT_CHANNELS);

    const handleUpdateStatus = async (orderId, currentStatus, nextStatus, buyerId, modeOfPayment) => {
        await updateStatus({
            variables: {orderId},
            onCompleted:()=>{
              if(status == "Accepted" && modeOfPayment == "Online"){
                sendSellerPaymentChannels({
                  variables:{
                      buyerId
                  }
                });
              }
            },
            refetchQueries:[
            {
              query:GET_ORDERS,
              variables:{
                status:currentStatus,
                limit:10,
                cursor:null
              }
            },
            {
              query:GET_ORDERS,
              variables:{
                status:nextStatus,
                limit:10,
                cursor:null
              }
            }
          ],
        });
    };

    const [cancelOrder, {error:cancelOrderError}] = useMutation(CANCEL_ORDER, {
        onError:(error)=>{
           Toast.show({
            type:"error",
            text1:error?.message

           });
        }
    });

    const handleCancelOrder = (orderId) => {
        cancelOrder({
            variables: { orderId },
            refetchQueries:[
              {
                query:GET_ORDERS,
                variables:{
                  status:"Pending",
                  limit:10,
                  cursor:null
                }
              },
            ],
            // update: (cache) => {
            //   // Check if the query result exists in the cache
            //   const existingData = cache.readQuery({ query: GET_ORDERS});
            //   if (!existingData || !existingData.getOrders) {
            //     return;
            //   }
      
            //   // Fetch the existing data from the cache
            //   const { getOrders } = existingData;
      
            //   // Remove the canceled order from the cache
            //   const updatedOrders = getOrders.orders.filter((order) => order?._id != orderId);
      
            //   // Write the updated data back to the cache
            //   cache.writeQuery({
            //     query: GET_ORDERS,
            //     data: {
            //       getOrders: {
            //         ...getOrders,
            //         orders:updatedOrders
            //       },
            //     },
            //   });
            // },
          });
    };

    const [declineOrder, {error:declineOrderError}] = useMutation(DECLINE_ORDER, {
        refetchQueries:[GET_ORDERS],
        onError:(error)=>{
            Toast.show({
                type:"error",
                text1:error?.message
    
               });
        }
    });

    const handleDeclineOrder = async (orderId, reason) => {
        await declineOrder({
            variables: { orderId, reason },
            onCompleted:()=>{
              Toast.show({
                type:"success",
                text1:"Order Declined"
              })
            },
            update: (cache) => {
              // Check if the query result exists in the cache
              const existingData = cache.readQuery({ query: GET_ORDERS});
              if (!existingData || !existingData.getOrders) {
                return;
              }
      
              // Fetch the existing data from the cache
              const { getOrders } = existingData;
      
              // Remove the canceled order from the cache
              const updatedOrders = getOrders.orders.filter((order) => order?._id !== orderId);
      
              // Write the updated data back to the cache
              cache.writeQuery({
                query: GET_ORDERS,
                data: {
                  getOrders: {
                    ...getOrders,
                    orders:updatedOrders
                  },
                },
              });
            },
          });
    };

    const [returnStock] = useMutation(RETURN_STOCK);
    const handleReturnStock = (orderId, productId) => {
      returnStock({
        variables:{
          orderId,
          productId
        },
        refetchQueries:[GET_ORDERS, GET_MY_PRODUCTS],
        onCompleted:(data)=>{
            Toast.show({
                type:"success",
                text1: "Success",
                text2: data?.returnStock
            })
        },
        onError:(error)=>{
          Toast.show({
            type:"error",
            text1: error?.message
          })
        }
      })
    }

    if(loading){
        return(
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <ActivityIndicator size="large" />
            </View>
        );
    } 

    if(data && !loading){
        const ordersArr = data?.getOrders?.orders;
        return (
            <View>
                <HeadTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} setStatus={setStatus}/>
                {error && (
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <Text>Something went wrong, cannot load orders. Please try again.</Text>
                    </View>
                )}
                {data?.getOrders?.orders.length == 0 && (
                    <View style={{justifyContent:"center", alignItems:"center", padding:80}}>
                        <Text style={{textAlign:"center", color:"#c5c5c5"}} variant='headlineMedium'>No Orders</Text>
                    </View>
                )}
                
                <View style={styles.container}>
                    <FlatList
                        data={ordersArr}
                        renderItem={({item}) =>
                            <OrderItem 
                                status={status} 
                                order={item} 
                                role={user.role}
                                handleUpdateStatus = {handleUpdateStatus}
                                handleDeclineOrder = {handleDeclineOrder}
                                handleCancelOrder = {handleCancelOrder}
                                handleReturnStock = {handleReturnStock}
                            />
                        }
                        keyExtractor={item => item._id}
                        onEndReachedThreshold={0.1}
                        onEndReached={()=>handleGetMoreOrders()}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
     // flex:1,
     // alignItems:"center",
     // justifyContent:"center",
     paddingBottom:80
   },
   tabs:{
     height:100, 
     width:100
   }
   
 });

export default Orders;