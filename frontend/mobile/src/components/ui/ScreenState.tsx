import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../constants/tokens';
import { Button } from './Button';

interface ScreenStateProps {
  title: string;
  message?: string;
  loading?: boolean;
  actionTitle?: string;
  onAction?: () => void;
}

export function ScreenState({ title, message, loading, actionTitle, onAction }: ScreenStateProps) {
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color={colors.brand.teal} /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionTitle && onAction ? <Button title={actionTitle} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[12],
    padding: spacing[24],
  },
  title: { ...typography.heading[20], color: colors.text.primary, textAlign: 'center' },
  message: { ...typography.body[14], color: colors.text.secondary, textAlign: 'center' },
});
