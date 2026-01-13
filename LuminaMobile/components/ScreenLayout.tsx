import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface ScreenLayoutProps {
    children: React.ReactNode;
    className?: string; // Allow overriding styles
}

export function ScreenLayout({ children, className }: ScreenLayoutProps) {
    return (
        <StyledView className="flex-1 bg-lumina-base">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className={`flex-1 ${className}`}>
                {children}
            </SafeAreaView>
        </StyledView>
    );
}
