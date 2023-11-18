import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../../../constants/CustomHeader'; 
import Messages from './index';
import ChatConversation from './ChatConversation';
import ChatDetails from './ChatDetails';

const Stack = createNativeStackNavigator();

const MessagesLayout = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Messages">
                <Stack.Screen
                    name="Messages"
                    component={Messages}
                    options={{
                        headerShown: false,
                        header: () => <CustomHeader />,
                    }}
                />
                <Stack.Screen name="ChatConversation" component={ChatConversation}      
                options={{headerShown: false, }} />
                <Stack.Screen name="ChatDetails" component={ChatDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MessagesLayout;
