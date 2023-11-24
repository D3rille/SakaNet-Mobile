import { View, ScrollView, TextInput, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import { Dialog, Portal, Text, Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';

const DeclineOrderDialog = ({title, message, callback, visible, setVisible, reason, setReason}) => {
    
    const handleClose = () =>{
        setVisible(false);
    }   

    return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea style={{height:120}}>
            <Text>{message}</Text>
            <TextInput
                placeholder='Reason'
                style={styles.input}
                onChangeText={text => {
                  setReason(text)
                  if(reason.length <= 50){
                    setReason(text.substring(0,50));
                  } 
                }}
                value={reason}
            />
            <Text>{reason.length}/50</Text>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => handleClose()}>Cancel</Button>
          <Button onPress={() => {
            callback();
            handleClose();
          }}>Decline</Button>

        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
    input: {
        flex:1,
        height: 60,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})

export default DeclineOrderDialog