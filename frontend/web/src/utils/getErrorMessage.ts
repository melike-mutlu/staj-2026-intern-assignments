import axios from 'axios';
import type { ApiProblemDetails } from '../types/api';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Backend'e ulaşılamadı. Lütfen bağlantınızı kontrol edin.";
    }

    const data = error.response.data as ApiProblemDetails | undefined;
    if (data?.detail) {
      return data.detail;
    }

    if (error.response.status === 404) {
      return 'İstenen kaynak bulunamadı.';
    }

    return `Sunucu hatası (${error.response.status}). Lütfen tekrar deneyin.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu.';
}
