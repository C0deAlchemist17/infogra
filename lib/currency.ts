const EGP_FORMATTER = new Intl.NumberFormat('en-EG', {
  style: 'currency',
  currency: 'EGP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Centralized EGP price formatter for the entire store */
export function formatEGP(amount: number): string {
  return EGP_FORMATTER.format(amount)
}

/** Format without currency symbol prefix (e.g. "74,970") */
export function formatEGPAmount(amount: number): string {
  return amount.toLocaleString('en-EG')
}
