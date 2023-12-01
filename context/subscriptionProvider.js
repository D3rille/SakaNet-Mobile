import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_NOTIFICATIONS, NOTIF_SUB } from '../graphql/operations/notification';
import {UPDATE_CONVO_COUNT, GET_UNREAD_CONVO} from "../graphql/operations/chat";
import {GET_CART_ITEMS} from "../graphql/operations/cart";
import { GET_MY_PROFILE } from '../graphql/operations/profile';
import { useAuth } from './auth.js';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const { subscribeToMore, data } = useQuery(GET_NOTIFICATIONS);
  const {data:profileInfo, loading:myProfileLoading} = useQuery(GET_MY_PROFILE);
  const {data:unreadConvoData, loading:unreadConvoLoading, subscribeToMore:subscribeToNewConvo} = useQuery(GET_UNREAD_CONVO);
  const {data:cartData, loading:cartLoading} = useQuery(GET_CART_ITEMS);
  
  const [newNotifCount, setNewNotifCount] = useState(0);
  const [newConvoCount, setNewConvoCount] = useState(0);
  // const [cartItemsCount, setCartItemsCount] = useState(0);

  const profile = profileInfo?.getMyProfile;
  const cart = cartData?.getCartItems;
  const cartItemsCount = cart?.length;
  // console.log(cartItemsCount);
  // console.log(cart.length)
  
  useEffect(()=>{
    subscribeToMore({
      document:NOTIF_SUB,
      variables:{receiverId:user?.id ?? ""},
      updateQuery:(prev, {subscriptionData})=>{
        if(!subscriptionData.data) return prev;
        const newNotif = subscriptionData.data.newNotification;
        return Object.assign({}, prev, {
          getNotifications: [newNotif, ...prev.getNotifications]
        });
      }
    });
  }, []);

  useEffect(()=>{
    subscribeToNewConvo({
      document:UPDATE_CONVO_COUNT,
      variables:{receiverId:user?.id ?? ""},
      updateQuery:(prev, {subscriptionData})=>{
        if(!subscriptionData.data) return prev;
        const newConvo = subscriptionData.data.updateConversationCount;
        if(prev.getUnreadConversations.includes(newConvo.convoId)){
          return prev
        } else{
          return Object.assign({}, prev, {
            getUnreadConversations: [...prev.getUnreadConversations, newConvo.convoId]
          });
        } 
      }
    });
  }, []);

useEffect(()=>{
  if(unreadConvoData){
    var count = unreadConvoData.getUnreadConversations.length;
    setNewConvoCount(count);
  }
}, [unreadConvoData, unreadConvoLoading, subscribeToNewConvo])

if(data){
  var notifData = {
    getNotifications:[...new Set(data.getNotifications)]
  }

}

useEffect(()=>{
  setNewNotifCount(()=>{
    var count=0;
    notifData ? notifData?.getNotifications?.map((notification)=>{
      if(notification.read == false){
        count++;
      }
    }):null;
    return count;
  })
}, [notifData]);

// useEffect(()=>{
//   setCartItemsCount(()=>{
//     var count = 0;
//     if(cartData && cartData?.GET_CART_ITEMS){
//       count = cart.length;
//     }
//     return count
//   });
// },[cart]);
  
  return (
    <SubscriptionContext.Provider value={{notifData, newNotifCount,newConvoCount, profile, cart,cartLoading, cartItemsCount}}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubs = () => {
  return useContext(SubscriptionContext);
};
