import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../../components/ScreenLayout';
import { styled } from 'nativewind';
import { useAuth } from '../../context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

export default function LoginScreen() {
    const { signIn, isLoading } = useAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleGoogleLogin = async () => {
        setIsAuthenticating(true);

        // 1. Simulate Network Delay for Google Auth
        setTimeout(async () => {
            // 2. Mock Success -> Trigger Biometrics
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
                const biometricAuth = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Lumina Security: Confirm Identity',
                    fallbackLabel: 'Use Passcode',
                    disableDeviceFallback: false,
                });

                if (biometricAuth.success) {
                    // 3. Success -> Sign In Context
                    await signIn();
                } else {
                    Alert.alert('Security Alert', 'Biometric verification failed.');
                    setIsAuthenticating(false);
                }
            } else {
                // Fallback for simulators without FaceID
                Alert.alert('Dev Mode', 'No biometrics detected. Bypassing...');
                await signIn();
            }
        }, 1500);
    };

    return (
        <ScreenLayout className="justify-center items-center px-6">
            <View className="items-center mb-16">
                <StyledView className="w-20 h-20 bg-zinc-900 rounded-2xl items-center justify-center border border-zinc-800 mb-6 shadow-lg shadow-lumina-cyan/20">
                    <Ionicons name="finger-print" size={40} color="#00f0ff" />
                </StyledView>
                <StyledText className="text-white text-3xl font-bold tracking-[8px] mb-2">LUMINA</StyledText>
                <StyledText className="text-zinc-500 text-xs tracking-[4px] uppercase">Identity Verification</StyledText>
            </View>

            {/* Google Button */}
            {isAuthenticating ? (
                <View className="items-center">
                    <ActivityIndicator size="large" color="#00f0ff" />
                    <StyledText className="text-zinc-500 text-xs mt-4 animate-pulse">Establishing Secure Uplink...</StyledText>
                </View>
            ) : (
                <StyledTouchableOpacity
                    className="bg-white flex-row items-center w-full py-4 px-6 rounded-xl mb-4 shadow active:scale-95 transition-transform"
                    onPress={handleGoogleLogin}
                    activeOpacity={0.9}
                >
                    <AntDesign name="google" size={24} color="black" />
                    <StyledText className="text-black font-bold flex-1 text-center text-lg">Sign in with Google</StyledText>
                </StyledTouchableOpacity>
            )}

            {!isAuthenticating && (
                <StyledText className="text-zinc-700 text-[10px] mt-8 text-center max-w-[200px]">
                    By authenticating, you agree to the Lumina.OS biometric data policy.
                </StyledText>
            )}
        </ScreenLayout>
    );
}
