import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../constants/tokens';
import { Button } from '../../components/ui/Button';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to SHOP</Text>
        <Text style={styles.subtitle}>Discover amazing products.</Text>
        <Button title="Shop Now" style={{ marginTop: spacing[16] }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.white,
  },
  hero: {
    padding: spacing[32],
    alignItems: 'center',
    backgroundColor: colors.brand.cream,
    margin: spacing[16],
    borderRadius: 20,
  },
  title: {
    ...typography.display[48],
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body[16],
    color: colors.text.secondary,
    marginTop: spacing[8],
    textAlign: 'center',
  },
});
