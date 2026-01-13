import { View } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { styled } from 'nativewind';
import { useCompass } from '../../hooks/useCompass';
import { Scope } from '../../components/AR/Scope';
import { Text } from 'react-native';

const StyledText = styled(Text);
const StyledView = styled(View);

// Target: Example Main Stage Coordinates (Simulated relative to user for now or hardcoded)
// We'll use a hardcoded target nearby for demo.
// In real app, this would come from route params or state.
const TARGET_LAT = -33.4372; // Santiago
const TARGET_LNG = -70.6506;

export default function FindScreen() {
    const { heading, bearing, delta, distance, error } = useCompass(TARGET_LAT, TARGET_LNG);

    return (
        <ScreenLayout className="items-center justify-center">
            <StyledView className="flex-1 items-center justify-center w-full relative">

                {/* Background Grid (Optional AR Feeling) */}
                <StyledView className="absolute inset-0 opacity-10 flex-row flex-wrap">
                    {/* Just a placeholder for camera feed or AR background */}
                </StyledView>

                <StyledView className="mb-12 items-center">
                    <StyledText className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-2">TARGET LOCK</StyledText>
                    <StyledText className="text-white text-xl font-bold font-mono tracking-widest">MAIN STAGE</StyledText>
                </StyledView>

                <Scope delta={delta} distance={distance} targetName="MAIN STAGE" />

                <StyledView className="mt-16 items-center space-y-2">
                    <StyledView className="flex-row gap-8">
                        <StyledView className="items-center">
                            <StyledText className="text-zinc-600 text-[9px] font-mono">HEADING</StyledText>
                            <StyledText className="text-zinc-400 font-mono">{heading}°</StyledText>
                        </StyledView>
                        <StyledView className="items-center">
                            <StyledText className="text-zinc-600 text-[9px] font-mono">BEARING</StyledText>
                            <StyledText className="text-zinc-400 font-mono">{Math.round(bearing)}°</StyledText>
                        </StyledView>
                    </StyledView>

                    {error && (
                        <StyledText className="text-red-500 text-xs mt-4 font-mono">{error}</StyledText>
                    )}
                </StyledView>

                <StyledText className="absolute bottom-8 text-zinc-700 text-[10px] text-center px-8">
                    Point your device to locate the target signal. Accuracy depends on sensor calibration.
                </StyledText>

            </StyledView>
        </ScreenLayout>
    );
}
