import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

const TIMELINE = [
    { id: 1, role: 'Senior Developer', company: 'Tech Corp', year: '2023 - Present', desc: 'Leading the mobile and web integration teams.' },
    { id: 2, role: 'Fullstack Engineer', company: 'StartUp Inc', year: '2020 - 2023', desc: 'Built robust Node.js APIs and interactive React frontends.' },
];

export default function Work() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Experience</Text>
                <View style={styles.timeline}>
                    {TIMELINE.map((item, index) => (
                        <Animated.View key={item.id} entering={FadeInLeft.delay(index * 200)} style={styles.timelineItem}>
                            <View style={styles.timelineNode} />
                            <View style={styles.timelineContent}>
                                <Text style={styles.year}>{item.year}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                                <Text style={styles.company}>{item.company}</Text>
                                <Text style={styles.desc}>{item.desc}</Text>
                            </View>
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
        fontSize: 40, fontWeight: 'bold', color: '#00F0FF', marginBottom: 40,
        textShadowColor: 'rgba(0, 240, 255, 0.5)', textShadowRadius: 10,
    },
    timeline: { borderLeftWidth: 2, borderLeftColor: '#333', paddingLeft: 20, marginLeft: 10 },
    timelineItem: { marginBottom: 30, position: 'relative' },
    timelineNode: {
        width: 16, height: 16, borderRadius: 8, backgroundColor: '#8A2BE2',
        position: 'absolute', left: -29, top: 4,
        shadowColor: '#8A2BE2', shadowRadius: 5, shadowOpacity: 1, elevation: 5,
    },
    timelineContent: { backgroundColor: '#111', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#222' },
    year: { color: '#00F0FF', fontWeight: 'bold', marginBottom: 5 },
    role: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    company: { fontSize: 16, color: '#8A2BE2', marginBottom: 10, fontWeight: '600' },
    desc: { color: '#AAA', lineHeight: 22 },
});
