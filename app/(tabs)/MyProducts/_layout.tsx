import { Stack } from 'expo-router';
import CustomHeader from '../../../constants/CustomHeader'; 

import MyProductsHeader from "../../../components/FarmerSide (MyProducts)/MyProductsHeader";

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: false,
                // header: () => <MyProductsHeader />
              }}
            />
        </Stack>
    );
};

export default StackLayout;
