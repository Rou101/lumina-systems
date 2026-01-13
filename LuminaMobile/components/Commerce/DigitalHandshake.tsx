import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Vibration } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DigitalHandshakeProps {
    orderId: string;
    customerName: string;
    onConfirmed: () => void;
}

export function DigitalHandshake({ orderId, customerName, onConfirmed }: DigitalHandshakeProps) {
    // Pulse Animation
    const pulseAnim = new Animated.Value(1);
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // Slider Logic
    const [slideComplete, setSlideComplete] = useState(false);
    const pan = new Animated.ValueXY();
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx > 0 && gestureState.dx < width - 100 && !slideComplete) {
                pan.setValue({ x: gestureState.dx, y: 0 });
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > width - 150) {
                // Configured!
                setSlideComplete(true);
                Vibration.vibrate(50);
                Animated.spring(pan, { toValue: { x: width - 80, y: 0 }, useNativeDriver: false }).start();
                setTimeout(onConfirmed, 500);
            } else {
                // Reset
                Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            }
        }
    });

    return (
        <View style={styles.container}>
            {/* Background Pulse */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
            <Animated.View style={[
                StyleSheet.absoluteFill,
                {
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    transform: [{ scale: pulseAnim }],
                    opacity: 0.5
                }
            ]} />

            <View style={styles.content}>
                <Text style={styles.label}>ORDER READY</Text>
                <Text style={styles.bigNumber}>#{orderId}</Text>
                <Text style={styles.name}>{customerName}</Text>

                <View style={styles.instructionBox}>
                    <Text style={styles.instruction}>SHOW TO RUNNER</Text>
                    <Text style={styles.subInstruction}>Visual Match Required</Text>
                </View>
            </View>

            {/* Slider */}
            <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                    <Text style={styles.sliderText}>SLIDE TO CONFIRM RECEIPT</Text>
                </View>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sliderKnob,
                        { transform: [{ translateX: pan.x }] },
                        slideComplete && { backgroundColor: '#10B981', width: width - 40 }
                    ]}
                >
                    <View style={styles.knobIcon}>
                        {slideComplete ? <Check color="#000" size={24} /> : <Text style={styles.arrow}>→</Text>}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    label: {
        color: '#10B981',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 4,
        marginBottom: 20,
    },
    bigNumber: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 120,
        textShadowColor: 'rgba(16, 185, 129, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    instructionBox: {
        marginTop: 40,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
    },
    instruction: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subInstruction: {
        color: '#aaa',
        fontSize: 10,
        textAlign: 'center',
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 50,
        width: width - 40,
        height: 60,
        backgroundColor: '#222',
        borderRadius: 30,
        justifyContent: 'center',
        padding: 5,
        overflow: 'hidden',
    },
    sliderTrack: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderText: {
        color: '#555',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    sliderKnob: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    knobIcon: {
        // Center icon
    },
    arrow: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});
