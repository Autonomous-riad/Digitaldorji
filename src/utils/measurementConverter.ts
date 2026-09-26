/**
 * Measurement Conversion and Validation Utilities
 * Handles Inch (DB Standard) <-> Centimeter (Metric Display) conversions,
 * numeric bounds validation, fractional parsing, and snapshot generation.
 */

export const INCH_TO_CM_RATIO = 2.54;

/**
 * Converts value from inches to centimeters
 */
export function inchToCm(inch: number, precision: number = 1): number {
  if (isNaN(inch)) return 0;
  const cm = inch * INCH_TO_CM_RATIO;
  return Number(cm.toFixed(precision));
}

/**
 * Converts value from centimeters to inches
 */
export function cmToInch(cm: number, precision: number = 2): number {
  if (isNaN(cm)) return 0;
  const inch = cm / INCH_TO_CM_RATIO;
  return Number(inch.toFixed(precision));
}

/**
 * Formats a measurement number for display with unit label
 */
export function formatMeasurement(
  valInInch: number,
  displayUnit: 'inch' | 'cm',
  showUnitSuffix: boolean = true
): string {
  if (isNaN(valInInch)) return '0';
  
  if (displayUnit === 'cm') {
    const cmVal = inchToCm(valInInch, 1);
    return showUnitSuffix ? `${cmVal} cm` : `${cmVal}`;
  }
  
  // Format inch: if has fractions like .25, .5, .75 display nicely or decimal
  const rounded = Number(valInInch.toFixed(2));
  return showUnitSuffix ? `${rounded}"` : `${rounded}`;
}

export const formatMeasurementWithUnit = formatMeasurement;

/**
 * Converts all measurement values in an object from base inches to the target display unit
 */
export function getDisplayMeasurements(
  measurementsInInch: Record<string, number>,
  targetUnit: 'inch' | 'cm'
): Record<string, number> {
  if (targetUnit === 'inch') {
    return { ...measurementsInInch };
  }
  
  const converted: Record<string, number> = {};
  for (const [k, v] of Object.entries(measurementsInInch)) {
    converted[k] = inchToCm(v, 1);
  }
  return converted;
}

/**
 * Converts user display input back to base inches for storage
 */
export function inputToInch(
  inputValue: number,
  currentUnit: 'inch' | 'cm'
): number {
  if (currentUnit === 'inch') {
    return Number(inputValue.toFixed(2));
  }
  return cmToInch(inputValue, 2);
}

export interface MeasurementValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface MeasurementFieldDef {
  key: string;
  label_en: string;
  label_bn: string;
  required?: boolean;
  min: number; // in inches
  max: number; // in inches
  default?: number;
}

/**
 * Validates a single measurement value
 */
export function validateMeasurementValue(
  valInInch: number,
  field: MeasurementFieldDef
): { valid: boolean; errorEn?: string; errorBn?: string } {
  if (field.required && (valInInch === undefined || valInInch === null || isNaN(valInInch) || valInInch <= 0)) {
    return {
      valid: false,
      errorEn: `${field.label_en} is required`,
      errorBn: `${field.label_bn} এর মাপ আবশ্যক`
    };
  }

  if (valInInch !== undefined && valInInch !== null && !isNaN(valInInch) && valInInch > 0) {
    if (valInInch < field.min) {
      return {
        valid: false,
        errorEn: `Minimum is ${field.min}" (${inchToCm(field.min)} cm)`,
        errorBn: `ন্যূনতম ${field.min}" (${inchToCm(field.min)} সেমি) হতে হবে`
      };
    }
    if (valInInch > field.max) {
      return {
        valid: false,
        errorEn: `Maximum is ${field.max}" (${inchToCm(field.max)} cm)`,
        errorBn: `সর্বোচ্চ ${field.max}" (${inchToCm(field.max)} সেমি) হতে পারে`
      };
    }
  }

  return { valid: true };
}

/**
 * Validates a measurement object against a garment's schema (measurements stored in inches)
 */
export function validateMeasurements(
  measurementsInInch: Record<string, number>,
  fields: MeasurementFieldDef[],
  lang: 'en' | 'bn' = 'en'
): MeasurementValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const f of fields) {
    const val = measurementsInInch[f.key];
    const res = validateMeasurementValue(val, f);
    if (!res.valid) {
      errors[f.key] = lang === 'bn' ? (res.errorBn || '') : (res.errorEn || '');
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Creates an immutable snapshot JSON object of measurements for order items
 */
export function createMeasurementsSnapshot(params: {
  garmentId: string;
  garmentNameEn: string;
  garmentNameBn: string;
  measurementsInInch: Record<string, number>;
  fields: MeasurementFieldDef[];
  method: string;
  unit?: 'inch' | 'cm';
  fitSilhouette?: 'slim' | 'regular' | 'comfort';
  specialNotes?: string;
}) {
  const fieldsSnapshot = params.fields.map(f => {
    const inchVal = params.measurementsInInch[f.key] ?? f.default ?? 0;
    return {
      key: f.key,
      label_en: f.label_en,
      label_bn: f.label_bn,
      value_inch: inchVal,
      value_cm: inchToCm(inchVal, 1),
      min_inch: f.min,
      max_inch: f.max,
      required: !!f.required
    };
  });

  return {
    schema_version: '1.0',
    garment_id: params.garmentId,
    garment_name_en: params.garmentNameEn,
    garment_name_bn: params.garmentNameBn,
    method: params.method,
    base_storage_unit: 'inch',
    selected_view_unit: params.unit || 'inch',
    fit_silhouette: params.fitSilhouette || 'regular',
    special_notes: params.specialNotes || '',
    fields: fieldsSnapshot,
    raw_inch_values: { ...params.measurementsInInch },
    created_at: new Date().toISOString()
  };
}
