import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { AddressForm } from '../components/domain/AddressForm/AddressForm';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../services/addresses';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { ApiAddress, UpdateAddressRequest } from '../types/api';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ApiAddress | null>(null);
  const [addressError, setAddressError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const addressQuery = useQuery({
    queryKey: ['addresses', user!.id],
    queryFn: getAddresses,
    enabled: !!user,
  });

  const addAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user!.id] });
      setIsAddingAddress(false);
      setAddressError('');
    },
    onError: (err) => setAddressError(getErrorMessage(err)),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user!.id] });
      setEditingAddress(null);
      setAddressError('');
    },
    onError: (err) => setAddressError(getErrorMessage(err)),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user!.id] });
      setAddressError('');
    },
    onError: (err) => setAddressError(getErrorMessage(err)),
  });

  // RequireAuth already guards this page, but handle edge case
  if (!user) return null;

  const handleDeleteAddress = (id: number) => {
    if (window.confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      deleteAddressMutation.mutate(id);
    }
  };

  const isMutating = addAddressMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending;

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Profile Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
          <Card>
            <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)' }}>Personal Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
              <Input label="Full Name" defaultValue={user.full_name} disabled />
              <Input label="Email" defaultValue={user.email} disabled />
              <Button disabled variant="secondary">
                Profil düzenleme yakında
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)' }}>Account Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
              <Button variant="secondary" onClick={() => navigate('/orders')}>View Order History</Button>
              <Button variant="ghost" onClick={handleLogout} style={{ color: 'red' }}>Logout</Button>
            </div>
          </Card>
        </div>

        <Card style={{ padding: 'var(--space-24)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
            <h3 className="text-heading-20">Adreslerim</h3>
            {!isAddingAddress && !editingAddress && (
              <Button variant="secondary" size="sm" onClick={() => setIsAddingAddress(true)}>
                + Yeni Adres
              </Button>
            )}
          </div>

          {addressError && (
            <p role="alert" className="text-body-14" style={{ color: 'red', marginBottom: 'var(--space-16)' }}>
              {addressError}
            </p>
          )}

          {isAddingAddress ? (
            <div style={{ marginBottom: 'var(--space-24)' }}>
              <h4 className="text-heading-16" style={{ marginBottom: 'var(--space-12)' }}>Yeni Adres Ekle</h4>
              <AddressForm
                onSubmit={(data) => addAddressMutation.mutate(data)}
                onCancel={() => { setIsAddingAddress(false); setAddressError(''); }}
                isLoading={addAddressMutation.isPending}
              />
            </div>
          ) : editingAddress ? (
            <div style={{ marginBottom: 'var(--space-24)' }}>
              <h4 className="text-heading-16" style={{ marginBottom: 'var(--space-12)' }}>Adresi Düzenle</h4>
              <AddressForm
                initialValues={{
                  title: editingAddress.title,
                  city: editingAddress.city,
                  district: editingAddress.district,
                  line1: editingAddress.line1,
                  postal_code: editingAddress.postal_code || '',
                }}
                onSubmit={(data) => {
                  const updateData: UpdateAddressRequest = {
                    title: data.title,
                    city: data.city,
                    district: data.district,
                    line1: data.line1,
                    postal_code: data.postal_code || null,
                  };
                  updateAddressMutation.mutate({ id: editingAddress.id, data: updateData });
                }}
                onCancel={() => { setEditingAddress(null); setAddressError(''); }}
                isLoading={updateAddressMutation.isPending}
                submitLabel="Güncelle"
              />
            </div>
          ) : (
            <div>
              {addressQuery.isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                  <Skeleton style={{ height: 100, borderRadius: 'var(--radius-8)' }} />
                  <Skeleton style={{ height: 100, borderRadius: 'var(--radius-8)' }} />
                </div>
              ) : addressQuery.isError ? (
                <div style={{ padding: 'var(--space-16)', border: '1px solid red', borderRadius: 'var(--radius-8)', backgroundColor: '#fff0f0' }}>
                  <p role="alert" style={{ color: 'red', marginBottom: 'var(--space-12)' }}>
                    Adresler yüklenemedi: {getErrorMessage(addressQuery.error)}
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => addressQuery.refetch()}>Tekrar Dene</Button>
                </div>
              ) : addressQuery.data?.length === 0 ? (
                <p className="text-body-14" style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-24) 0' }}>
                  Kayıtlı adresiniz bulunmuyor.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                  {addressQuery.data?.map(address => (
                    <div
                      key={address.id}
                      style={{
                        padding: 'var(--space-16)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-8)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div>
                        <strong>{address.title}</strong>
                        <p className="text-body-14" style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                          {address.line1}, {address.district}/{address.city} {address.postal_code}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                        <button
                          onClick={() => setEditingAddress(address)}
                          disabled={isMutating}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand-teal)' }}
                          aria-label="Düzenle"
                        >
                          <IoCreateOutline size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={isMutating}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                          aria-label="Sil"
                        >
                          <IoTrashOutline size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
