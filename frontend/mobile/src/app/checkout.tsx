import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ScreenState } from '../components/ui/ScreenState';
import { colors, radius, spacing, typography } from '../constants/tokens';
import { queryClient } from '../lib/query-client';
import { getApiErrorMessage } from '../services/api';
import { checkout, createAddress, getAddresses, getCart } from '../services/commerce';
import { useAuthStore } from '../stores/auth-store';
import { formatPrice } from '../utils/format';

const emptyAddress = { title: '', city: '', district: '', line1: '', postal_code: '' };

export default function CheckoutScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState(emptyAddress);
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: getAddresses, enabled: isAuthenticated });
  const cart = useQuery({ queryKey: ['cart'], queryFn: getCart, enabled: isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace({ pathname: '/login', params: { returnTo: '/checkout' } });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedAddressId && addresses.data?.length) setSelectedAddressId(addresses.data[0].id);
  }, [addresses.data, selectedAddressId]);

  const addressMutation = useMutation({
    mutationFn: () => createAddress(address),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setAddress(emptyAddress);
    },
  });
  const orderMutation = useMutation({
    mutationFn: () => checkout(selectedAddressId as number),
    onSuccess: (order) => {
      queryClient.setQueryData(['cart'], { items: [], subtotal: 0 });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.replace({ pathname: '/order-confirm/[id]', params: { id: String(order.id) } });
    },
  });

  if (!isAuthenticated) return <ScreenState loading title="Giriş sayfasına yönlendiriliyor" />;
  if (addresses.isLoading || cart.isLoading) return <ScreenState loading title="Ödeme hazırlanıyor" />;
  if (addresses.isError || cart.isError) {
    return (
      <ScreenState
        title="Ödeme bilgileri yüklenemedi"
        message="Sepet ve adres bilgileri alınırken bir sorun oluştu."
        actionTitle="Tekrar dene"
        onAction={() => {
          void addresses.refetch();
          void cart.refetch();
        }}
      />
    );
  }
  if (!cart.data?.items.length) {
    return <ScreenState title="Sepetiniz boş" actionTitle="Ürünlere dön" onAction={() => router.replace('/')} />;
  }

  const addressValid = address.title.trim().length >= 2
    && address.city.trim().length >= 2
    && address.district.trim().length >= 2
    && address.line1.trim().length >= 5;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Teslimat ve ödeme</Text>
      <Text style={styles.sectionTitle}>Teslimat adresi</Text>
      {addresses.data?.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => setSelectedAddressId(item.id)}
          style={[styles.address, selectedAddressId === item.id && styles.addressSelected]}
        >
          <View style={[styles.radio, selectedAddressId === item.id && styles.radioSelected]} />
          <View style={styles.addressText}>
            <Text style={styles.addressTitle}>{item.title}</Text>
            <Text style={styles.addressLine}>{item.line1}, {item.district}/{item.city}</Text>
          </View>
        </Pressable>
      ))}
      <Button
        title={showAddressForm ? 'Adres formunu kapat' : 'Yeni adres ekle'}
        variant="secondary"
        onPress={() => setShowAddressForm((value) => !value)}
      />
      {showAddressForm ? (
        <View style={styles.form}>
          <Input label="Adres başlığı" value={address.title} onChangeText={(title) => setAddress((value) => ({ ...value, title }))} placeholder="Ev" />
          <Input label="Şehir" value={address.city} onChangeText={(city) => setAddress((value) => ({ ...value, city }))} />
          <Input label="İlçe" value={address.district} onChangeText={(district) => setAddress((value) => ({ ...value, district }))} />
          <Input label="Açık adres" value={address.line1} onChangeText={(line1) => setAddress((value) => ({ ...value, line1 }))} multiline />
          <Input label="Posta kodu" value={address.postal_code} onChangeText={(postal_code) => setAddress((value) => ({ ...value, postal_code }))} keyboardType="number-pad" />
          {addressMutation.isError ? <Text style={styles.error}>{getApiErrorMessage(addressMutation.error)}</Text> : null}
          <Button title="Adresi kaydet" loading={addressMutation.isPending} disabled={!addressValid} onPress={() => addressMutation.mutate()} />
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>Ödeme</Text>
      <View style={styles.payment}>
        <Text style={styles.paymentTitle}>Güvenli demo ödeme</Text>
        <Text style={styles.paymentText}>Kart bilgisi alınmaz. Backend yalnızca “simulation” ödeme yöntemini kabul eder.</Text>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Toplam</Text>
        <Text style={styles.summaryTotal}>{formatPrice(cart.data.subtotal)}</Text>
      </View>
      {orderMutation.isError ? <Text style={styles.error}>{getApiErrorMessage(orderMutation.error)}</Text> : null}
      <Button
        title="Siparişi tamamla"
        fullWidth
        size="lg"
        loading={orderMutation.isPending}
        disabled={!selectedAddressId}
        onPress={() => orderMutation.mutate()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[16], paddingBottom: spacing[48], backgroundColor: colors.brand.white },
  title: { ...typography.heading[28], color: colors.text.primary, marginVertical: spacing[16] },
  sectionTitle: { ...typography.heading[18], color: colors.text.primary, marginTop: spacing[24], marginBottom: spacing[12] },
  address: { flexDirection: 'row', alignItems: 'center', gap: spacing[12], padding: spacing[16], marginBottom: spacing[8], borderWidth: 1, borderColor: colors.border.light, borderRadius: radius[8] },
  addressSelected: { borderColor: colors.brand.teal, backgroundColor: colors.brand.cream },
  radio: { width: 18, height: 18, borderRadius: radius.full, borderWidth: 2, borderColor: colors.shade[40] },
  radioSelected: { borderWidth: 5, borderColor: colors.brand.teal },
  addressText: { flex: 1 },
  addressTitle: { ...typography.body[16], fontWeight: '600', color: colors.text.primary },
  addressLine: { ...typography.body[13], color: colors.text.secondary, marginTop: spacing[4] },
  form: { marginTop: spacing[16], padding: spacing[16], borderRadius: radius[8], backgroundColor: colors.brand.cream },
  payment: { padding: spacing[16], borderWidth: 1, borderColor: colors.border.light, borderRadius: radius[8] },
  paymentTitle: { ...typography.body[16], fontWeight: '600', color: colors.text.primary },
  paymentText: { ...typography.body[13], color: colors.text.secondary, lineHeight: 20, marginTop: spacing[4] },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing[24] },
  summaryLabel: { ...typography.heading[18], color: colors.text.primary },
  summaryTotal: { ...typography.heading[24], color: colors.brand.teal },
  error: { ...typography.body[13], color: '#b42318', marginVertical: spacing[8] },
});
