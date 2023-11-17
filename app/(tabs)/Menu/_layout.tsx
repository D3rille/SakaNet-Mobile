import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../../../constants/CustomHeader';
import Menu from './index';
import Settings from './Settings';
import Orders from './Orders';
import Groups from './Groups';
import MyProfile from './MyProfile'

const Stack = createNativeStackNavigator();

const MenuLayout = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Menu">
                <Stack.Screen
                    name="Menu"
                    component={Menu}
                    options={{
                        headerShown: true,
                        header: () => <CustomHeader />,
                    }}
                />
                <Stack.Screen name="MyProfile" component={MyProfile} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Orders" component={Orders} />
                <Stack.Screen name="Groups" component={Groups} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MenuLayout;
