export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return 'Rp ' + (amount / 1_000_000_000).toFixed(1).replace('.', ',') + ' M';
  }
  if (amount >= 1_000_000) {
    return 'Rp ' + (amount / 1_000_000).toFixed(1).replace('.', ',') + ' jt';
  }
  if (amount >= 1_000) {
    return 'Rp ' + (amount / 1_000).toFixed(0) + ' rb';
  }
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID');
}
