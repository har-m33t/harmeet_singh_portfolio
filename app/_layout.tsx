import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

import { useColorScheme } from '@/hooks/use-color-scheme';

function CustomHeader() {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.logo}>Harmeet<Text style={styles.logoAccent}>.Singh</Text></Text>
      </Pressable>
      <View style={styles.navLinks}>
        <Pressable onPress={() => router.push('/about')} style={styles.navLink}><Text style={styles.navText}>About</Text></Pressable>
        <Pressable onPress={() => router.push('/projects')} style={styles.navLink}><Text style={styles.navText}>Projects</Text></Pressable>
        <Pressable onPress={() => router.push('/work')} style={styles.navLink}><Text style={styles.navText}>Work</Text></Pressable>
        <Pressable onPress={() => router.push('/art')} style={styles.navLink}><Text style={styles.navText}>Art</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoAccent: {
    color: '#00F0FF',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  navLink: {
    padding: 5,
  },
  navText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  return (
    <ThemeProvider value={DarkTheme}>
      {!isReady && <LoadingScreen onFinish={() => setIsReady(true)} />}
      <Stack
        screenOptions={{
          header: () => <CustomHeader />,
          contentStyle: { backgroundColor: '#0A0A0A' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
        <Stack.Screen name="projects" />
        <Stack.Screen name="work" />
        <Stack.Screen name="art" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
