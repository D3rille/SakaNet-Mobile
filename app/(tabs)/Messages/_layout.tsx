import { Stack } from 'expo-router';
import CustomHeader from '../../../constants/CustomHeader'; 
import ChatsListHeader from '../../../components/Messages/ChatsListHeader';


const MessagesStack = () => {
    return (
        <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: true,
                header: () => <ChatsListHeader />
              }}
            />
            <Stack.Screen 
              name="ChatConversation" 
              options={{
                headerShown: true,
                // header: () => <CustomHeader />
              }}
            />
            <Stack.Screen 
              name="ChatDetails" 
              options={{
                headerShown: true,
                // header: () => <CustomHeader />
              }}
            />
        </Stack>
    );
};

export default MessagesStack;