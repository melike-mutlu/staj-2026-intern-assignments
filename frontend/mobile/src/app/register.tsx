import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { colors, radius, spacing, typography } from '../constants/tokens';
import { getApiErrorMessage } from '../services/api';
import { register } from '../services/auth';
import { useAuthStore } from '../stores/auth-store';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: () => register(fullName.trim(), email.trim(), password),
    onSuccess: async (session) => {
      await setSession(session);
      router.replace('/');
    },
  });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.panel}>
          <Text style={styles.title}>Hesap oluştur</Text>
          <Text style={styles.subtitle}>Sepetiniz ve siparişleriniz web ile aynı backend üzerinden eşitlenir.</Text>
          <Input label="Ad soyad" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
          <Input label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Input label="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
          {mutation.isError ? <Text style={styles.error}>{getApiErrorMessage(mutation.error)}</Text> : null}
          <Button
            title="Hesabı oluştur"
            fullWidth
            size="lg"
            loading={mutation.isPending}
            disabled={fullName.trim().length < 2 || !email.includes('@') || password.length < 8}
            onPress={() => mutation.mutate()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.brand.white },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing[16] },
  panel: { padding: spacing[24], borderWidth: 1, borderColor: colors.border.light, borderRadius: radius[8] },
  title: { ...typography.heading[28], color: colors.text.primary },
  subtitle: { ...typography.body[14], color: colors.text.secondary, lineHeight: 21, marginTop: spacing[8], marginBottom: spacing[24] },
  error: { ...typography.body[13], color: '#b42318', marginBottom: spacing[12] },
});
