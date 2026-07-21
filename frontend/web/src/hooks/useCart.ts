import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../services/cart';
import type { Product } from '../types/product';

export interface CartItemUI {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
}

export interface CartMergeResult {
  transferredCount: number;
  failedItems: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
}

export function useCart() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const guestCart = useCartStore();

  // Derived state (needs to be calculated early for enabled flag)
  const isServer = isAuthenticated && user !== null;

  // Server cart queries and mutations
  const cartQuery = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: getCart,
    enabled: isServer,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => addCartItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.id], data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => updateCartItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.id], data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
  });

  const mergeMutation = useMutation<CartMergeResult, Error, void>({
    mutationFn: async () => {
      const result: CartMergeResult = { transferredCount: 0, failedItems: [] };

      // Sequential add to avoid conflicts and allow partial success
      for (const item of guestCart.items) {
        const productId = Number(item.id);

        if (!Number.isInteger(productId) || productId <= 0) {
          result.failedItems.push({ id: item.id, name: item.name, reason: 'Geçersiz Ürün ID' });
          continue; // Item remains in guest cart
        }

        try {
          await addCartItem(productId, item.quantity);
          guestCart.removeItem(item.id);
          result.transferredCount++;
        } catch (error) {
          result.failedItems.push({
            id: item.id,
            name: item.name,
            reason: error instanceof Error ? error.message : 'API Hatası'
          });
          // Item remains in guest cart for retry
        }
      }
      return result;
    },
    onSuccess: (data) => {
      if (data.transferredCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      }
    }
  });

  // Derived state
  const isLoading = isServer ? cartQuery.isLoading : false;
  const isError = isServer ? cartQuery.isError : false;
  const error = isServer ? cartQuery.error : null;
  const isMutating = addMutation.isPending || updateMutation.isPending || removeMutation.isPending;
  const isMerging = mergeMutation.isPending;
  const guestItemsCount = guestCart.items.length;

  // Unified items
  let items: CartItemUI[] = [];
  let subtotal = 0;
  let totalItems = 0;

  if (isServer) {
    if (cartQuery.data) {
      items = cartQuery.data.items.map(item => ({
        id: String(item.product_id),
        name: item.product_name,
        image: item.image_url,
        price: item.unit_price,
        quantity: item.quantity,
        stock: item.stock,
      }));
      subtotal = cartQuery.data.subtotal;
      totalItems = cartQuery.data.items.reduce((acc, item) => acc + item.quantity, 0);
    }
  } else {
    items = guestCart.items.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
    }));
    subtotal = guestCart.subtotal();
    totalItems = guestCart.totalItems();
  }

  // Unified actions
  const addItem = async (product: Product, quantity = 1) => {
    if (isServer) {
      const productId = Number(product.id);
      if (isNaN(productId)) return;
      await addMutation.mutateAsync({ productId, quantity });
    } else {
      guestCart.addItem(product, quantity);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (isServer) {
      const productId = Number(id);
      if (isNaN(productId)) return;
      await updateMutation.mutateAsync({ productId, quantity });
    } else {
      guestCart.updateQuantity(id, quantity);
    }
  };

  const removeItem = async (id: string) => {
    if (isServer) {
      const productId = Number(id);
      if (isNaN(productId)) return;
      await removeMutation.mutateAsync(productId);
    } else {
      guestCart.removeItem(id);
    }
  };

  const mergeGuestCart = async () => {
    if (guestItemsCount > 0) {
      await mergeMutation.mutateAsync();
    }
  };

  return {
    isServer,
    items,
    subtotal,
    totalItems,
    isLoading,
    isError,
    error,
    isMutating,
    addItem,
    updateQuantity,
    removeItem,
    refetch: cartQuery.refetch,
    mergeGuestCart,
    isMerging,
    mergeResult: mergeMutation.data as CartMergeResult | undefined,
    clearMergeResult: mergeMutation.reset,
    guestItemsCount,
  };
}
