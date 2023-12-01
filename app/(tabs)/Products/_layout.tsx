import { Stack } from 'expo-router';

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Market Products',
                    headerShown:false
                }}
            />
             <Stack.Screen
                name="[productid]"
                options={{
                    headerShown:false,
                    // headerTitle: 'Products',
                    // headerBackVisible:true,
                }}
            />
        </Stack>
    );
};

export default StackLayout;
