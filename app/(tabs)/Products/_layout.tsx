import { Stack } from 'expo-router';

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Products'
                }}
            />
             <Stack.Screen
                name="[productid]"
                options={{
                    headerTitle: 'Products'
                }}
            />
        </Stack>
    );
};

export default StackLayout;
