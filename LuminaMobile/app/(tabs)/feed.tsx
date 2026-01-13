import { View, Text } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { styled } from 'nativewind';

const StyledText = styled(Text);

export default function FeedScreen() {
    return (
        <ScreenLayout className="px-6 pt-12">
            <StyledText className="text-white text-2xl font-bold mb-6">Live Events</StyledText>
            <View className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
                <StyledText className="text-lumina-cyan font-bold mb-2">NEON NIGHTS</StyledText>
                <StyledText className="text-zinc-400 text-xs mb-4">Starts in 2 hours</StyledText>
                <StyledText className="text-white">Main Stage lineup confirmed. Prepare for the drop.</StyledText>
            </View>
        </ScreenLayout>
    );
}
