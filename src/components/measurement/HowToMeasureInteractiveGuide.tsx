import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Pin, 
  PinOff, 
  Eye, 
  HelpCircle, 
  Lightbulb, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw,
  Check
} from 'lucide-react';
import { MeasurementSchemaField, GarmentItem } from '../../types/tailor';
import { inchToCm } from '../../utils/measurementConverter';

export interface GuideStep {
  titleEn: string;
  titleBn: string;
  instructionEn: string;
  instructionBn: string;
  proTipEn: string;
  proTipBn: string;
  focusArea: string;
}

export interface MeasurementGuideData {
  steps: [GuideStep, GuideStep, GuideStep];
  startPointEn: string;
  startPointBn: string;
  endPointEn: string;
  endPointBn: string;
  commonMistakeEn: string;
  commonMistakeBn: string;
  easeRecommendationEn: string;
  easeRecommendationBn: string;
}

export interface DiagramGeometry {
  type: 'line' | 'ellipse';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  startPoint: { x: number; y: number; labelEn: string; labelBn: string; hintEn: string; hintBn: string };
  endPoint: { x: number; y: number; labelEn: string; labelBn: string; hintEn: string; hintBn: string };
  direction: 'left-to-right' | 'top-to-bottom' | 'loop' | 'diagonal';
}

export const DIAGRAM_GEOMETRY_DATABASE: Record<string, DiagramGeometry> = {
  shoulder: {
    type: 'line',
    x1: 45,
    y1: 65,
    x2: 155,
    y2: 65,
    startPoint: { x: 45, y: 65, labelEn: 'Left Shoulder Joint', labelBn: 'বাম কাঁধের হাড়', hintEn: 'Start at left joint', hintBn: 'বাম হাড়ের সংযোগস্থল' },
    endPoint: { x: 155, y: 65, labelEn: 'Right Shoulder Joint', labelBn: 'ডান কাঁধের হাড়', hintEn: 'End at right joint', hintBn: 'ডান হাড়ের সংযোগস্থল' },
    direction: 'left-to-right'
  },
  chest: {
    type: 'line',
    x1: 58,
    y1: 95,
    x2: 142,
    y2: 95,
    startPoint: { x: 58, y: 95, labelEn: 'Underarm Crease', labelBn: 'বগলের নিচ', hintEn: 'Level with floor', hintBn: 'মেঝের সমান্তরাল' },
    endPoint: { x: 142, y: 95, labelEn: 'Fullest Bust Point', labelBn: 'বুকের সর্বোচ্চ চওড়া স্থান', hintEn: 'Complete loop', hintBn: 'সম্পূর্ণ ঘের' },
    direction: 'left-to-right'
  },
  waist: {
    type: 'line',
    x1: 60,
    y1: 125,
    x2: 140,
    y2: 125,
    startPoint: { x: 60, y: 125, labelEn: 'Natural Waistline', labelBn: 'স্বাভাবিক কোমর', hintEn: 'Narrowest point', hintBn: 'নাভির ওপরের সরু অংশ' },
    endPoint: { x: 140, y: 125, labelEn: 'Abdomen Wrap', labelBn: 'পেটের সম্পূর্ণ বৃত্ত', hintEn: 'Level loop', hintBn: 'সমানভাবে চারপাশ' },
    direction: 'left-to-right'
  },
  sleeve: {
    type: 'line',
    x1: 140,
    y1: 58,
    x2: 170,
    y2: 148,
    startPoint: { x: 140, y: 58, labelEn: 'Shoulder Seam Tip', labelBn: 'কাঁধের সেলাইয়ের মাথা', hintEn: 'Top of arm socket', hintBn: 'হাতের সংযোগস্থল' },
    endPoint: { x: 170, y: 148, labelEn: 'Wrist Bone', labelBn: 'কবজির হাড়', hintEn: 'Desired cuff end', hintBn: 'কাফ শেষ হওয়ার স্থান' },
    direction: 'diagonal'
  },
  length: {
    type: 'line',
    x1: 88,
    y1: 48,
    x2: 88,
    y2: 175,
    startPoint: { x: 88, y: 48, labelEn: 'High Shoulder / Neck Base', labelBn: 'কাঁধের উঁচু বিন্দু (গলার গোড়া)', hintEn: 'Collar seam junction', hintBn: 'কলার ও কাঁধের মিলনস্থল' },
    endPoint: { x: 88, y: 175, labelEn: 'Bottom Hemline', labelBn: 'নিচের ঘের/ঝুল', hintEn: 'Desired bottom hem', hintBn: 'কাঙ্ক্ষিত ঝুল' },
    direction: 'top-to-bottom'
  },
  neck: {
    type: 'ellipse',
    cx: 100,
    cy: 70,
    rx: 30,
    ry: 12,
    startPoint: { x: 70, y: 70, labelEn: 'Collar Band Base', labelBn: 'কলারের গোড়া', hintEn: 'Around Adam\'s apple', hintBn: 'গলার গোড়ার চারপাশে' },
    endPoint: { x: 130, y: 70, labelEn: 'Collar Overlap', labelBn: 'বোতামের ওভারল্যাপ', hintEn: '1 finger ease', hintBn: '১ আঙুল ফাঁক রাখুন' },
    direction: 'loop'
  },
  cuff: {
    type: 'ellipse',
    cx: 100,
    cy: 135,
    rx: 22,
    ry: 8,
    startPoint: { x: 78, y: 135, labelEn: 'Wrist Circumference', labelBn: 'কবজির হাড়', hintEn: 'Watch clearance', hintBn: 'ঘড়ি পরার জায়গা' },
    endPoint: { x: 122, y: 135, labelEn: 'Buttoned Cuff Hem', labelBn: 'তৈরি কাফের মাপ', hintEn: 'Finished circumference', hintBn: 'কাফের সম্পূর্ণ ঘের' },
    direction: 'loop'
  },
  armhole: {
    type: 'ellipse',
    cx: 60,
    cy: 80,
    rx: 16,
    ry: 24,
    startPoint: { x: 60, y: 56, labelEn: 'Top Shoulder Joint', labelBn: 'কাঁধের ওপরের জয়েন্ট', hintEn: 'Socket top', hintBn: 'হাড়ের ওপর' },
    endPoint: { x: 60, y: 104, labelEn: 'Under Armpit Fold', labelBn: 'বগলের নিচ', hintEn: 'Underarm loop', hintBn: 'বগলের নিচ দিয়ে লুপ' },
    direction: 'loop'
  },
  hip: {
    type: 'line',
    x1: 52,
    y1: 100,
    x2: 148,
    y2: 100,
    startPoint: { x: 52, y: 100, labelEn: 'Widest Hip Curve', labelBn: 'হিপের চওড়া অংশ', hintEn: 'Around seat', hintBn: 'নিতম্বের ওপর দিয়ে' },
    endPoint: { x: 148, y: 100, labelEn: 'Horizontal Level Wrap', labelBn: 'মেঝের সমান্তরাল চক্র', hintEn: 'Sitting ease', hintBn: 'বসার আরাম বজায় রাখুন' },
    direction: 'left-to-right'
  },
  pant_length: {
    type: 'line',
    x1: 148,
    y1: 40,
    x2: 148,
    y2: 175,
    startPoint: { x: 148, y: 40, labelEn: 'Waistband / Beltline', labelBn: 'প্যান্টের বেল্টলাইন', hintEn: 'Fastened belt', hintBn: 'যেখানে প্যান্ট পরেন' },
    endPoint: { x: 148, y: 175, labelEn: 'Shoe Top / Ankle', labelBn: 'জুতার ওপর / গোড়ালি', hintEn: 'Shoe break line', hintBn: 'পছন্দের ঝুলের পতন' },
    direction: 'top-to-bottom'
  },
  thigh: {
    type: 'ellipse',
    cx: 78,
    cy: 85,
    rx: 18,
    ry: 8,
    startPoint: { x: 60, y: 85, labelEn: 'Upper Thigh Root', labelBn: 'উরুর ওপরের অংশ', hintEn: '1" below crotch', hintBn: 'হাইয়ের ১" নিচে' },
    endPoint: { x: 96, y: 85, labelEn: 'Thigh Circumference', labelBn: 'উরুর সম্পূর্ণ পরিধি', hintEn: 'Relaxed muscle', hintBn: 'পেশি শিথিল রাখুন' },
    direction: 'loop'
  },
  bottom_flare: {
    type: 'line',
    x1: 40,
    y1: 170,
    x2: 160,
    y2: 170,
    startPoint: { x: 40, y: 170, labelEn: 'Left Leg Opening', labelBn: 'পায়ের বাম প্রান্ত', hintEn: 'Hem width', hintBn: 'নিচের মোহরী' },
    endPoint: { x: 160, y: 170, labelEn: 'Right Leg Opening', labelBn: 'পায়ের ডান প্রান্ত', hintEn: 'Foot clearance', hintBn: 'পা সহজে প্রবেশের মতো' },
    direction: 'left-to-right'
  }
};

// Master tailor step-by-step knowledge base for all measurement points
export const MEASUREMENT_GUIDE_DATABASE: Record<string, MeasurementGuideData> = {
  shoulder: {
    startPointEn: 'Left shoulder bone tip',
    startPointBn: 'বাম কাঁধের হাড়ের শীর্ষবিন্দু',
    endPointEn: 'Right shoulder bone tip',
    endPointBn: 'ডান কাঁধের হাড়ের শীর্ষবিন্দু',
    commonMistakeEn: 'Measuring straight across the chest instead of arching over upper back',
    commonMistakeBn: 'পিঠের ওপর দিয়ে না মেপে সামনের বুক দিয়ে মাপ নেওয়া',
    easeRecommendationEn: 'Zero ease needed; measure exact bone-to-bone',
    easeRecommendationBn: 'কাঁধে কোনো বাড়তি ছাড় লাগে না; হাড় থেকে হাড়ের সঠিক মাপ নিন',
    steps: [
      {
        titleEn: '1. Locate Shoulder Joint',
        titleBn: '১. কাঁধের হাড় চিহ্নিত করুন',
        instructionEn: 'Find the prominent bone at the corner tip of your shoulder where the shoulder meets the arm.',
        instructionBn: 'যেখানে কাঁধের হাড়টি হাতের সাথে যুক্ত হয়েছে, সেই কর্নারের উঁচু হাড়টি আঙুল দিয়ে চিহ্নিত করুন।',
        proTipEn: 'Wear a well-fitting shirt to use its shoulder seam as reference.',
        proTipBn: 'একটি ভালো ফিট হওয়া শার্ট গায়ে দিয়ে তার সেলাইকে রেফারেন্স হিসেবে ধরতে পারেন।',
        focusArea: 'shoulder-joint'
      },
      {
        titleEn: '2. Arch Across Upper Back',
        titleBn: '২. পিঠের ওপর দিয়ে ফিতা নিন',
        instructionEn: 'Run the tape over the curve of your upper back, resting just 1 inch below the neck base bone.',
        instructionBn: 'ফিতাটি পিঠের স্বাভাবিক কার্ভ বরাবর নিয়ে যান, যা গলার গোড়ার হাড়ের ঠিক ১ ইঞ্চি নিচ দিয়ে যাবে।',
        proTipEn: 'Stand upright with arms naturally relaxed; do not shrug or pull shoulders back.',
        proTipBn: 'হাত স্বাভাবিক ঝুলিয়ে সোজা হয়ে দাঁড়ান; কাঁধ শক্ত বা কুঁজো করবেন না।',
        focusArea: 'upper-back'
      },
      {
        titleEn: '3. Read at Opposite Tip',
        titleBn: '৩. অপর কাঁধের হাড়ে শেষ করুন',
        instructionEn: 'Note the measurement exactly where the tape hits the right shoulder bone tip.',
        instructionBn: 'ডান কাঁধের হাড়ের ঠিক শীর্ষবিন্দুতে ফিতার মাপটি দেখে নোট করুন।',
        proTipEn: 'Typical range is 16" - 20" for men and 13.5" - 16.5" for women.',
        proTipBn: 'সাধারণত পুরুষদের জন্য ১৬"-২০" এবং নারীদের জন্য ১৩.৫"-১৬.৫" ইঞ্চি হয়ে থাকে।',
        focusArea: 'shoulder-right'
      }
    ]
  },
  chest: {
    startPointEn: 'Under left armpit across fullest chest',
    startPointBn: 'বগলের নিচ দিয়ে বুকের সবচেয়ে উঁচু অংশ',
    endPointEn: 'Full circumference back to front',
    endPointBn: 'সম্পূর্ণ ঘের ঘুরে সামনের কেন্দ্রবিন্দু',
    commonMistakeEn: 'Holding breath or expanding chest artificially',
    commonMistakeBn: 'দম আটকে রাখা বা অতিরিক্ত বুক ফুলিয়ে রাখা',
    easeRecommendationEn: 'Keep 1-2 fingers inside tape for natural breathing ease',
    easeRecommendationBn: 'ফিতার ভেতরে ১-২টি আঙুল রেখে পরিমাপ করুন',
    steps: [
      {
        titleEn: '1. Position Under Armpits',
        titleBn: '১. বগলের নিচ দিয়ে ফিতা রাখুন',
        instructionEn: 'Wrap measuring tape around the fullest part of your chest/bust, directly under the armpits.',
        instructionBn: 'বগলের নিচ দিয়ে বুকের সবচেয়ে স্ফীত বা চওড়া অংশের চারপাশে ফিতাটি সমান্তরালে রাখুন।',
        proTipEn: 'Ensure tape is completely level with the floor across your shoulder blades.',
        proTipBn: 'পিঠের দিক দিয়ে ফিতা যেন মেঝের সাথে সমান্তরাল থাকে এবং ঝুলে না যায়।',
        focusArea: 'armpit-level'
      },
      {
        titleEn: '2. Relax & Breathe Naturally',
        titleBn: '২. স্বাভাবিক শ্বাসপ্রশ্বাস রাখুন',
        instructionEn: 'Exhale naturally and let your arms rest at your sides. Do not puff out your chest.',
        instructionBn: 'স্বাভাবিকভাবে শ্বাস ছেড়ে হাত পাশে নামিয়ে রাখুন। বুক ফুলিয়ে ধরে রাখবেন না।',
        proTipEn: 'Insert one index finger flat between tape and body to avoid a suffocating fit.',
        proTipBn: 'ফিতা ও শরীরের মাঝে একটি আঙুল রাখুন যাতে সেলাইয়ের পর আরামদায়ক বাতাস চলাচল করে।',
        focusArea: 'chest-fullest'
      },
      {
        titleEn: '3. Record Full Circumference',
        titleBn: '৩. মোট পরিধি হিসাব করুন',
        instructionEn: 'Read where the tape meets the start point in the center front.',
        instructionBn: 'সামনের ঠিক মাঝামাঝি যেখানে ফিতা মিলিত হয়, সেই মাপটি নোট করুন।',
        proTipEn: 'For tailored drape, atelier adds standard 3"-4" garment ease during master cutting.',
        proTipBn: 'আটেলিয়ার মাস্টার কাটিংয়ের সময় স্বাচ্ছন্দ্যের জন্য ৩-৪ ইঞ্চি কাটিং লুজ যোগ করে নেয়।',
        focusArea: 'center-front'
      }
    ]
  },
  waist: {
    startPointEn: 'Natural waistline above navel / trouser beltline',
    startPointBn: 'নাভির ওপরে সরু কোমর বা প্যান্ট পরার স্থান',
    endPointEn: 'Complete horizontal loop around abdomen',
    endPointBn: 'পেটের চারপাশে অনুভূমিক সম্পূর্ণ চক্র',
    commonMistakeEn: 'Sucking in the belly during measurement',
    commonMistakeBn: 'মাপ নেওয়ার সময় পেট ভেতরের দিকে টেনে রাখা',
    easeRecommendationEn: 'Tape should be snug but comfortable without depressing the skin',
    easeRecommendationBn: 'ফিতা চামড়া চেপে না বসে আরামদায়ক স্পর্শে থাকবে',
    steps: [
      {
        titleEn: '1. Find True Waistline',
        titleBn: '১. কোমরের অবস্থান নির্ণয়',
        instructionEn: 'For tops/kameez, find the narrowest part above your navel. For trousers/pajamas, measure where you actually wear your belt.',
        instructionBn: 'টপস/কামিজের জন্য নাভির উপরের সরু অংশ এবং প্যান্ট/পায়জামার জন্য যেখানে বেল্ট পরেন সেই অংশ নিন।',
        proTipEn: 'Bend sideways gently to locate your natural waist crease.',
        proTipBn: 'সামান্য ডানে-বামে বাঁক নিলে কোমরের স্বাভাবিক ভাঁজটি সহজেই চোখে পড়ে।',
        focusArea: 'waistline'
      },
      {
        titleEn: '2. Keep Tape Level',
        titleBn: '২. ফিতা সমান রাখুন',
        instructionEn: 'Circle tape horizontally around the body. Keep it parallel to the floor all the way around.',
        instructionBn: 'ফিতাটি পেটের চারপাশ দিয়ে সমানভাবে ঘুরিয়ে আনুন যাতে পেছনের দিক নিচে নেমে না যায়।',
        proTipEn: 'Do not pull tight enough to pinch the skin.',
        proTipBn: 'ফিতা অতিরিক্ত টেনে শরীরের ভেতর বসিয়ে দেবেন না।',
        focusArea: 'horizontal-waist'
      },
      {
        titleEn: '3. Confirm Standing Comfort',
        titleBn: '৩. স্বাভাবিক ভঙ্গিতে মাপ নিন',
        instructionEn: 'Stand upright and breathe out naturally. Check the reading where the zero mark overlaps.',
        instructionBn: 'সোজা দাঁড়িয়ে স্বাভাবিক নিঃশ্বাসের সাথে ফিতার শূন্য দাগের সাথে মিল দেখে মাপ নিন।',
        proTipEn: 'For Panjabi and Kurta, a relaxed waist ensures great comfort when seated on floor or couch.',
        proTipBn: 'পাঞ্জাবি ও কুর্তায় হালকা ঢিলা কোমর বসতে সাহায্য করে।',
        focusArea: 'waist-comfort'
      }
    ]
  },
  sleeve: {
    startPointEn: 'Shoulder bone tip',
    startPointBn: 'কাঁধের হাড়ের শীর্ষবিন্দু',
    endPointEn: 'Wrist bone (or +0.5" for cuffs)',
    endPointBn: 'কবজির হাড় (বা কাফের জন্য +০.৫ ইঞ্চি)',
    commonMistakeEn: 'Measuring with a stiff straight locked elbow',
    commonMistakeBn: 'হাত একদম সোজা ও শক্ত করে টানটান রাখা',
    easeRecommendationEn: 'Slight natural 15° elbow bend ensures sleeve does not ride up when driving or lifting arms',
    easeRecommendationBn: 'হাত সামান্য বাঁকিয়ে নিলে হাত নাড়ানোর সময় হাতা ওপরে উঠে যাবে না',
    steps: [
      {
        titleEn: '1. Anchor at Shoulder Bone',
        titleBn: '১. কাঁধের হাড়ে ফিতা ধরুন',
        instructionEn: 'Place the zero end of the tape right on the tip of the shoulder bone where the sleeve seam will sit.',
        instructionBn: 'কাঁধের হাড়ের সংযোগস্থলে ফিতার শুরুর প্রান্তটি শক্ত করে চেপে ধরুন।',
        proTipEn: 'Have an assistant hold this point firmly so it doesn\'t slip down.',
        proTipBn: 'কাউকে এই পয়েন্টে ফিতা ধরে রাখতে বললে সবচেয়ে নিখুঁত মাপ পাবেন।',
        focusArea: 'shoulder-seam'
      },
      {
        titleEn: '2. Follow Outer Arm Curve',
        titleBn: '২. হাতের বাইরের পাশ দিয়ে মাপুন',
        instructionEn: 'Rest your hand on your hip or bend your elbow slightly (15°). Guide tape along the outer elbow line.',
        instructionBn: 'কনুই সামান্য বাঁকা রেখে ফিতা হাতের বাইরের দিক দিয়ে কনুইয়ের ওপর দিয়ে টেনে আনুন।',
        proTipEn: 'Never measure along the inner arm/inseam for jacket, Panjabi, or shirt sleeves.',
        proTipBn: 'শার্ট বা পাঞ্জাবির জন্য সবসময় হাতের বাইরের দিক দিয়েই মাপ নিতে হয়।',
        focusArea: 'outer-elbow'
      },
      {
        titleEn: '3. Measure to Wrist Bone',
        titleBn: '৩. কবজির হাড়ে শেষ করুন',
        instructionEn: 'Stop right over the prominent wrist bone for classic fit, or 0.5" past the bone for formal French cuffs.',
        instructionBn: 'ক্লাসিক ফিটের জন্য কবজির উঁচু হাড়ে অথবা ফরমাল ফ্রেঞ্চ কাফের জন্য আধা ইঞ্চি নিচে মাপুন।',
        proTipEn: 'For half-sleeve garments, measure to the mid-bicep level (usually 8.5" - 10.5").',
        proTipBn: 'হাফ হাতার ক্ষেত্রে বাইসেপের মাঝামাঝি পর্যন্ত মাপুন (সাধারণত ৮.৫"-১০.৫")।',
        focusArea: 'wrist-bone'
      }
    ]
  },
  length: {
    startPointEn: 'Highest point of shoulder (base of neck)',
    startPointBn: 'কাঁধের সর্বোচ্চ উঁচু বিন্দু (গলার গোড়া)',
    endPointEn: 'Desired bottom hemline',
    endPointBn: 'পোশাকের নিচের কাঙ্ক্ষিত ঘের বা ঝুল',
    commonMistakeEn: 'Looking down at your feet while measuring (causes upper body to bend)',
    commonMistakeBn: 'মাপ নেওয়ার সময় নিজের পায়ের দিকে ঝুঁকে তাকানো',
    easeRecommendationEn: 'Stand straight facing a mirror or look straight ahead',
    easeRecommendationBn: 'সোজা দাঁড়িয়ে সামনের দিকে অথবা আয়নায় তাকিয়ে মাপ নিন',
    steps: [
      {
        titleEn: '1. Anchor at High Shoulder Point',
        titleBn: '১. কাঁধের সর্বোচ্চ বিন্দুতে ফিতা রাখুন',
        instructionEn: 'Position tape where the shoulder seam intersects the neck collar base.',
        instructionBn: 'গলার গোড়া এবং কাঁধের মিলনস্থলে ফিতার শুরুর অংশটি রাখুন।',
        proTipEn: 'Do not start from center of neck or clavicle; always start from the high shoulder ridge.',
        proTipBn: 'গলার মাঝামাঝি থেকে নয়; সবসময় কাঁধের উঁচু ঢালু অংশ থেকে শুরু করতে হয়।',
        focusArea: 'neck-shoulder-ridge'
      },
      {
        titleEn: '2. Drape Vertically Over Bust',
        titleBn: '২. বুক বরাবর সোজা নিচে ঝুলিয়ে দিন',
        instructionEn: 'Let the tape hang straight down over the chest contour without pulling outward.',
        instructionBn: 'ফিতাটি বুকের ওপর দিয়ে সোজা নিচের দিকে সমানভাবে নামিয়ে দিন।',
        proTipEn: 'Looking straight forward into a mirror prevents forward posture bending.',
        proTipBn: 'নিচের দিকে না তাকিয়ে সামনের আয়নায় দেখে নিলে শরীরে ভাঁজ পড়বে না।',
        focusArea: 'vertical-drape'
      },
      {
        titleEn: '3. Mark at Desired Hem',
        titleBn: '৩. কাঙ্ক্ষিত ঘেরে মাপ নোট করুন',
        instructionEn: 'Note reading: Shirts end at mid-fly (28"-31"); Panjabi at kneecap (40"-44"); Kurti/Kameez below knee (42"-48").',
        instructionBn: 'শার্টের জন্য ২৮"-৩১", পাঞ্জাবির জন্য হাঁটুর ওপর ৪০"-৪৪" এবং কামিজের জন্য ৪২"-৪৮" ইঞ্চি আদর্শ।',
        proTipEn: 'Remember to wear your regular shoes or prayer sandals if checking ground clearance.',
        proTipBn: 'পায়ের জুতা পরে মাপলে ঝুলের সঠিক ব্যালান্স বজায় থাকে।',
        focusArea: 'bottom-hem'
      }
    ]
  },
  neck: {
    startPointEn: 'Base of neck around Adam\'s apple',
    startPointBn: 'গলার গোড়ায় যেখানে কলার বসে',
    endPointEn: 'Overlapped circumference + 1 finger ease',
    endPointBn: 'সম্পূর্ণ ঘের + ১ আঙুল বাড়তি ছাড়',
    commonMistakeEn: 'Measuring too high up under the chin',
    commonMistakeBn: 'থুতনির বেশি কাছে বা উপরে মাপ নেওয়া',
    easeRecommendationEn: 'Keep 1 finger inside the loop (+0.5" ease) so buttoned collar never chokes',
    easeRecommendationBn: 'কলার আঁটসাঁট হয়ে শ্বাসকষ্ট যেন না হয় সেজন্য ১ আঙুল ফাঁক রাখুন',
    steps: [
      {
        titleEn: '1. Circle Base of Neck',
        titleBn: '১. গলার গোড়ার চারপাশে ফিতা নিন',
        instructionEn: 'Wrap the tape around where the shirt or Panjabi collar will naturally sit, just below Adam\'s apple.',
        instructionBn: 'যেখানে শার্ট বা পাঞ্জাবির কলার বসে, সেই গলার নিচের অংশে ফিতাটি গোল করে ঘুরিয়ে নিন।',
        proTipEn: 'The collar sits lower at the front than at the back.',
        proTipBn: 'কলার পেছনের তুলনায় সামনের দিকে সামান্য নিচু হয়ে বসে।',
        focusArea: 'neck-base'
      },
      {
        titleEn: '2. Insert Index Finger Allowance',
        titleBn: '২. ১টি আঙুল ফিতার ভেতরে রাখুন',
        instructionEn: 'Slide one finger flat under the tape against your neck.',
        instructionBn: 'ফিতা ও গলার চামড়ার মাঝে আপনার তর্জনী বা ১টি আঙুল সোজা করে ঢুকিয়ে রাখুন।',
        proTipEn: 'This provides the standard 0.5" comfort ease for all day wear.',
        proTipBn: 'এটি সারাদিন কলার বন্ধ রাখলেও আরামদায়কভাবে শ্বাস নেওয়ার জায়গা করে দেয়।',
        focusArea: 'finger-ease'
      },
      {
        titleEn: '3. Record Rounded Value',
        titleBn: '৩. মাপ নোট করুন',
        instructionEn: 'Round up to nearest 0.25" or 0.5". Standard men\'s collar sizes range from 14.5" to 17.5".',
        instructionBn: 'কাছাকাছি ০.২৫ বা ০.৫ ইঞ্চিতে রাউন্ড করুন। সাধারণত ১৪.৫" থেকে ১৭.৫" ইঞ্চি হয়ে থাকে।',
        proTipEn: 'For Mandarin/Band collars, measure slightly looser (+0.75" ease).',
        proTipBn: 'চাইনিজ বা ব্যান্ড কলারের জন্য আরও সামান্য আলগা মাপ দেওয়া ভালো।',
        focusArea: 'neck-measurement'
      }
    ]
  },
  cuff: {
    startPointEn: 'Widest part of wrist bone',
    startPointBn: 'কবজির হাড়ের চওড়া অংশ',
    endPointEn: 'Wrist circumference + button ease',
    endPointBn: 'কবজির পরিধি + বোতামের ছাড়',
    commonMistakeEn: 'Measuring tight skin without watch clearance',
    commonMistakeBn: 'ঘড়ি পরার জায়গা না রেখে একদম আঁটসাঁট মাপ দেওয়া',
    easeRecommendationEn: 'Add 1.5" - 2" to snug wrist for comfortable buttoned cuff',
    easeRecommendationBn: 'সহজে হাত গলানো ও বোতাম লাগাতে ১.৫"-২" ইঞ্চি যোগ করুন',
    steps: [
      {
        titleEn: '1. Wrap Around Wrist Bone',
        titleBn: '১. কবজির হাড়ের ওপর মাপুন',
        instructionEn: 'Circle tape over the prominent wrist bone where you wear a wristwatch.',
        instructionBn: 'যেখানে হাতঘড়ি পরেন, সেই কবজির হাড়ের চারপাশে ফিতা ঘুরিয়ে নিন।',
        proTipEn: 'Measure the wrist of your dominant hand (usually slightly thicker).',
        proTipBn: 'যে হাত দিয়ে বেশি কাজ করেন সেই হাতের কবজির মাপ নেওয়া ভালো।',
        focusArea: 'wrist-circumference'
      },
      {
        titleEn: '2. Add Hand Clearance Ease',
        titleBn: '২. কাফের ছাড় নির্ধারণ করুন',
        instructionEn: 'For buttoned cuffs, add 1.5"-2". For cuffless Panjabi sleeves, measure palm knuckles.',
        instructionBn: 'বোতামযুক্ত কাফের জন্য ১.৫"-২" এবং খোলা হাতার পাঞ্জাবিতে হাতের তালুর চওড়া মাপ নিন।',
        proTipEn: 'Ensure your wrist watch slides comfortably beneath the closed cuff.',
        proTipBn: 'কাফ বন্ধ অবস্থায় ঘড়ি ভেতরে সহজে ঢুকতে পারে কিনা তা খেয়াল রাখুন।',
        focusArea: 'cuff-ease'
      },
      {
        titleEn: '3. Note Standard Size',
        titleBn: '৩. কাফের চূড়ান্ত মাপ নিন',
        instructionEn: 'Standard finished formal cuff measures 9.0" - 10.0".',
        instructionBn: 'সাধারণত শার্টের তৈরি কাফের মাপ ৯.০" থেকে ১০.০" ইঞ্চি হয়ে থাকে।',
        proTipEn: 'Atelier master tailors position buttons with 0.5" micro-adjustment allowance.',
        proTipBn: 'দরজিরা বোতাম লাগানোর সময় কিছুটা অ্যাডজাস্টমেন্টের সুযোগ রাখে।',
        focusArea: 'cuff-final'
      }
    ]
  },
  armhole: {
    startPointEn: 'Under armpit over shoulder socket',
    startPointBn: 'বগলের নিচ থেকে কাঁধের হাড়ের ওপর',
    endPointEn: 'Complete diagonal loop around arm root',
    endPointBn: 'বাহুর গোড়ায় সম্পূর্ণ তির্যক লুপ',
    commonMistakeEn: 'Pulling tape too high into armpit fold',
    commonMistakeBn: 'বগলের গভীরে বেশি চেপে ফিতা বসানো',
    easeRecommendationEn: 'Allow 1.5" - 2.5" ease so lifting arms does not tug torso',
    easeRecommendationBn: 'হাত উপরে তোলার সুবিধার জন্য ১.৫"-২.৫" ইঞ্চি ঢিলা রাখা হয়',
    steps: [
      {
        titleEn: '1. Loop Under Arm Socket',
        titleBn: '১. বগলের নিচ দিয়ে লুপ করুন',
        instructionEn: 'Wrap tape under the armpit and over the top of the shoulder joint.',
        instructionBn: 'বগলের নিচ দিয়ে ফিতা কাঁধের ওপরের জয়েন্ট পর্যন্ত একটি সম্পূর্ণ লুপ তৈরি করুন।',
        proTipEn: 'Keep arm resting relaxed against your side.',
        proTipBn: 'হাত স্বাভাবিকভাবে পাশে ঝুলিয়ে রাখুন।',
        focusArea: 'arm-socket'
      },
      {
        titleEn: '2. Check Freedom of Motion',
        titleBn: '২. নড়াচড়ার স্বাধীনতা যাচাই',
        instructionEn: 'Move tape back and forth gently; it should not pinch skin or pinch armpit crease.',
        instructionBn: 'ফিতা হালকা সামনে-পিছনে সরিয়ে দেখুন যাতে চামড়া না আটকায়।',
        proTipEn: 'An armhole that is too small restricts movement; too large causes shirt to pull out of pants.',
        proTipBn: 'আর্মহোল বেশি ছোট হলে হাত ওঠাতে কষ্ট হবে, বেশি বড় হলে শার্ট প্যান্ট থেকে বের হয়ে আসবে।',
        focusArea: 'motion-check'
      },
      {
        titleEn: '3. Record Circumference',
        titleBn: '৩. আর্মহোল মাপ নোট করুন',
        instructionEn: 'Standard armhole ranges between 18" and 22" for men, 15" to 19" for women.',
        instructionBn: 'সাধারণত পুরুষদের জন্য ১৮"-২২" এবং নারীদের জন্য ১৫"-১৯" ইঞ্চি হয়ে থাকে।',
        proTipEn: 'Slim fit shirts use higher, closer armholes for clean silhouette.',
        proTipBn: 'স্লিম ফিট পোশাকে আর্মহোল কিছুটা ফিটিং রাখা হয়।',
        focusArea: 'armhole-record'
      }
    ]
  },
  pant_length: {
    startPointEn: 'Waistband / trouser belt level',
    startPointBn: 'প্যান্টের বেল্টলাইন বা কোমরের শুরু',
    endPointEn: 'Top of shoe sole / heel base',
    endPointBn: 'জুতার সোলের ওপর বা গোড়ালি পর্যন্ত',
    commonMistakeEn: 'Measuring along inside leg (inseam) instead of outer seam',
    commonMistakeBn: 'বাইরের সিমের বদলে ভেতরের হাই মেপে ফেলা',
    easeRecommendationEn: 'Wear the shoes you plan to wear for accurate hem break',
    easeRecommendationBn: 'যে জুতা পরবেন তা পরে নিলে ঝুলের সঠিক পতন বোঝা যায়',
    steps: [
      {
        titleEn: '1. Anchor at Waistband',
        titleBn: '১. বেল্টের ওপর ফিতা ধরুন',
        instructionEn: 'Place the top of the tape on the upper edge of where your pants sit on your hip.',
        instructionBn: 'যেখানে প্যান্ট পরেন সেই বেল্টের উপরের কিনারায় ফিতার শুরুটা ধরুন।',
        proTipEn: 'Fasten your regular belt so the pants sit at actual wearing height.',
        proTipBn: 'বেল্ট পরে স্বাভাবিক উচ্চতায় প্যান্ট রেখে মাপ নেওয়া সবচেয়ে ভালো।',
        focusArea: 'pant-waist'
      },
      {
        titleEn: '2. Measure Down Outseam',
        titleBn: '২. বাইরের পাশ দিয়ে নিচে নামান',
        instructionEn: 'Let tape fall straight down the outer side of your hip, thigh, knee, and ankle bone.',
        instructionBn: 'ফিতা পায়ের বাইরের পাশ দিয়ে সোজা গোড়ালির হাড় পর্যন্ত নামিয়ে আনুন।',
        proTipEn: 'Do not look down, as bending shifts the hem upward by 1 to 2 inches.',
        proTipBn: 'নিচে তাকালে শরীর বেঁকে ঝুল ১-২ ইঞ্চি ছোট হয়ে যায়; আয়নায় দেখে নিন।',
        focusArea: 'outer-seam'
      },
      {
        titleEn: '3. Select Break Style',
        titleBn: '৩. ঝুলের পতন নির্বাচন করুন',
        instructionEn: 'No-Break: top of shoe; Half-Break (classic): mid-heel counter; Full-Break: 0.5" above shoe sole.',
        instructionBn: 'আধুনিক নো-ব্রেক: জুতার ওপরে; ক্লাসিক হাফ-ব্রেক: হিলের মাঝামাঝি পর্যন্ত।',
        proTipEn: 'Standard trouser outseam is 38" - 42" for men.',
        proTipBn: 'সাধারণত পুরুষদের প্যান্টের ঝুল ৩৮"-৪২" ইঞ্চি হয়ে থাকে।',
        focusArea: 'shoe-break'
      }
    ]
  },
  hip: {
    startPointEn: 'Fullest curve of hips and seat',
    startPointBn: 'হিপ ও নিতম্বের সবচেয়ে চওড়া অংশ',
    endPointEn: 'Horizontal level loop back to start',
    endPointBn: 'মেঝের সমান্তরাল সম্পূর্ণ ঘের',
    commonMistakeEn: 'Measuring waist instead of lower seat curve',
    commonMistakeBn: 'হিপের বদলে ওপরের কোমরের মাপ নিয়ে ফেলা',
    easeRecommendationEn: 'Allow 2"-3" ease so sitting down doesn\'t stress rear seam',
    easeRecommendationBn: 'বসার আরামের জন্য ২-৩ ইঞ্চি ছাড় রাখা আবশ্যক',
    steps: [
      {
        titleEn: '1. Find Fullest Point',
        titleBn: '১. সবচেয়ে চওড়া পয়েন্ট চিহ্নিত করুন',
        instructionEn: 'Stand with heels together and locate the widest projection of your hips and buttocks (approx 7"-9" below waist).',
        instructionBn: 'দুই পা একসাথে রেখে হিপের সবচেয়ে উঁচু অংশটি চিহ্নিত করুন (কোমরের ৭-৯ ইঞ্চি নিচে)।',
        proTipEn: 'Empty your pockets completely before measuring.',
        proTipBn: 'পকেটে ওয়ালেট বা মোবাইল থাকলে তা বের করে নিয়ে মাপুন।',
        focusArea: 'hip-fullest'
      },
      {
        titleEn: '2. Check Tape Levelness',
        titleBn: '২. চারপাশ সমান রাখুন',
        instructionEn: 'Wrap tape horizontally around both hips. Ensure tape does not sag at the back.',
        instructionBn: 'ফিতা অনুভূমিকভাবে ঘুরিয়ে আনুন যাতে পেছনের অংশ ঝুলে না থাকে।',
        proTipEn: 'Glide tape up and down slightly to confirm it easily passes the widest point.',
        proTipBn: 'ফিতা হালকা ওপরে-নিচে টেনে দেখুন যেন সবচেয়ে চওড়া অংশ দিয়ে সহজে পিছলে যায়।',
        focusArea: 'hip-level'
      },
      {
        titleEn: '3. Record Reading',
        titleBn: '৩. হিপের মাপ নোট করুন',
        instructionEn: 'Read the measurement snug to body. Tailor will add sitting ease during pattern drafting.',
        instructionBn: 'শরীর স্পর্শ করে মাপটি নিন। দরজি কাটিংয়ের সময় বসার জন্য লুজ রেখে দেবে।',
        proTipEn: 'Crucial for Panjabi, Sherwani, Trousers, and Kurti side slits.',
        proTipBn: 'পাঞ্জাবি, শেরওয়ানি, প্যান্ট ও কুর্তির সাইড ফাড়ার জন্য এই মাপ অত্যন্ত গুরুত্বপূর্ণ।',
        focusArea: 'hip-record'
      }
    ]
  },
  thigh: {
    startPointEn: 'Fullest upper thigh (1" below crotch)',
    startPointBn: 'উরুর সবচেয়ে চওড়া অংশ (হাইয়ের ১" নিচে)',
    endPointEn: 'Circumference around thigh',
    endPointBn: 'উরুর চারপাশের পরিধি',
    commonMistakeEn: 'Measuring midway down to knee',
    commonMistakeBn: 'হাঁটুর বেশি কাছে গিয়ে মাপ নেওয়া',
    easeRecommendationEn: 'Keep 1.5" - 2" ease so fabric doesn\'t bind when stepping or sitting',
    easeRecommendationBn: 'সিঁড়ি ভাঙা ও বসার সুবিধার জন্য ১.৫"-২" ইঞ্চি লুজ রাখুন',
    steps: [
      {
        titleEn: '1. Position Under Crotch',
        titleBn: '১. উরুর ওপরের অংশে ফিতা রাখুন',
        instructionEn: 'Wrap tape around the fullest part of your thigh, roughly 1 inch below the crotch fork.',
        instructionBn: 'পায়ের হাই বা সংযোগস্থলের ঠিক ১ ইঞ্চি নিচে উরুর চওড়া অংশের চারপাশে ফিতা নিন।',
        proTipEn: 'Distribute weight evenly on both feet while standing.',
        proTipBn: 'দুই পায়ে সমান ভর দিয়ে স্বাভাবিক ভঙ্গিতে দাঁড়ান।',
        focusArea: 'thigh-top'
      },
      {
        titleEn: '2. Verify Muscle Relaxation',
        titleBn: '২. পেশি শিথিল রাখুন',
        instructionEn: 'Do not flex your thigh muscles. Keep tape comfortably loose.',
        instructionBn: 'পায়ের মাংসপেশি শক্ত করবেন না; ফিতা আলতোভাবে রাখুন।',
        proTipEn: 'For slim-fit trousers, maintain minimum 1.5" comfort slack.',
        proTipBn: 'স্লিম ফিট প্যান্টেও কমপক্ষে ১.৫ ইঞ্চি স্বাচ্ছন্দ্য বজায় রাখুন।',
        focusArea: 'thigh-relax'
      },
      {
        titleEn: '3. Note Circumference',
        titleBn: '৩. মাপ নোট করুন',
        instructionEn: 'Typical thigh measurements range from 20" to 28".',
        instructionBn: 'সাধারণত উরুর মাপ ২০" থেকে ২৮" ইঞ্চি পর্যন্ত হয়ে থাকে।',
        proTipEn: 'Pajama and Kabli pants use generous thigh ease for effortless folding during prayer/namaz.',
        proTipBn: 'পায়জামা বা কাবলি প্যান্টে নামাজে বসার জন্য বেশি লুজ রাখা হয়।',
        focusArea: 'thigh-record'
      }
    ]
  },
  bottom_flare: {
    startPointEn: 'Hemline edge of pant / kameez',
    startPointBn: 'পায়ের মোহরী বা নিচের ঘেরের শেষ প্রান্ত',
    endPointEn: 'Circumference opening of leg/skirt',
    endPointBn: 'পায়ের গোল মুখের সম্পূর্ণ মাপ',
    commonMistakeEn: 'Making opening too narrow for foot or heel to slide through',
    commonMistakeBn: 'পা গলানোর জায়গা না রেখে অতিরিক্ত সরু মোহরী দেওয়া',
    easeRecommendationEn: 'Measure around heel diagonal if trousers lack side buttons/zips',
    easeRecommendationBn: 'বোতাম না থাকলে গোড়ালি সহজে প্রবেশের মতো মাপ রাখুন',
    steps: [
      {
        titleEn: '1. Measure Opening Width',
        titleBn: '১. পায়ের মোহরীর মাপ নিন',
        instructionEn: 'Wrap tape around your ankle or desired trouser leg opening width.',
        instructionBn: 'গোড়ালির চারপাশ দিয়ে আপনি প্যান্টের নিচের মুখ যতখানি চওড়া চান সেই মাপ নিন।',
        proTipEn: 'Slim pant: 13"-14"; Classic trouser: 15"-16.5"; Pajama: 14"-16"; Palazzo: 20"-26".',
        proTipBn: 'ন্যারো প্যান্ট: ১৩"-১৪"; রেগুলার: ১৫"-১৬.৫"; পায়জামা: ১৪"-১৬"; প্লাজো: ২০"-২৬" ইঞ্চি।',
        focusArea: 'bottom-opening'
      },
      {
        titleEn: '2. Heel Clearance Check',
        titleBn: '২. গোড়ালি প্রবেশের ছাড় যাচাই',
        instructionEn: 'Measure diagonally around your heel and instep to ensure foot fits through easily.',
        instructionBn: 'গোড়ালি ও পাতার ওপর দিয়ে ফিতা ঘুরিয়ে দেখুন পা সহজে বের হয় কিনা।',
        proTipEn: 'Fitted churidar or narrow trousers require minimum 12.5" to pass the heel.',
        proTipBn: 'চুড়িদার বা ন্যারো প্যান্টে পা গলানোর জন্য কমপক্ষে ১২.৫" ইঞ্চি দরকার হয়।',
        focusArea: 'heel-clearance'
      },
      {
        titleEn: '3. Finalize Style Cut',
        titleBn: '৩. স্টাইল নিশ্চিত করুন',
        instructionEn: 'Confirm with your personal shoe style (oxfords, sneakers, or sandals).',
        instructionBn: 'যে ধরনের জুতা বা স্যান্ডেল পরবেন তার সাথে মানানসই ঘের চূড়ান্ত করুন।',
        proTipEn: 'Atelier adds weighted hem fold for elegant drape.',
        proTipBn: 'আটেলিয়ার সুন্দর পতনের জন্য নিচে চওড়া ও ভারী হেম ভাঁজ করে দেয়।',
        focusArea: 'flare-final'
      }
    ]
  }
};

interface Props {
  field: MeasurementSchemaField;
  garment?: GarmentItem;
  displayUnit: 'inch' | 'cm';
  currentValue?: number;
  onApplyValue?: (val: number) => void;
  onClose?: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  variant?: 'popover' | 'docked' | 'modal' | 'inline';
}

export const HowToMeasureInteractiveGuide: React.FC<Props> = ({
  field,
  garment,
  displayUnit,
  currentValue,
  onApplyValue,
  onClose,
  isPinned = false,
  onTogglePin,
  variant = 'docked'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [simulatedValue, setSimulatedValue] = useState<number>(currentValue ?? field.default ?? field.min);
  const [activeUnit, setActiveUnit] = useState<'inch' | 'cm'>(displayUnit);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState<number>(0);

  // Sync simulated value when field changes
  useEffect(() => {
    setSimulatedValue(currentValue ?? field.default ?? field.min);
    setCurrentStepIndex(0);
    setAutoPlayProgress(0);
  }, [field.key, currentValue]);

  // Lookup diagram data or fallback to generic
  const diagramKey = useMemo(() => {
    if (field.diagram) return field.diagram.toLowerCase();
    const key = field.key.toLowerCase();
    if (key.includes('shoulder')) return 'shoulder';
    if (key.includes('chest') || key.includes('bust')) return 'chest';
    if (key.includes('waist')) return 'waist';
    if (key.includes('sleeve')) return 'sleeve';
    if (key.includes('neck') || key.includes('collar')) return 'neck';
    if (key.includes('cuff')) return 'cuff';
    if (key.includes('armhole')) return 'armhole';
    if (key.includes('hip')) return 'hip';
    if (key.includes('thigh')) return 'thigh';
    if (key.includes('pant') || key.includes('trouser') || key.includes('inseam')) return 'pant_length';
    if (key.includes('flare') || key.includes('mohri') || key.includes('bottom')) return 'bottom_flare';
    return 'length';
  }, [field]);

  const guideData = useMemo(() => {
    return MEASUREMENT_GUIDE_DATABASE[diagramKey] || MEASUREMENT_GUIDE_DATABASE['length'];
  }, [diagramKey]);

  const geometry = useMemo(() => {
    return DIAGRAM_GEOMETRY_DATABASE[diagramKey] || DIAGRAM_GEOMETRY_DATABASE['shoulder'];
  }, [diagramKey]);

  const activeStep = guideData.steps[currentStepIndex];
  const diagramSrc = `/diagrams/${diagramKey}.svg`;

  // Display calculations
  const displayVal = activeUnit === 'cm' ? inchToCm(simulatedValue) : simulatedValue;
  const minDisplay = activeUnit === 'cm' ? inchToCm(field.min) : field.min;
  const maxDisplay = activeUnit === 'cm' ? inchToCm(field.max) : field.max;

  // Auto-play stepper walkthrough
  useEffect(() => {
    if (!isAutoPlaying) {
      setAutoPlayProgress(0);
      return;
    }

    const stepDuration = 3500; // 3.5 seconds per step
    const intervalMs = 50;
    const progressIncrement = (intervalMs / stepDuration) * 100;

    const timer = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          setCurrentStepIndex((step) => (step + 1) % 3);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNextStep = () => {
    setIsAutoPlaying(false);
    setAutoPlayProgress(0);
    setCurrentStepIndex((prev) => (prev < guideData.steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrevStep = () => {
    setIsAutoPlaying(false);
    setAutoPlayProgress(0);
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSelectStep = (idx: number) => {
    setIsAutoPlaying(false);
    setAutoPlayProgress(0);
    setCurrentStepIndex(idx);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setAutoPlayProgress(0);
  };

  const handleStepDelta = (delta: number) => {
    const next = Math.min(Math.max(simulatedValue + delta, field.min), field.max);
    setSimulatedValue(Number(next.toFixed(2)));
    if (onApplyValue) onApplyValue(Number(next.toFixed(2)));
  };

  return (
    <div 
      className={`bg-cream-50 rounded-2xl border-2 border-purple-900/30 shadow-xl overflow-hidden flex flex-col text-purple-950 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
        variant === 'modal' ? 'max-w-xl w-full max-h-[92vh] overflow-y-auto' : 'w-full'
      }`}
    >
      {/* 1. Atelier Guide Header Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-[#3d1a4c] to-purple-950 text-cream-50 p-3 sm:p-4 flex items-center justify-between border-b border-purple-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-xs">
            <Ruler className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-700/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>পরিমাপ নির্দেশিকা • Step-by-Step Guide</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-serif-title leading-tight mt-0.5">
              {field.label_bn} ({field.label_en})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Auto-Play Toggle */}
          <button
            type="button"
            onClick={toggleAutoPlay}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isAutoPlaying 
                ? 'bg-amber-400 text-purple-950 font-bold shadow-xs' 
                : 'bg-white/10 text-cream-200 hover:text-white hover:bg-white/15'
            }`}
            title={isAutoPlaying ? 'Pause Walkthrough (পজ করুন)' : 'Play Step-by-Step Walkthrough (স্বয়ংক্রিয় ডেমো দেখুন)'}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="text-[11px] hidden sm:inline">{isAutoPlaying ? 'পজ' : 'অটো ডেমো'}</span>
          </button>

          {onTogglePin && (
            <button
              type="button"
              onClick={onTogglePin}
              className={`p-1.5 rounded-lg text-cream-200 hover:text-white transition-colors cursor-pointer ${
                isPinned ? 'bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/40' : 'hover:bg-white/10'
              }`}
              title={isPinned ? 'Unpin Guide (পিন ছাড়ুন)' : 'Pin Guide to screen (গাইডটি স্থির রাখুন)'}
              aria-label={isPinned ? 'Unpin' : 'Pin'}
            >
              {isPinned ? <Pin className="w-4 h-4 fill-amber-300 text-amber-300" /> : <PinOff className="w-4 h-4" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-cream-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Animated Diagram Canvas */}
      <div className="relative bg-cream-100 p-3 sm:p-4 border-b border-cream-300 flex flex-col items-center justify-center overflow-hidden min-h-[190px] sm:min-h-[230px]">
        {/* Subtle decorative tailoring measuring grid background */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#2c1236 1px, transparent 1px)',
            backgroundSize: '12px 12px'
          }}
        />

        {/* Start / End Point Callout Badges */}
        <div className="w-full flex items-center justify-between text-[10px] font-semibold text-purple-950/70 mb-2 px-1 z-10">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-300 shadow-2xs ${
            currentStepIndex === 0 
              ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400/30' 
              : 'bg-cream-50/90 border-cream-300 text-purple-950/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${currentStepIndex === 0 ? 'bg-amber-600 animate-ping' : 'bg-emerald-600'}`} />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">১. শুর: {geometry.startPoint.labelBn}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-300 shadow-2xs ${
            currentStepIndex === 2 
              ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/30' 
              : 'bg-cream-50/90 border-cream-300 text-purple-950/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${currentStepIndex === 2 ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`} />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">৩. শেষ: {geometry.endPoint.labelBn}</span>
          </div>
        </div>

        {/* Visual Diagram Stage with animated measuring tape layer */}
        <div className="relative flex items-center justify-center w-full max-w-[280px] h-[140px] sm:h-[165px] z-10">
          {/* Base garment silhouette SVG */}
          <img
            src={diagramSrc}
            alt={`${field.label_en} measurement diagram`}
            className={`max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 select-none ${
              isZoomed ? 'scale-125' : 'scale-100'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/diagrams/shoulder.svg';
            }}
          />

          {/* Dynamic SVG Animated Measuring Tape Layer (mapped 1:1 on 0 0 200 200) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg 
              className={`w-full h-full max-w-[280px] overflow-visible transition-transform duration-300 ${
                isZoomed ? 'scale-125' : 'scale-100'
              }`} 
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="tapeGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <radialGradient id="anchorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* TAPE UNDER-GLOW */}
              {geometry.type === 'line' && (
                <line
                  x1={geometry.x1}
                  y1={geometry.y1}
                  x2={geometry.x2}
                  y2={geometry.y2}
                  stroke="#fbbf24"
                  strokeWidth="6"
                  opacity="0.35"
                  strokeLinecap="round"
                />
              )}

              {geometry.type === 'ellipse' && (
                <ellipse
                  cx={geometry.cx}
                  cy={geometry.cy}
                  rx={geometry.rx}
                  ry={geometry.ry}
                  stroke="#fbbf24"
                  strokeWidth="6"
                  opacity="0.35"
                  fill="none"
                />
              )}

              {/* ANIMATED MEASURING TAPE RIBBON */}
              {geometry.type === 'line' && (
                <>
                  <line
                    x1={geometry.x1}
                    y1={geometry.y1}
                    x2={geometry.x2}
                    y2={geometry.y2}
                    stroke="#fde68a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={geometry.x1}
                    y1={geometry.y1}
                    x2={geometry.x2}
                    y2={geometry.y2}
                    stroke="url(#tapeGoldGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="5 3"
                    className="animate-tape-flow"
                    strokeLinecap="round"
                  />
                </>
              )}

              {geometry.type === 'ellipse' && (
                <>
                  <ellipse
                    cx={geometry.cx}
                    cy={geometry.cy}
                    rx={geometry.rx}
                    ry={geometry.ry}
                    stroke="#fde68a"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  <ellipse
                    cx={geometry.cx}
                    cy={geometry.cy}
                    rx={geometry.rx}
                    ry={geometry.ry}
                    stroke="url(#tapeGoldGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="5 3"
                    className="animate-tape-flow"
                    fill="none"
                  />
                </>
              )}

              {/* STEP 0: ANCHOR PULSING RIPPLE */}
              {currentStepIndex === 0 && (
                <g>
                  {/* Expanding ripple ring */}
                  <circle
                    cx={geometry.startPoint.x}
                    cy={geometry.startPoint.y}
                    r="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-tape-anchor"
                  />
                  {/* Anchor pin dot */}
                  <circle
                    cx={geometry.startPoint.x}
                    cy={geometry.startPoint.y}
                    r="5"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Floating callout label */}
                  <g transform={`translate(${geometry.startPoint.x > 100 ? geometry.startPoint.x - 65 : geometry.startPoint.x + 8}, ${geometry.startPoint.y > 100 ? geometry.startPoint.y - 18 : geometry.startPoint.y + 12})`}>
                    <rect
                      x="0"
                      y="0"
                      width="58"
                      height="15"
                      rx="4"
                      fill="#2c1236"
                      stroke="#fbbf24"
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="29"
                      y="11"
                      fill="#fef3c7"
                      fontSize="8"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      📍 ১. ফিতা ধরুন
                    </text>
                  </g>
                </g>
              )}

              {/* STEP 1: DRAPE & DIRECTION CHEVRONS */}
              {currentStepIndex === 1 && (
                <g>
                  {/* Tape drape flow indicator at midpoint */}
                  {geometry.type === 'line' && (
                    <g transform={`translate(${(geometry.x1! + geometry.x2!) / 2 - 25}, ${(geometry.y1! + geometry.y2!) / 2 - 22})`}>
                      <rect
                        x="0"
                        y="0"
                        width="50"
                        height="15"
                        rx="4"
                        fill="#2c1236"
                        stroke="#f59e0b"
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="25"
                        y="11"
                        fill="#fef3c7"
                        fontSize="8"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ↔️ ফিতা ঘোরান
                      </text>
                    </g>
                  )}
                  {geometry.type === 'ellipse' && (
                    <g transform={`translate(${geometry.cx! - 25}, ${geometry.cy! - geometry.ry! - 18})`}>
                      <rect
                        x="0"
                        y="0"
                        width="50"
                        height="15"
                        rx="4"
                        fill="#2c1236"
                        stroke="#f59e0b"
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="25"
                        y="11"
                        fill="#fef3c7"
                        fontSize="8"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        🔄 সমান বৃত্ত
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* STEP 2: END TARGET AND LIVE VALUE READOUT */}
              {currentStepIndex === 2 && (
                <g>
                  {/* Target bullseye */}
                  <circle
                    cx={geometry.endPoint.x}
                    cy={geometry.endPoint.y}
                    r="8"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                  <circle
                    cx={geometry.endPoint.x}
                    cy={geometry.endPoint.y}
                    r="5"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Live measurement readout flag */}
                  <g transform={`translate(${geometry.endPoint.x > 100 ? geometry.endPoint.x - 62 : geometry.endPoint.x + 8}, ${geometry.endPoint.y > 100 ? geometry.endPoint.y - 18 : geometry.endPoint.y + 10})`}>
                    <rect
                      x="0"
                      y="0"
                      width="56"
                      height="16"
                      rx="4"
                      fill="#2c1236"
                      stroke="#10b981"
                      strokeWidth="1.2"
                      opacity="0.95"
                    />
                    <text
                      x="28"
                      y="11.5"
                      fill="#34d399"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {displayVal.toFixed(1)} {activeUnit}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Zoom Lens button */}
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-1 right-1 p-1 bg-white/90 hover:bg-white text-purple-950 rounded-md border border-cream-300 shadow-2xs text-[10px] flex items-center gap-1 cursor-pointer transition-colors z-20"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Live Measurement Value Indicator Pill */}
        <div className="mt-2 z-10 flex items-center gap-2 flex-wrap justify-center">
          <div className="bg-purple-950 text-cream-50 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xs flex items-center gap-1.5 border border-purple-800">
            <span className="text-amber-300 text-[10px] uppercase font-sans">লাইভ মাপ:</span>
            <span>{displayVal.toFixed(1)} {activeUnit}</span>
            <span className="text-purple-300 text-[10px]">
              ({activeUnit === 'inch' ? `${inchToCm(simulatedValue)} cm` : `${simulatedValue.toFixed(1)} in`})
            </span>
          </div>

          <div className="flex bg-cream-200 rounded-lg p-0.5 border border-cream-300 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveUnit('inch')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeUnit === 'inch' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
              }`}
            >
              in
            </button>
            <button
              type="button"
              onClick={() => setActiveUnit('cm')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeUnit === 'cm' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
              }`}
            >
              cm
            </button>
          </div>
        </div>
      </div>

      {/* 3. 3-Step Interactive Stepper Tabs */}
      <div className="p-3 sm:p-4 space-y-3 bg-cream-50">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-cream-200/90 rounded-xl border border-cream-300 relative">
          {guideData.steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`py-1.5 px-1 sm:px-2 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden ${
                  isCurrent
                    ? 'bg-purple-950 text-cream-50 font-bold shadow-xs'
                    : 'text-purple-950/70 hover:text-purple-950 hover:bg-cream-100'
                }`}
              >
                {/* Auto-play progress bar underline */}
                {isCurrent && isAutoPlaying && (
                  <div 
                    className="absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-75"
                    style={{ width: `${autoPlayProgress}%` }}
                  />
                )}
                <div className="flex items-center gap-1">
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isCurrent ? 'bg-amber-400 text-purple-950' : 'bg-cream-300 text-purple-950'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[11px] truncate hidden sm:inline">ধাপ {idx + 1}</span>
                </div>
                <span className="text-[10px] truncate max-w-[90px] leading-tight mt-0.5">
                  {st.titleBn.split('.')[1] || st.titleBn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-cream-300 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-purple-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeStep.titleBn}</span>
              <span className="text-[11px] text-purple-950/60 font-normal">({activeStep.titleEn})</span>
            </h4>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ধাপ {currentStepIndex + 1}/৩
            </span>
          </div>

          <p className="text-xs text-purple-950 leading-relaxed font-medium">
            {activeStep.instructionBn}
          </p>
          <p className="text-[11px] text-purple-950/70 leading-relaxed font-normal">
            {activeStep.instructionEn}
          </p>

          {/* Pro-Tip Box */}
          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-950">
            <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block">মাস্টার দরজির টিপস (Tailor Insight):</span>
              <p className="leading-snug">{activeStep.proTipBn}</p>
            </div>
          </div>
        </div>

        {/* Stepper Controls (Prev / Next) */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-cream-200 text-purple-950 border border-cream-300 hover:bg-cream-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>পূর্ববর্তী ধাপ</span>
          </button>

          {/* Stepper dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex ? 'w-5 bg-purple-950' : 'w-1.5 bg-cream-300 hover:bg-purple-300'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {currentStepIndex < 2 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-950 text-cream-50 hover:bg-purple-900 flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <span>পরবর্তী ধাপ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onApplyValue) onApplyValue(simulatedValue);
                if (onClose) onClose();
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>মাপ ঠিক আছে</span>
            </button>
          )}
        </div>

        {/* Interactive Measurement Range & Slider Simulator */}
        <div className="pt-2 border-t border-cream-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-purple-950/70">
              অনুমোদিত পরিসীমা (Acceptable Range):
            </span>
            <span className="font-mono font-bold text-purple-950">
              {minDisplay} - {maxDisplay} {activeUnit}
            </span>
          </div>

          {/* Interactive Range Slider with ± Micro Steps */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepDelta(activeUnit === 'cm' ? -0.4 : -0.5)}
              className="w-6 h-6 rounded-md bg-white border border-cream-300 text-purple-950 hover:bg-cream-200 text-xs font-bold flex items-center justify-center cursor-pointer shadow-2xs"
              title="-0.5"
            >
              -
            </button>
            <span className="text-[10px] text-purple-950/60 font-mono">{minDisplay}</span>
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={0.25}
              value={simulatedValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSimulatedValue(val);
                if (onApplyValue) onApplyValue(val);
              }}
              className="flex-1 accent-purple-950 cursor-pointer h-2 bg-cream-300 rounded-lg"
            />
            <span className="text-[10px] text-purple-950/60 font-mono">{maxDisplay}</span>
            <button
              type="button"
              onClick={() => handleStepDelta(activeUnit === 'cm' ? 0.4 : 0.5)}
              className="w-6 h-6 rounded-md bg-white border border-cream-300 text-purple-950 hover:bg-cream-200 text-xs font-bold flex items-center justify-center cursor-pointer shadow-2xs"
              title="+0.5"
            >
              +
            </button>
          </div>

          {/* Pro Tailor Ease & Common Mistake Warning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[10px] text-emerald-950 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>ফিট ছাড়:</strong> {guideData.easeRecommendationBn}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-200/80 text-[10px] text-rose-950 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
              <span><strong>সাধারণ ভুল:</strong> {guideData.commonMistakeBn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
