import { Stack } from 'expo-router';

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'My Network'
                }}
            />
        </Stack>
    );
};

export default StackLayout;
