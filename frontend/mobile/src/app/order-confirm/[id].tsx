import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { ScreenState } from '../../components/ui/ScreenState';
import { colors, radius, spacing, typography } from '../../constants/tokens';
import { getOrder } from '../../services/commerce';
import { formatPrice } from '../../utils/format';

export default function OrderConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), enabled: Boolean(id) });

  if (order.isLoading) return <ScreenState loading title="Sipariş yükleniyor" />;
  if (order.isError || !order.data) {
    return <ScreenState title="Sipariş görüntülenemedi" actionTitle="Ana sayfaya dön" onAction={() => router.replace('/')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.successMark}><Text style={styles.successText}>✓</Text></View>
      <Text style={styles.title}>Siparişiniz alındı</Text>
      <Text style={styles.subtitle}>Sipariş #{order.data.id} başarıyla oluşturuldu.</Text>
      <View style={styles.summary}>
        {order.data.items.map((item) => (
          <View key={item.product_id} style={styles.row}>
            <Text style={styles.item}>{item.product_name} × {item.quantity}</Text>
            <Text style={styles.itemTotal}>{formatPrice(item.line_total)}</Text>
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Genel toplam</Text>
          <Text style={styles.total}>{formatPrice(order.data.total_amount)}</Text>
        </View>
      </View>
      <Text style={styles.address}>{order.data.shipping_address}</Text>
      <Button title="Alışverişe devam et" fullWidth size="lg" onPress={() => router.replace('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', padding: spacing[24], paddingBottom: spacing[48], backgroundColor: colors.brand.white },
  successMark: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, backgroundColor: colors.accent.aloe, marginTop: spacing[32] },
  successText: { fontSize: 30, fontWeight: '700', color: colors.brand.teal },
  title: { ...typography.heading[28], color: colors.text.primary, textAlign: 'center', marginTop: spacing[16] },
  subtitle: { ...typography.body[14], color: colors.text.secondary, textAlign: 'center', marginTop: spacing[8] },
  summary: { width: '100%', padding: spacing[16], marginTop: spacing[24], borderWidth: 1, borderColor: colors.border.light, borderRadius: radius[8] },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing[12], paddingVertical: spacing[8] },
  item: { ...typography.body[14], flex: 1, color: colors.text.primary },
  itemTotal: { ...typography.body[14], fontWeight: '600', color: colors.text.primary },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border.light, marginTop: spacing[8], paddingTop: spacing[16] },
  totalLabel: { ...typography.heading[18], color: colors.text.primary },
  total: { ...typography.heading[20], color: colors.brand.teal },
  address: { ...typography.body[13], color: colors.text.secondary, textAlign: 'center', marginVertical: spacing[24] },
});
