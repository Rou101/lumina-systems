import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: '#00f0ff',
                tabBarInactiveTintColor: '#52525b',
                tabBarBackground: () => (
                    <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
                ),
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: "Events",
                    tabBarIcon: ({ color }) => <Feather name="activity" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: "Bar",
                    tabBarIcon: ({ color }) => <Feather name="coffee" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
