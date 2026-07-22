import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { ScreenState } from '../../components/ui/ScreenState';
import { colors, radius, spacing, typography } from '../../constants/tokens';
import { getOrders } from '../../services/commerce';
import { useAuthStore } from '../../stores/auth-store';
import { formatDate, formatPrice } from '../../utils/format';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const orders = useQuery({ queryKey: ['orders'], queryFn: getOrders, enabled: isAuthenticated });

  if (!isAuthenticated || !user) {
    return <ScreenState title="Hesabınıza giriş yapın" message="Siparişlerinizi ve sepetinizi tüm cihazlarda görün." actionTitle="Giriş yap" onAction={() => router.push('/login')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hesabım</Text>
      <View style={styles.profile}>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Siparişlerim</Text>
        <Text style={styles.orderCount}>{orders.data?.length ?? 0}</Text>
      </View>
      {orders.isLoading ? <ScreenState loading title="Siparişler yükleniyor" /> : null}
      {orders.isError ? (
        <ScreenState
          title="Siparişler yüklenemedi"
          message="Bağlantınızı kontrol edip tekrar deneyin."
          actionTitle="Tekrar dene"
          onAction={() => void orders.refetch()}
        />
      ) : null}
      {orders.data?.map((order) => (
        <View key={order.id} style={styles.order}>
          <View>
            <Text style={styles.orderTitle}>Sipariş #{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
          </View>
          <Text style={styles.orderTotal}>{formatPrice(order.total_amount)}</Text>
        </View>
      ))}
      {!orders.isLoading && !orders.isError && !orders.data?.length ? <Text style={styles.empty}>Henüz siparişiniz yok.</Text> : null}
      <Button
        title="Çıkış yap"
        variant="secondary"
        fullWidth
        style={styles.logout}
        onPress={() => void logout()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing[16], paddingBottom: spacing[48], backgroundColor: colors.brand.white },
  title: { ...typography.heading[28], marginVertical: spacing[16], color: colors.text.primary },
  profile: { padding: spacing[24], borderRadius: radius[8], backgroundColor: colors.brand.cream },
  name: { ...typography.heading[20], color: colors.text.primary },
  email: { ...typography.body[14], color: colors.text.secondary, marginTop: spacing[4] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[32], marginBottom: spacing[12] },
  sectionTitle: { ...typography.heading[20], color: colors.text.primary },
  orderCount: { ...typography.body[14], color: colors.text.secondary },
  order: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[16], borderBottomWidth: 1, borderBottomColor: colors.border.light },
  orderTitle: { ...typography.body[16], fontWeight: '600', color: colors.text.primary },
  orderDate: { ...typography.body[12], color: colors.text.secondary, marginTop: spacing[4] },
  orderTotal: { ...typography.body[14], fontWeight: '700', color: colors.brand.teal },
  empty: { ...typography.body[14], color: colors.text.secondary, paddingVertical: spacing[24] },
  logout: { marginTop: 'auto' },
});
