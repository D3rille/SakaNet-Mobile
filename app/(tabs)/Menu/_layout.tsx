import { Stack } from 'expo-router';
import CustomHeader from '../../../constants/CustomHeader'; 

//@ts-nocheck
const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: false,
                // header: () => <CustomHeader />
              }}
            />
            <Stack.Screen 
              name="MyProfile" 
              options={{
                headerShown: false,
              }}
            />
        </Stack>
    );
};

export default StackLayout;
