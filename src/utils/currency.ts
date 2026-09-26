/**
 * Bangladeshi Taka Currency Formatter
 * Formats numbers using the South Asian lakh/crore grouping system (e.g., ৳1,50,000 NOT ৳150,000)
 * Handles display of ৳ symbol before number, decimals, and optional Bengali numerals.
 */

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English digits to Bengali numerals
 */
export function toBengaliNumerals(input: string | number): string {
  return String(input).replace(/[0-9]/g, match => BENGALI_DIGITS[match] || match);
}

/**
 * Formats a number with South Asian Lakh/Crore comma grouping
 * Example: 150000 -> 1,50,000 | 15000000 -> 1,50,00,000
 */
export function formatLakhCrore(num: number, decimals: number = 0): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const fixed = absNum.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split('.');

  // South Asian system: last 3 digits, then groups of 2 digits
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  let formatted = '';

  if (otherNumbers !== '') {
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    formatted = lastThree;
  }

  const result = decimalPart && decimals > 0 ? `${formatted}.${decimalPart}` : formatted;
  return isNegative ? `-${result}` : result;
}

/**
 * Main BDT Currency Formatter
 * @param amount - amount in BDT
 * @param options - display options
 * @returns Formatted currency string with '৳' prefix and lakh/crore grouping (e.g., "৳1,50,000")
 */
export function formatBDT(
  amount: number | string | null | undefined,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    useBanglaNumerals?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    const zero = options?.useBanglaNumerals ? '০' : '0';
    return options?.showSymbol === false ? zero : `৳${zero}`;
  }

  const num = typeof amount === 'number' ? amount : Number(amount);
  const decimals = options?.decimals ?? 0;
  const showSymbol = options?.showSymbol !== false;

  let formattedNumber = formatLakhCrore(num, decimals);

  if (options?.useBanglaNumerals) {
    formattedNumber = toBengaliNumerals(formattedNumber);
  }

  if (!showSymbol) {
    return formattedNumber;
  }

  return `৳${formattedNumber}`;
}

export function formatNumberLakh(num: number | string, useBanglaNumerals: boolean = false): string {
  return formatBDT(num, { showSymbol: false, useBanglaNumerals });
}

