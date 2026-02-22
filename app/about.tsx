import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function About() {
    return (
        <ScrollView style={styles.container}>
            <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
                <Text style={styles.header}>About Me</Text>
                <Text style={styles.paragraph}>
                    I am a passionate developer traversing the <Text style={styles.accent}>Quantum Realm</Text> of software engineering. My mission is to build highly scalable, interactive, and aesthetically pleasing applications that push the boundaries of modern web and mobile logic.
                </Text>
                <Text style={styles.paragraph}>
                    From deep backend architecture with Node.js to dazzling frontends with React Native and Reanimated, I merge logical precision with creative chaos to deliver exceptional user experiences.
                </Text>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    content: {
        padding: 30,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#00F0FF',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 240, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    paragraph: {
        fontSize: 18,
        color: '#CCC',
        lineHeight: 28,
        marginBottom: 20,
    },
    accent: {
        color: '#8A2BE2',
        fontWeight: 'bold',
    },
});
