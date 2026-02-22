import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const PROJECTS = [
    { id: 1, title: 'Quantum Engine', desc: 'A real-time synchronization backend built on Node.js.' },
    { id: 2, title: 'Neon UI', desc: 'A modern design system emphasizing glowing aesthetics.' },
    { id: 3, title: 'Nebula App', desc: 'Cross-platform mobile application powered by React Native.' },
];

export default function Projects() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Projects</Text>
                <View style={styles.grid}>
                    {PROJECTS.map((proj, index) => (
                        <Animated.View key={proj.id} entering={FadeInUp.delay(index * 200)} style={styles.card}>
                            <Text style={styles.cardTitle}>{proj.title}</Text>
                            <Text style={styles.cardDesc}>{proj.desc}</Text>
                            <Pressable style={styles.button}>
                                <Text style={styles.buttonText}>View Source</Text>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    content: { padding: 30 },
    header: {
        fontSize: 40, fontWeight: 'bold', color: '#8A2BE2', marginBottom: 30,
        textShadowColor: 'rgba(138, 43, 226, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
    },
    grid: { gap: 20 },
    card: {
        backgroundColor: '#111', padding: 20, borderRadius: 10,
        borderWidth: 1, borderColor: 'rgba(0, 240, 255, 0.2)',
    },
    cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#00F0FF', marginBottom: 10 },
    cardDesc: { fontSize: 16, color: '#AAA', marginBottom: 20 },
    button: {
        backgroundColor: 'rgba(0, 240, 255, 0.1)', alignSelf: 'flex-start',
        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5,
        borderWidth: 1, borderColor: '#00F0FF',
    },
    buttonText: { color: '#FFF', fontWeight: 'bold' }
});
