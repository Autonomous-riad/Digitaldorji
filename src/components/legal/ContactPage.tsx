import React, { useState } from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Building2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useTailor();
  const { navigate } = useRouter();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Bespoke Order Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-900/70 hover:text-purple-950 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('Back to Storefront', 'হোমপেজে ফিরে যান')}</span>
      </button>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold font-serif-title text-purple-950">
          {t('Contact & Customer Atelier', 'যোগাযোগ ও কাস্টমার সাপোর্ট')}
        </h1>
        <p className="text-sm text-purple-950/70 mt-2">
          {t('Have a question about fabric requirements, custom designs, or corporate orders? Our master tailors are here to assist you.', 'কাপড়ের পরিমাণ, স্পেশাল ডিজাইন বা কর্পোরেট অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              {t('Headquarters & Workshop', 'প্রধান কার্যালয় ও কেন্দ্রীয় কারখানা')}
            </h2>

            <div className="space-y-4 text-xs text-purple-950/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-purple-950">{t('Dhanmondi Executive Hub:', 'ধানমন্ডি হাব:')}</p>
                  <p>House 42, Road 9/A, Dhanmondi R/A, Dhaka - 1209</p>
                  <p className="font-bold text-purple-950 mt-2">{t('Elephant Road Central Atelier:', 'এলিফ্যান্ট রোড মাস্টার কারখানা:')}</p>
                  <p>114 Elephant Road (Near Bata Signal), Dhaka - 1205</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-purple-950">{t('Phone Hotline:', 'হটলাইন:')}</p>
                  <p className="text-sm font-bold text-orange-600">09612-445566</p>
                  <p className="text-xs text-purple-950/70">+880 1711-002233 / +880 1811-334455</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-purple-950">{t('Email Inquiries:', 'ইমেইল:')}</p>
                  <p><a href="mailto:contact@digitaldorji.com" className="hover:underline text-purple-950">contact@digitaldorji.com</a></p>
                  <p><a href="mailto:support@digitaldorji.com" className="hover:underline text-purple-950/70">support@digitaldorji.com</a></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-purple-950">{t('Working Hours:', 'কার্যসময়:')}</p>
                  <p>{t('Saturday – Thursday: 9:00 AM – 10:00 PM', 'শনিবার – বৃহস্পতিবার: সকাল ৯টা – রাত ১০টা')}</p>
                  <p>{t('Friday: 2:30 PM – 9:00 PM (Emergency Dispatch)', 'শুক্রবার: দুপুর ২:৩০ – রাত ৯:০০ (জরুরি ডেলিভারি)')}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Chat */}
            <a
              href="https://wa.me/8801711002233?text=Hello%20Digital%20Dorji%2C%20I%20would%20like%20to%20inquire%20about%20tailoring%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('Chat on WhatsApp (+880 1711-002233)', 'হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন')}</span>
            </a>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-purple-950 font-serif-title mb-1">
              {t('Send a Message to Our Master Tailors', 'আমাদের বার্তা পাঠান')}
            </h2>
            <p className="text-xs text-purple-950/60 mb-6">
              {t('We reply within 15 minutes during regular workshop hours.', 'অফিস চলাকালীন ১৫ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করা হবে।')}
            </p>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-purple-950 font-serif-title">
                  {t('Message Sent Successfully!', 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে!')}
                </h3>
                <p className="text-xs text-purple-950/70 max-w-md mx-auto">
                  {t('Thank you. A master tailor consultant will call or message your phone number shortly.', 'ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবেন।')}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full bg-purple-100 text-purple-950 text-xs font-bold hover:bg-purple-200 transition-colors"
                >
                  {t('Send Another Message', 'আরেকটি বার্তা পাঠান')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Your Name *', 'আপনার নাম *')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Phone Number (01X-XXXXXXXX) *', 'মোবাইল নম্বর *')}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01711-002233"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Email Address (Optional)', 'ইমেইল এড্রেস (ঐচ্ছিক)')}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Topic / Garment Type', 'বিষয় বা পোশাকের ধরণ')}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40 bg-white"
                    >
                      <option value="Bespoke Order Inquiry">{t('Bespoke Tailoring Inquiry', 'কাস্টম সেলাই সংক্রান্ত তথ্য')}</option>
                      <option value="Fabric Measurement Question">{t('Fabric Yardage Advice', 'কাপড়ের পরিমাণ পরামর্শ')}</option>
                      <option value="Alteration Request">{t('Alteration / Fitting Support', 'অলটারেশন বা ফিটিং সেবা')}</option>
                      <option value="Corporate / Bulk Order">{t('Corporate / Bulk Orders', 'কর্পোরেট বা বাল্ক অর্ডার')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    {t('Your Message / Requirement Details *', 'আপনার বার্তা বা বিস্তারিত তথ্য *')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t('Tell us about the garment design, fabric material, or required delivery date...', 'আপনার পোশাকের ডিজাইন বা পছন্দের ডেলিভারি তারিখ লিখুন...')}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4 text-orange-400" />
                  <span>{t('Submit Inquiry', 'বার্তা পাঠান')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
