import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={styles.heroSection}>
                <Text style={styles.heroTitle}>Harmeet Singh</Text>
                <Text style={styles.heroSubtitle}>Entering the <Text style={styles.accent}>Quantum Realm</Text> of Development</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(1000).delay(600)} style={styles.ctaSection}>
                <Pressable style={styles.button} onPress={() => router.push('/projects')}>
                    <Text style={styles.buttonText}>View Projects</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => router.push('/about')}>
                    <Text style={styles.buttonText}>About Me</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    heroTitle: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 240, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    heroSubtitle: {
        fontSize: 20,
        color: '#CCC',
        textAlign: 'center',
    },
    accent: {
        color: '#00F0FF',
        fontWeight: 'bold',
    },
    ctaSection: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        shadowColor: '#00F0FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        borderColor: '#8A2BE2',
        shadowColor: '#8A2BE2',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
