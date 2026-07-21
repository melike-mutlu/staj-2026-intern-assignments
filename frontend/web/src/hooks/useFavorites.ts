import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getFavorites, addFavorite, removeFavorite } from '../services/favorites';
import type { FavoriteListResponse } from '../types/api';

export type FavoriteAction = 'added' | 'removed';
export interface FavoriteToggleResult {
  productId: number;
  action: FavoriteAction;
}

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const [pendingProductIds, setPendingProductIds] = useState<Set<number>>(new Set());
  const pendingProductIdsRef = useRef<Set<number>>(new Set());
  const [mutationError, setMutationError] = useState<Error | null>(null);

  // Sync ref with state on mount/unmount isn't strictly necessary since it's component lifetime,
  // but we should ensure we don't update state if unmounted.
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const queryEnabled = isAuthenticated && user !== null;

  const {
    data,
    isLoading: isQueryLoading,
    isError: isQueryError,
    error: queryError,
    refetch
  } = useQuery<FavoriteListResponse>({
    queryKey: ['favorites', user?.id],
    queryFn: getFavorites,
    enabled: queryEnabled,
  });

  const favoriteProducts = data?.items || [];
  const totalFavorites = data?.total || 0;

  const favoriteProductIds = useMemo(() => new Set((data?.items || []).map(p => p.id)), [data?.items]);

  const isFavorite = (productId: number) => {
    return favoriteProductIds.has(productId);
  };

  const isFavoritePending = (productId: number) => {
    return pendingProductIds.has(productId);
  };

  const isFavoritesUnavailable = queryEnabled && (isQueryLoading || isQueryError);

  const clearMutationError = () => {
    setMutationError(null);
  };

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: (response) => {
      if (user) {
        queryClient.setQueryData(['favorites', user.id], response);
      }
    }
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, productId) => {
      if (user) {
        queryClient.setQueryData<FavoriteListResponse>(['favorites', user.id], (old) => {
          if (!old) return old;
          const newItems = old.items.filter(item => item.id !== productId);
          return {
            items: newItems,
            total: newItems.length
          };
        });
      }
    }
  });

  const toggleFavorite = async (productId: number): Promise<FavoriteToggleResult | undefined> => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const numericId = Number(productId);
    const isValidId = Number.isInteger(numericId) && numericId > 0;
    if (!isValidId) {
      setMutationError(new Error('Geçersiz ürün IDsi'));
      return;
    }

    if (pendingProductIdsRef.current.has(numericId)) {
      return;
    }

    if (isFavoritesUnavailable) {
      return;
    }

    clearMutationError();

    pendingProductIdsRef.current.add(numericId);
    setPendingProductIds(prev => {
      const newSet = new Set(prev);
      newSet.add(numericId);
      return newSet;
    });

    try {
      if (isFavorite(numericId)) {
        await removeMutation.mutateAsync(numericId);
        return { productId: numericId, action: 'removed' };
      } else {
        await addMutation.mutateAsync(numericId);
        return { productId: numericId, action: 'added' };
      }
    } catch (err) {
      if (isMounted.current) {
        setMutationError(err instanceof Error ? err : new Error(String(err)));
      }
      return;
    } finally {
      pendingProductIdsRef.current.delete(numericId);
      if (isMounted.current) {
        setPendingProductIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(numericId);
          return newSet;
        });
      }
    }
  };

  return {
    favoriteProducts,
    favoriteProductIds,
    totalFavorites,
    isFavorite,
    isFavoritePending,
    isFavoritesUnavailable,
    toggleFavorite,
    isLoading: isQueryLoading && queryEnabled,
    isQueryLoading,
    isQueryError,
    queryError,
    mutationError,
    clearMutationError,
    refetch,
  };
};
