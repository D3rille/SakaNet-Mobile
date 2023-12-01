import { Stack } from 'expo-router';
import CustomHeader from '../../../constants/CustomHeader'; 


const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen 
              name="index"
              options={{
                headerShown:false
              }} 
              // options={{
              //   headerShown: true,
              //   header: () => <CustomHeader />
              // }}
            />
            <Stack.Screen 
              name="manageMyNetwork" 
              options={{
                headerShown: true,
                headerTitle:"My Network"
                // header: () => <CustomHeader />
              }}
            />
        </Stack>
    );
};

export default StackLayout;
