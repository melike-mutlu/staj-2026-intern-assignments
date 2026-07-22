import { useMutation } from '@tanstack/react-query';
import { Link, router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { colors, radius, spacing, typography } from '../constants/tokens';
import { queryClient } from '../lib/query-client';
import { getApiErrorMessage } from '../services/api';
import { login } from '../services/auth';
import { useAuthStore } from '../stores/auth-store';

export default function LoginScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [email, setEmail] = useState('demo@eticaret.com');
  const [password, setPassword] = useState('DemoPass123');
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: async (session) => {
      await setSession(session);
      await queryClient.invalidateQueries();
      router.replace((returnTo || '/') as Href);
    },
  });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.panel}>
          <Text style={styles.eyebrow}>SHOP HESABI</Text>
          <Text style={styles.title}>Tekrar hoş geldiniz</Text>
          <Text style={styles.subtitle}>Demo hesabı hazır. Doğrudan giriş yaparak kritik akışı deneyebilirsiniz.</Text>
          <Input label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Input label="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
          {mutation.isError ? <Text style={styles.error}>{getApiErrorMessage(mutation.error)}</Text> : null}
          <Button
            title="Giriş yap"
            fullWidth
            size="lg"
            loading={mutation.isPending}
            disabled={!email.trim() || password.length < 8}
            onPress={() => mutation.mutate()}
          />
          <Link href="/register" style={styles.link}>Yeni hesap oluştur</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.brand.white },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing[16] },
  panel: { padding: spacing[24], borderWidth: 1, borderColor: colors.border.light, borderRadius: radius[8] },
  eyebrow: { ...typography.body[12], fontWeight: '800', color: colors.brand.teal },
  title: { ...typography.heading[28], color: colors.text.primary, marginTop: spacing[8] },
  subtitle: { ...typography.body[14], color: colors.text.secondary, lineHeight: 21, marginTop: spacing[8], marginBottom: spacing[24] },
  error: { ...typography.body[13], color: '#b42318', marginBottom: spacing[12] },
  link: { ...typography.body[14], color: colors.brand.teal, textAlign: 'center', marginTop: spacing[24] },
});
