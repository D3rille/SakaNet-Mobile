import { View, ScrollView} from 'react-native'
import React from 'react'
import { Dialog, Portal, Text, Button } from 'react-native-paper';

const CustomDialog = ({title, message, btnDisplay, callback, visible, setVisible}) => {

    const handleClose = () =>{
        setVisible(false);
    }   

    const buttonDisplay = [
        ["Yes", "No"],
        ["Save", "Cancel"],
        ["Confirm", "Cancel"],
        ["Agree", "Disagree"]
    ];

    return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
            <Text>{message}</Text>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => {
            callback();
            handleClose();
          }}>{buttonDisplay[btnDisplay ?? 0][0]}</Button>
          <Button onPress={() => handleClose()}>{buttonDisplay[btnDisplay ?? 0][1]}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default CustomDialog