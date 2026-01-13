import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const StyledView = styled(View);
const StyledText = styled(Text);

interface ScopeProps {
    delta: number;      // Rotation angle for the arrow
    distance: number;   // Meters
    targetName: string; // "Main Stage"
}

export function Scope({ delta, distance, targetName }: ScopeProps) {
    return (
        <StyledView className="items-center justify-center w-64 h-64 relative">
            {/* Outer Ring */}
            <StyledView className="absolute inset-0 border-2 border-emerald-900 rounded-full opacity-50" />

            {/* Inner Ring (Pulsing) */}
            <StyledView className="absolute w-56 h-56 border border-emerald-500/30 rounded-full" />
            <StyledView className="absolute w-40 h-40 border border-emerald-500/10 rounded-full" />

            {/* Crosshairs */}
            <StyledView className="absolute w-full h-[1px] bg-emerald-900/50" />
            <StyledView className="absolute h-full w-[1px] bg-emerald-900/50" />

            {/* Distance Label */}
            <StyledView className="absolute -top-12 items-center">
                <StyledText className="text-emerald-400 font-bold text-3xl font-mono tracking-tighter">{distance}m</StyledText>
                <StyledText className="text-emerald-800 text-[10px] uppercase font-bold tracking-widest">{targetName}</StyledText>
            </StyledView>

            {/* The Arrow (Rotates based on Delta) */}
            <StyledView
                style={{ transform: [{ rotate: `${delta}deg` }] }}
                className="absolute w-full h-full items-center justify-start py-4"
            >
                <Ionicons name="caret-up" size={40} color="#10b981" />
            </StyledView>

            {/* Bottom Decoration */}
            <StyledView className="absolute bottom-4 flex-row gap-1">
                <View className="w-1 h-1 bg-emerald-500 rounded-full" />
                <View className="w-1 h-1 bg-emerald-500 rounded-full opacity-50" />
                <View className="w-1 h-1 bg-emerald-500 rounded-full opacity-20" />
            </StyledView>
        </StyledView>
    );
}
