import { Stack } from 'expo-router';
import CustomHeader from '../../../constants/CustomHeader'; 


const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: true,
                header: () => <CustomHeader />
              }}
            />
        </Stack>
    );
};

export default StackLayout;
