export function formatDate(dateString: string): string {
  if (!dateString) return 'Tarih bilgisi yok';
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Tarih bilgisi yok'; // fallback
    }

    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return 'Tarih bilgisi yok'; // safe fallback
  }
}
