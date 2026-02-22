import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    withDelay,
} from 'react-native-reanimated';

interface LoadingScreenProps {
    onFinish?: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );

        scale.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 1000, easing: Easing.ease }),
                withTiming(1, { duration: 1000, easing: Easing.ease })
            ),
            -1,
            true
        );

        // Auto-finish loading after 3 seconds for demonstration
        if (onFinish) {
            setTimeout(() => {
                opacity.value = withTiming(0, { duration: 500 }, () => {
                    // You would typically call onFinish on JS thread using runOnJS but for simplicity in web compatibility we can trust setTimeout here.
                });
                setTimeout(onFinish, 500);
            }, 3000);
        }
    }, []);

    const animatedRingStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
        };
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.quantumCore}>
                <Animated.View style={[styles.ring, animatedRingStyle, styles.ring1]} />
                <Animated.View style={[styles.ring, animatedRingStyle, styles.ring2]} />
            </View>
            <Text style={styles.loadingText}>Initializing Quantum Link...</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#050505',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        elevation: 9999,
    },
    quantumCore: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    ring1: {
        width: 100,
        height: 100,
        borderColor: '#00F0FF',
        transform: [{ rotateX: '60deg' }],
    },
    ring2: {
        width: 120,
        height: 120,
        borderColor: '#8A2BE2',
        transform: [{ rotateY: '60deg' }],
    },
    loadingText: {
        marginTop: 40,
        color: '#00F0FF',
        fontSize: 16,
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});
