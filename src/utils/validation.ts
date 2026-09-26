import { z } from 'zod';

// Bangladeshi Phone Regex: validates +8801XXXXXXXXX or 01XXXXXXXXX
export const bdPhoneRegex = /^(\+880|0)1[3-9]\d{8}$/;

/**
 * Normalizes any Bangladeshi phone input into DB standard format: +880XXXXXXXXXX
 */
export function normalizeBDPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  // Remove all non-digits except initial +
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return `+${digits.slice(0, 13)}`;
  }
  if (digits.startsWith('01')) {
    return `+880${digits.slice(1, 11)}`;
  }
  if (digits.startsWith('1')) {
    return `+880${digits.slice(0, 10)}`;
  }
  return rawPhone.trim();
}

/**
 * Formats user input dynamically into "+880 1XXX-XXXXXX"
 */
export function formatBDPhoneInput(input: string): string {
  if (!input) return '';
  // Extract pure digits
  let digits = input.replace(/\D/g, '');
  
  // If user typed leading 880 or 88, strip it to get the local 10/11 digits
  if (digits.startsWith('880')) {
    digits = digits.substring(3);
  } else if (digits.startsWith('88')) {
    digits = digits.substring(2);
  }
  
  // If starts with 0 (e.g. 017), strip 0 to format with +880
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Limit to 10 digits after +880 (e.g., 1712345678)
  digits = digits.substring(0, 10);

  if (digits.length === 0) {
    return '+880 ';
  }
  if (digits.length <= 4) {
    return `+880 ${digits}`;
  }
  return `+880 ${digits.slice(0, 4)}-${digits.slice(4)}`;
}

/**
 * Formats standard stored phone "+8801712345678" for display: "+880 1712-345678"
 */
export function formatBDPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const normalized = normalizeBDPhone(phone);
  if (normalized.startsWith('+880') && normalized.length === 14) {
    const p = normalized.slice(4); // 1712345678
    return `+880 ${p.slice(0, 4)}-${p.slice(4)}`;
  }
  return phone;
}

/**
 * Date / Time formatting in DD/MM/YYYY and Bengali format
 */
const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export function formatBDDate(
  dateInput: Date | string | number | undefined | null,
  options?: { format?: 'DD/MM/YYYY' | 'bengali_words' | 'bengali_digits'; includeTime?: boolean }
): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (options?.format === 'bengali_words') {
    const bnMonth = BENGALI_MONTHS[d.getMonth()];
    return `${d.getDate()} ${bnMonth} ${year}`;
  }

  const standard = `${day}/${month}/${year}`;
  return standard;
}

export const TIME_SLOTS_BD = [
  { id: 'morning', labelEn: 'Morning (10:00 AM - 01:00 PM)', labelBn: 'সকাল (১০:০০ - দুপুর ১:০০)', timeStr: '10:00 - 13:00' },
  { id: 'afternoon', labelEn: 'Afternoon (02:00 PM - 05:00 PM)', labelBn: 'দুপুর (২:০০ - বিকাল ৫:০০)', timeStr: '14:00 - 17:00' },
  { id: 'evening', labelEn: 'Evening (06:00 PM - 09:00 PM)', labelBn: 'সন্ধ্যা (৬:০০ - রাত ৯:০০)', timeStr: '18:00 - 21:00' },
];

/**
 * Pickup Address & Customer Information Validation Schema
 */
export const PickupAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'অনুগ্রহ করে আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)' }),
  phone: z
    .string()
    .refine((val) => {
      const cleaned = val.replace(/\s|-/g, '');
      return bdPhoneRegex.test(cleaned);
    }, { message: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678 বা +880 1XXX-XXXXXX)' }),
  division: z
    .string()
    .min(1, { message: 'আপনার বিভাগ নির্বাচন করুন' }),
  district: z
    .string()
    .min(1, { message: 'আপনার জেলা নির্বাচন করুন' }),
  thana: z
    .string()
    .min(1, { message: 'আপনার থানা/উপজেলা নির্বাচন করুন' }),
  area: z
    .string()
    .min(1, { message: 'আপনার এলাকা নির্বাচন বা লিখুন' }),
  streetAddress: z
    .string()
    .min(3, { message: 'বিস্তারিত ঠিকানা লিখুন (রোড নং, বাড়ি নং ইত্যাদি)' }),
  apartmentFloor: z.string().optional(),
  pickupDate: z.string().min(1, { message: 'পিকআপের তারিখ নির্বাচন করুন' }),
  pickupTimeSlot: z.string().min(1, { message: 'সময়সূচী নির্বাচন করুন' }),
});

/**
 * Customer Login Schema
 */
export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'ইমেইল ঠিকানা দিন' })
    .email({ message: 'সঠিক ইমেইল ফরম্যাট প্রদান করুন' }),
  password: z
    .string()
    .min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }),
});

/**
 * Customer Registration Schema
 */
export const RegisterValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'আপনার পুরো নাম দিন' }),
  email: z
    .string()
    .min(1, { message: 'ইমেইল ঠিকানা দিন' })
    .email({ message: 'সঠিক ইমেইল ফরম্যাট প্রদান করুন' }),
  password: z
    .string()
    .min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }),
  phone: z
    .string()
    .regex(bdPhoneRegex, { message: 'সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন' }),
  gender: z.enum(['men', 'women']),
  address: z.string().optional(),
});

/**
 * Order Tracking Schema
 */
export const TrackOrderValidationSchema = z.object({
  orderNumber: z
    .string()
    .min(3, { message: 'অর্ডার নম্বর লিখুন (যেমন: DB-2026-1234)' }),
  phone: z
    .string()
    .regex(bdPhoneRegex, { message: 'অর্ডারের সাথে যুক্ত ১১ ডিজিটের ফোন নম্বর দিন' }),
});

/**
 * Helper to extract field errors cleanly
 */
export function formatZodErrors<T>(error: z.ZodError<T>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
