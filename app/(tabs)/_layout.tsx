import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'blue',
            headerShown: false,
        }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Główna',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="Login"
                options={{
                    title: 'Logowanie',
                    tabBarIcon: ({ color }) => <SimpleLineIcons name="login" size={22} color="black" />,
                }}
            />
            <Tabs.Screen
                name="Register"
                options={{
                    title: 'Rejestracja',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="pencil" color={color} />,
                }}
            />
            <Tabs.Screen
                name="About"
                options={{
                    title: 'O nas',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="info" color={color} />,
                }}
            />
        </Tabs>
    );
}
