import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

// Since we don't have real art assets yet, we'll use colored placeholders that fit the theme
const ARTWORKS = [
    { id: 1, title: 'Quantum Fluctuation', color: '#00F0FF' },
    { id: 2, title: 'Purple Nebula', color: '#8A2BE2' },
    { id: 3, title: 'Dark Matter', color: '#333333' },
    { id: 4, title: 'Neon Horizon', color: '#FF0055' },
];

export default function Art() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Art Gallery</Text>
                <Text style={styles.subtitle}>Where logic ends, creativity begins.</Text>
                <View style={styles.gallery}>
                    {ARTWORKS.map((art, index) => (
                        <Animated.View key={art.id} entering={ZoomIn.delay(index * 150)} style={styles.artCard}>
                            <View style={[styles.canvas, { backgroundColor: art.color }]} />
                            <Text style={styles.artTitle}>{art.title}</Text>
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
        fontSize: 40, fontWeight: 'bold', color: '#FFF',
        textShadowColor: 'rgba(255, 255, 255, 0.5)', textShadowRadius: 10,
    },
    subtitle: { color: '#AAA', fontSize: 18, marginBottom: 30, fontStyle: 'italic' },
    gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    artCard: {
        width: '100%', maxWidth: 350, backgroundColor: '#111',
        borderRadius: 8, padding: 15, borderWidth: 1, borderColor: '#333',
    },
    canvas: { height: 200, borderRadius: 8, marginBottom: 15, opacity: 0.8 },
    artTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
