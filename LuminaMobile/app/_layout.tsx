import { Slot } from "expo-router";
// Import your global CSS file
import { View } from "react-native";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <View style={{ flex: 1, backgroundColor: '#050505' }}>
                <Slot />
            </View>
        </AuthProvider>
    );
}
