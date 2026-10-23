import React, { useState, useEffect, useRef } from 'react';
import {
  Utensils,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  Search,
  RotateCcw,
  X,
  Package,
  Soup,
  Apple,
  Sparkles,
  Camera,
  Heart,
  ChevronDown,
  Info,
  Globe,
  Check,
  ExternalLink
} from 'lucide-react';

// Type definitions
export type Language = 'ar' | 'en';
export type FoodType = 'Cooked' | 'Raw' | 'Packaged' | 'Other';

export interface FoodItem {
  id: string;
  name: string;
  nameEn?: string;
  quantity: string;
  quantityEn?: string;
  type: FoodType;
  location: string;
  locationEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
  isClaimed: boolean;
  postedAt: string;
  postedAtEn?: string;
  claimedAt?: string;
  claimerNote?: string;
}

// Logo image matching user uploaded image
const LOGO_IMAGE_PATH = '/logo.jpg';

// Preset images with direct high-quality Unsplash URLs for food sharing & fresh food
const PRESET_IMAGES = [
  {
    id: 'cooked',
    titleAr: 'وجبة مطبوخة ساخنة',
    titleEn: 'Warm Cooked Meal',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bakery',
    titleAr: 'مخبوزات ومعجنات طازجة',
    titleEn: 'Fresh Bakery & Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'produce',
    titleAr: 'خضار وفواكه طازجة',
    titleEn: 'Fresh Fruits & Veggies',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pantry',
    titleAr: 'مؤن ومعلبات مجتمعية',
    titleEn: 'Pantry & Packaged Goods',
    url: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=800&q=80',
  },
];

// Initial items with direct Unsplash URLs
const INITIAL_ITEMS: FoodItem[] = [
  {
    id: 'item-1',
    name: 'خبز صاج وتشكيلة مخبوزات طازجة من المخبز',
    nameEn: 'Fresh Bakery Bread & Artisan Croissants',
    quantity: '5 أرغفة كبيرة و 8 قطع كرواسون',
    quantityEn: '5 large loaves & 8 croissants',
    type: 'Cooked',
    location: 'حي الروضة، مخبز البركة، شارع النخيل',
    locationEn: 'Al Rawdah District, Al Baraka Bakery, Palm St',
    description: 'خبز طازج من إنتاج صباح اليوم، مغلف بعناية في أكياس ورقية نظيفة ومحكمة.',
    descriptionEn: 'Freshly baked this morning, cleanly bagged in food-safe paper packaging.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    isClaimed: false,
    postedAt: 'اليوم الساعة 09:30 ص',
    postedAtEn: 'Today at 09:30 AM',
  },
  {
    id: 'item-2',
    name: 'صندوق خضروات ومحصول عضوي طازج (طماطم وجزر وخضار ورقية)',
    nameEn: 'Organic Fresh Vegetables Crate (Tomatoes & Greens)',
    quantity: 'صندوق خشبي (حوالي 6 كجم)',
    quantityEn: 'Wooden crate (approx. 6 kg)',
    type: 'Raw',
    location: 'حديقة المجتمع التعاونية، البوابة الشرقية',
    locationEn: 'Community Garden Allotment, East Gate',
    description: 'خضار قطاف اليوم من المزرعة المنزلية، طماطم بلدي، جزر طازج، ونعناع وريحان.',
    descriptionEn: 'Fresh morning harvest from community garden: sweet tomatoes, carrots, and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
    isClaimed: false,
    postedAt: 'اليوم الساعة 10:15 ص',
    postedAtEn: 'Today at 10:15 AM',
  },
  {
    id: 'item-3',
    name: 'شوربة عدس وخضار ساخنة ومقسمة في عبوات عائلية',
    nameEn: 'Warm Hearty Lentil & Veggie Soup (Portioned)',
    quantity: '4 عبوات محكمة الإغلاق (1 لتر لكل عبوة)',
    quantityEn: '4 sealed containers (1L each)',
    type: 'Cooked',
    location: 'المطبخ الخيري المركزي، حي السلام مقابل المسجد الكبير',
    locationEn: 'Community Kitchen, Al Salam District, Main Square',
    description: 'وجبة صحية ومغذية محضرة وفق أعلى معايير النظافة ومبردة فوراً. تاريخ الإعداد مثبت على العبوات.',
    descriptionEn: 'Nutritious vegan lentil soup prepared in clean kitchen and promptly chilled.',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    isClaimed: false,
    postedAt: 'اليوم الساعة 11:00 ص',
    postedAtEn: 'Today at 11:00 AM',
  },
  {
    id: 'item-4',
    name: 'مواد تموينية ومؤن غذائية مغلفة (أرز ومكرونة وبقوليات)',
    nameEn: 'Pantry Food Box (Rice, Pasta & Canned Beans)',
    quantity: '6 علب بقوليات + 3 أكياس مكرونة 1 كجم',
    quantityEn: '6 bean cans + 3 pasta boxes (1kg)',
    type: 'Packaged',
    location: 'صندوق حفظ النعمة، شارع الملك فيصل',
    locationEn: 'Little Free Food Pantry Box, King Faisal St',
    description: 'معلبات ومواد جافة سليمة ومغلفة بالكامل وتاريخ الصلاحية ممتد لعام 2027.',
    descriptionEn: 'Sealed factory-packaged goods. Unopened pasta, beans, and lentils. Best before 2027.',
    imageUrl: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=800&q=80',
    isClaimed: false,
    postedAt: 'أمس الساعة 05:40 م',
    postedAtEn: 'Yesterday at 05:40 PM',
  },
];

const STORAGE_KEY = 'shareplate_pantry_v6';
const LANG_STORAGE_KEY = 'shareplate_language_pref';

export default function App() {
  // Language state (default to 'ar')
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'en' || savedLang === 'ar') return savedLang;
    } catch (e) {
      console.warn('Lang storage error', e);
    }
    return 'ar';
  });

  const isAr = lang === 'ar';

  // Synchronize document dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save lang pref', e);
    }
  }, [lang, isAr]);

  // Food items state with automatic sanitizer
  const [items, setItems] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: FoodItem[] = JSON.parse(saved);
        return parsed.map(item => {
          if (!item.imageUrl || item.imageUrl.includes('/src/assets/images/') || item.imageUrl.includes('photo-1584727638096')) {
            if (item.type === 'Cooked') item.imageUrl = PRESET_IMAGES[0].url;
            else if (item.type === 'Raw') item.imageUrl = PRESET_IMAGES[2].url;
            else if (item.type === 'Packaged') item.imageUrl = PRESET_IMAGES[3].url;
            else item.imageUrl = PRESET_IMAGES[1].url;
          }
          return item;
        });
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
    return INITIAL_ITEMS;
  });

  // Form states
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [foodType, setFoodType] = useState<FoodType>('Cooked');
  const [pickupLocation, setPickupLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter & Search states
  const [selectedFilter, setSelectedFilter] = useState<'All' | FoodType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for Claim confirmation
  const [claimModalItem, setClaimModalItem] = useState<FoodItem | null>(null);
  const [claimerNote, setClaimerNote] = useState('');

  // Alert State
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({
    show: false,
    title: '',
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [items]);

  // Alert helper
  const triggerAlert = (title: string, message: string) => {
    setAlertInfo({ show: true, title, message });
    setTimeout(() => {
      setAlertInfo(prev => ({ ...prev, show: false }));
    }, 5500);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت' : 'Image size is too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setImageUrl(dataUrl);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Preset image picker
  const handleSelectPreset = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  // Submit food
  const handlePostFood = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!foodName.trim()) {
      errors.foodName = isAr ? 'يرجى كتابة اسم الطعام' : 'Please enter food name';
    }
    if (!quantity.trim()) {
      errors.quantity = isAr ? 'يرجى تحديد الكمية المتوفرة' : 'Please specify quantity';
    }
    if (!pickupLocation.trim()) {
      errors.location = isAr ? 'يرجى تحديد موقع الاستلام بدقة' : 'Please enter pickup location';
    }
    if (!description.trim()) {
      errors.description = isAr ? 'يرجى كتابة وصف موجز' : 'Please provide a short description';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const now = new Date();
    const timeAr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const timeEn = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Fallback image
    let finalImg = imageUrl.trim();
    if (!finalImg) {
      if (foodType === 'Cooked') finalImg = PRESET_IMAGES[0].url;
      else if (foodType === 'Raw') finalImg = PRESET_IMAGES[2].url;
      else if (foodType === 'Packaged') finalImg = PRESET_IMAGES[3].url;
      else finalImg = PRESET_IMAGES[1].url;
    }

    const newItem: FoodItem = {
      id: `item-${Date.now()}`,
      name: foodName.trim(),
      nameEn: foodName.trim(),
      quantity: quantity.trim(),
      quantityEn: quantity.trim(),
      type: foodType,
      location: pickupLocation.trim(),
      locationEn: pickupLocation.trim(),
      description: description.trim(),
      descriptionEn: description.trim(),
      imageUrl: finalImg,
      isClaimed: false,
      postedAt: `اليوم الساعة ${timeAr}`,
      postedAtEn: `Today at ${timeEn}`,
    };

    setItems([newItem, ...items]);

    // Reset
    setFoodName('');
    setQuantity('');
    setFoodType('Cooked');
    setPickupLocation('');
    setDescription('');
    setImageUrl('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    triggerAlert(
      isAr ? 'تم نشر الوجبة بنجاح!' : 'Food Posted Successfully!',
      isAr
        ? `أصبحت "${newItem.name}" معروضة للجميع لحفظ النعمة وسد الحاجة.`
        : `"${newItem.name}" is now listed and available for neighbors in need.`
    );

    const browseElem = document.getElementById('browse-food-section');
    if (browseElem) {
      browseElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load sample preset
  const handleLoadSample = () => {
    const samples = [
      {
        nameAr: 'وجبة مجبوس دجاج مع الأرز والمكسرات',
        nameEn: 'Warm Rice & Chicken Meal with Nuts',
        qtyAr: '5 وجبات معبأة بشكل فردي',
        qtyEn: '5 individually boxed meal portions',
        type: 'Cooked' as FoodType,
        locAr: 'حي النزهة، شارع العروبة، أمام جامع الإحسان',
        locEn: 'Al Nuzha, Al Orouba St, by Al Ihsan Mosque',
        descAr: 'وجبات فائضة من مائدة عائلية، مجهزة ومغلفة ونظيفة جداً وساخنة مع سلطة جانبية.',
        descEn: 'Surplus from family gathering, cleanly packaged in insulated containers, warm and fresh.',
        img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
      },
      {
        nameAr: 'سلة فواكه مشكلة طازجة (تفاح وبرتقال وموز)',
        nameEn: 'Fresh Orchard Fruit Basket (Apples & Oranges)',
        qtyAr: 'سلة تزن حوالي 4 كجم',
        qtyEn: 'Fruit basket approx. 4 kg',
        type: 'Raw' as FoodType,
        locAr: 'سوق الخضار المركزي، البوابة رقم 2',
        locEn: 'Central Market, Gate 2',
        descAr: 'فواكه طازجة وسليمة بالكامل وجاهزة للاستهلاك المباشر ومغلفة في سلة ورقية.',
        descEn: 'Fresh crisp fruit harvested this morning, washed and ready to enjoy.',
        img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
      },
      {
        nameAr: 'فطائر ومعجنات جبن وزعتر طازجة',
        nameEn: 'Freshly Baked Cheese & Thyme Pastries',
        qtyAr: '12 قطعة معجنات مشكلة',
        qtyEn: '12 assorted fresh pastries',
        type: 'Other' as FoodType,
        locAr: 'مخبز ومطعم الضيافة، شارع التحلية',
        locEn: 'Al Diyafa Bakery, Tahlia Street',
        descAr: 'مخبوزات طازجة تم إعدادها ظهراً، مغلفة في صواني طعام مغطاة بورق حراري.',
        descEn: 'Baked fresh today, cleanly arranged on baker trays with clean wrapping.',
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    setFoodName(isAr ? pick.nameAr : pick.nameEn);
    setQuantity(isAr ? pick.qtyAr : pick.qtyEn);
    setFoodType(pick.type);
    setPickupLocation(isAr ? pick.locAr : pick.locEn);
    setDescription(isAr ? pick.descAr : pick.descEn);
    setImageUrl(pick.img);
    setImagePreview(pick.img);
    setFormErrors({});
  };

  // Confirm Claim
  const confirmClaim = () => {
    if (!claimModalItem) return;

    const now = new Date();
    const timeAr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const timeEn = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setItems(prev =>
      prev.map(item =>
        item.id === claimModalItem.id
          ? {
              ...item,
              isClaimed: true,
              claimedAt: isAr
                ? `تم الحجز اليوم الساعة ${timeAr}`
                : `Claimed today at ${timeEn}`,
              claimerNote: claimerNote.trim() || undefined,
            }
          : item
      )
    );

    const displayName = isAr ? claimModalItem.name : (claimModalItem.nameEn || claimModalItem.name);
    const displayLoc = isAr ? claimModalItem.location : (claimModalItem.locationEn || claimModalItem.location);

    triggerAlert(
      isAr ? 'تم حجز الطعام بنجاح!' : 'Food Claimed Successfully!',
      isAr
        ? `لقد حجزت "${displayName}". يرجى التوجه للاستلام من: ${displayLoc}.`
        : `You reserved "${displayName}". Please collect it from: ${displayLoc}.`
    );

    setClaimModalItem(null);
    setClaimerNote('');

    setTimeout(() => {
      const claimedElem = document.getElementById('claimed-food-section');
      if (claimedElem) {
        claimedElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Unclaim / Release
  const handleUnclaim = (item: FoodItem) => {
    setItems(prev =>
      prev.map(i =>
        i.id === item.id
          ? {
              ...i,
              isClaimed: false,
              claimedAt: undefined,
              claimerNote: undefined,
            }
          : i
      )
    );

    const displayName = isAr ? item.name : (item.nameEn || item.name);

    triggerAlert(
      isAr ? 'تمت إعادة العرض إلى المتاح' : 'Listing Returned to Available',
      isAr
        ? `أصبح "${displayName}" متاحاً للآخرين لحفظ النعمة.`
        : `"${displayName}" is now available again for others to claim.`
    );
  };

  // Filtered available items
  const availableItems = items.filter(item => {
    if (item.isClaimed) return false;
    if (selectedFilter !== 'All' && item.type !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q) || (item.nameEn && item.nameEn.toLowerCase().includes(q));
      const matchLoc = item.location.toLowerCase().includes(q) || (item.locationEn && item.locationEn.toLowerCase().includes(q));
      const matchDesc = item.description.toLowerCase().includes(q) || (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q));
      return matchName || matchLoc || matchDesc;
    }
    return true;
  });

  const claimedItems = items.filter(item => item.isClaimed);

  // Type label helper
  const getTypeBadge = (type: FoodType) => {
    switch (type) {
      case 'Cooked':
        return {
          label: isAr ? 'وجبة مطبوخة' : 'Cooked Meal',
          icon: Soup,
          color: 'text-emerald-900 bg-emerald-100/90 border-emerald-300',
        };
      case 'Raw':
        return {
          label: isAr ? 'خضار وفواكه' : 'Fresh Produce',
          icon: Apple,
          color: 'text-amber-900 bg-amber-100/90 border-amber-300',
        };
      case 'Packaged':
        return {
          label: isAr ? 'مواد تموينية' : 'Pantry & Packaged',
          icon: Package,
          color: 'text-stone-900 bg-stone-200/90 border-stone-300',
        };
      default:
        return {
          label: isAr ? 'مخبوزات وأخرى' : 'Bakery & Other',
          icon: Utensils,
          color: 'text-teal-900 bg-teal-100/90 border-teal-300',
        };
    }
  };

  return (
    <div className={`min-h-screen bg-[#faf7f2] text-[#111827] selection:bg-[#2d6a4f]/20 ${isAr ? 'font-sans' : 'font-sans'}`}>
      
      {/* ====================================================================
          TOP NAVIGATION BAR (مع اللوجو الجديد وزر تبديل اللغات عربي / إنجليزي)
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2d8cb] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* الشعار الجديد بالصورة المطلوبة بدقة */}
          <a href="#" className="flex items-center gap-3.5 whitespace-nowrap shrink-0 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-[#c4b9a7] transition-transform group-hover:scale-105 bg-white p-0.5">
              <img
                src={LOGO_IMAGE_PATH}
                alt="شعار شير بليت SharePlate"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="font-headline text-2xl font-black tracking-tight text-black block leading-tight">
                {isAr ? 'شير بليت' : 'SharePlate'}
                <span className="text-xs font-bold text-[#2d6a4f] ms-2">
                  {isAr ? '(SharePlate)' : '(حفظ النعمة)'}
                </span>
              </span>
              <span className="text-xs font-bold text-[#4b5563] hidden sm:block leading-none mt-1">
                {isAr ? 'مشاركة فائض الطعام لمن هم بحاجة إليه' : 'Connecting surplus food to those in need'}
              </span>
            </div>
          </a>

          {/* روابط التصفح */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#1f2937]">
            <a href="#post-food-section" className="hover:text-[#1b4332] transition-colors whitespace-nowrap">
              {isAr ? 'نشر طعام فائض' : 'Post Surplus Food'}
            </a>
            <a href="#browse-food-section" className="hover:text-[#1b4332] transition-colors whitespace-nowrap flex items-center gap-1.5">
              {isAr ? 'الأطعمة المتاحة' : 'Available Food'}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#e8f2e8] text-[#1b4332] tabular-nums">
                {availableItems.length}
              </span>
            </a>
            <a href="#claimed-food-section" className="hover:text-[#1b4332] transition-colors whitespace-nowrap flex items-center gap-1.5">
              {isAr ? 'المحجوزات' : 'Claimed Food'}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#fceddd] text-[#9a3412] tabular-nums">
                {claimedItems.length}
              </span>
            </a>
          </nav>

          {/* أدوات التحكم: محول اللغات والزر الأساسي */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* زر التبديل بين العربية والإنجليزية */}
            <div className="flex items-center bg-[#f0eae1] p-1 rounded-xl border border-[#dcd1c2]">
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  isAr ? 'bg-[#1b4332] text-white shadow-xs' : 'text-[#4b5563] hover:text-black'
                }`}
                title="التحويل للغة العربية"
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  !isAr ? 'bg-[#1b4332] text-white shadow-xs' : 'text-[#4b5563] hover:text-black'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            <a
              href="#post-food-section"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-[#1b4332] hover:bg-[#143628] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'أضف طعاماً' : 'Post Food'}</span>
            </a>

          </div>

        </div>
      </header>

      {/* ====================================================================
          HERO BANNER: الخط في البداية أسود وواضح جداً كما طُلب
          ==================================================================== */}
      <section className="pt-8 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-white text-[#111827] shadow-sm border-2 border-[#e5ded4]">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            {/* الخط في البداية أسود عريض وبارز جداً */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f2e8] text-xs sm:text-sm font-black text-[#1b4332] border border-[#cbe1cb]">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                {isAr
                  ? 'مبادرة مجتمعية مجانية 100% · حفظ النعمة وسد الحاجة'
                  : '100% Free Community Initiative · Zero Food Waste'}
              </div>

              {/* العنوان الرئيسي بالخط الأسود الحالك والصريح */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight drop-shadow-2xs">
                {isAr
                  ? 'كل وجبة تشاركها تصنع فرقاً حقيقياً وتمنع هدراً!'
                  : 'Every meal shared makes a real difference and stops waste!'}
              </h1>

              {/* الوصف بخط واضح وعالي التباين */}
              <p className="text-[#1f2937] text-base sm:text-lg leading-relaxed font-bold max-w-2xl">
                {isAr
                  ? 'منصة شير بليت (SharePlate) تربط المطاعم، المخابز، والعائلات التي لديها فائض طعام طازج وصالح للأكل بالأشخاص والأسر المحتاجة القريبة منهم بكل يسر وكرامة.'
                  : 'SharePlate connects bakeries, restaurants, and local households with wholesome surplus food to neighbors in need with total dignity and zero friction.'}
              </p>

              {/* أزرار الإجراء السريع */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#browse-food-section"
                  className="px-6 py-3.5 rounded-xl bg-[#1b4332] text-white font-black text-sm sm:text-base hover:bg-[#143628] transition-all shadow-sm flex items-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  {isAr ? `تصفح الوجبات المتاحة (${availableItems.length})` : `Browse Available Food (${availableItems.length})`}
                </a>
                <a
                  href="#post-food-section"
                  className="px-6 py-3.5 rounded-xl bg-[#f4ede4] text-black border border-[#d8cdbd] font-black text-sm sm:text-base hover:bg-[#ece2d6] transition-all"
                >
                  <Plus className="w-5 h-5 inline-block me-1 stroke-[2.5]" />
                  {isAr ? 'أضف طعام فائض الآن' : 'Post Surplus Food'}
                </a>
              </div>
            </div>

            {/* الصورة البارزة في البداية */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#d8cfc0] group">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
                  alt={isAr ? 'مائدة مشاركة الطعام المجتمعي والأغذية الطازجة' : 'Community food sharing and fresh produce'}
                  referrerPolicy="no-referrer"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/images/hero_community_food_share_1791912093334.jpg';
                  }}
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span className="text-white font-black text-sm sm:text-base">
                      {isAr ? 'تكافل مجتمعي وإحسان حقيقي' : 'Neighborhood Solidarity'}
                    </span>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm font-semibold">
                    {isAr
                      ? 'تسليم واستلام مباشر بطريقة كريمة وآمنة في كل حي.'
                      : 'Direct and dignified food handover across communities.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* شريط الإحصائيات والأرقام المضيئة بخط أسود وواضح */}
          <div className="border-t border-[#e2d8cb] bg-[#faf7f2] px-6 sm:px-10 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-black">
                  {items.filter(i => !i.isClaimed).length}
                </div>
                <div className="text-xs sm:text-sm text-[#4b5563] font-black mt-1">
                  {isAr ? 'وجبات متاحة الآن' : 'Available Right Now'}
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-[#1b4332]">
                  {claimedItems.length}
                </div>
                <div className="text-xs sm:text-sm text-[#4b5563] font-black mt-1">
                  {isAr ? 'وجبات تم إنقاذها' : 'Meals Rescued'}
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-black">
                  {items.length}
                </div>
                <div className="text-xs sm:text-sm text-[#4b5563] font-black mt-1">
                  {isAr ? 'إجمالي المشاركات' : 'Total Food Items'}
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-[#b45309]">
                  ~{(claimedItems.length * 2.1).toFixed(1)} {isAr ? 'كجم' : 'kg'}
                </div>
                <div className="text-xs sm:text-sm text-[#4b5563] font-black mt-1">
                  {isAr ? 'طعام تم حفظه من الهدر' : 'Food Saved From Landfill'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* ====================================================================
          العمودان الرئيسيان (Post Food + Browse & Claimed)
          ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ------------------------------------------------------------------
              العمود الأول: نموذج إضافة الطعام (مع خيار رفع واختيار الصور)
              ------------------------------------------------------------------ */}
          <div className="lg:col-span-5 space-y-6" id="post-food-section">
            <div className="bg-white rounded-3xl border border-[#e2d8cb] shadow-sm overflow-hidden sticky top-24">
              
              {/* ترويسة النموذج */}
              <div className="px-6 py-5 border-b border-[#e2d8cb] bg-[#fbf9f5] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-black flex items-center gap-2">
                    <Plus className="w-6 h-6 text-[#1b4332] stroke-[3]" />
                    {isAr ? 'أضف طعاماً للمشاركة (حفظ النعمة)' : 'Post Food for Community'}
                  </h2>
                  <p className="text-xs font-bold text-[#4b5563] mt-0.5">
                    {isAr ? 'شارك الفائض مع جيرانك ومن هم بحاجة' : 'Share surplus with neighbors and people in need'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-black text-[#1b4332] hover:text-white bg-[#e8f2e8] hover:bg-[#1b4332] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title={isAr ? 'تعبئة سريعة ببيانات تجريبية' : 'Fill form with sample data'}
                >
                  {isAr ? 'تعبئة سريعة' : 'Load Sample'}
                </button>
              </div>

              {/* جسم النموذج */}
              <form onSubmit={handlePostFood} className="p-6 space-y-5">
                
                {/* اسم الطعام */}
                <div>
                  <label htmlFor="food-name" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                    {isAr ? 'اسم الطعام أو الوجبة' : 'Food Name'} <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="food-name"
                    type="text"
                    value={foodName}
                    onChange={e => setFoodName(e.target.value)}
                    placeholder={isAr ? 'مثال: أرز بالدجاج، خبز صاج طازج، سلة فواكه' : 'e.g., Sourdough Loaf, Veggie Curry, Fresh Apples'}
                    className={`w-full px-4 py-3 text-sm font-bold rounded-xl border ${
                      formErrors.foodName ? 'border-red-500 bg-red-50/40' : 'border-[#d1c7b8] bg-[#fdfdfc]'
                    } focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-all`}
                  />
                  {formErrors.foodName && (
                    <p className="text-xs font-bold text-red-600 mt-1">{formErrors.foodName}</p>
                  )}
                </div>

                {/* الكمية والنوع */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* الكمية */}
                  <div>
                    <label htmlFor="food-quantity" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                      {isAr ? 'الكمية المتوفرة' : 'Quantity'} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="food-quantity"
                      type="text"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      placeholder={isAr ? 'مثال: 4 وجبات، 3 كجم، 5 علب' : 'e.g., 4 meals, 3 kg, 2 boxes'}
                      className={`w-full px-4 py-3 text-sm font-bold rounded-xl border ${
                        formErrors.quantity ? 'border-red-500 bg-red-50/40' : 'border-[#d1c7b8] bg-[#fdfdfc]'
                      } focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-all`}
                    />
                    {formErrors.quantity && (
                      <p className="text-xs font-bold text-red-600 mt-1">{formErrors.quantity}</p>
                    )}
                  </div>

                  {/* نوع الطعام */}
                  <div>
                    <label htmlFor="food-type" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                      {isAr ? 'نوع الطعام' : 'Food Type'} <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="food-type"
                        value={foodType}
                        onChange={e => setFoodType(e.target.value as FoodType)}
                        className="w-full px-4 py-3 text-sm font-black rounded-xl border border-[#d1c7b8] bg-[#fdfdfc] text-black appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-all pe-10 cursor-pointer"
                      >
                        <option value="Cooked">{isAr ? 'طعام مطبوخ (وجبات)' : 'Cooked Meal'}</option>
                        <option value="Raw">{isAr ? 'خضار وفواكه طازجة' : 'Fresh Produce'}</option>
                        <option value="Packaged">{isAr ? 'مواد تموينية ومغلفة' : 'Packaged / Pantry'}</option>
                        <option value="Other">{isAr ? 'مخبوزات وأخرى' : 'Bakery & Other'}</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-[#4a5568] absolute end-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* مكان الاستلام */}
                <div>
                  <label htmlFor="food-location" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                    {isAr ? 'موقع ومكان الاستلام' : 'Pickup Location'} <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="food-location"
                      type="text"
                      value={pickupLocation}
                      onChange={e => setPickupLocation(e.target.value)}
                      placeholder={isAr ? 'مثال: حي الروضة أمام المسجد، أو اسم المخبز' : 'e.g., Maple St Community Center or Porch #14'}
                      className={`w-full ps-11 pe-4 py-3 text-sm font-bold rounded-xl border ${
                        formErrors.location ? 'border-red-500 bg-red-50/40' : 'border-[#d1c7b8] bg-[#fdfdfc]'
                      } focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-all`}
                    />
                    <MapPin className="w-5 h-5 text-[#1b4332] absolute start-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {formErrors.location && (
                    <p className="text-xs font-bold text-red-600 mt-1">{formErrors.location}</p>
                  )}
                </div>

                {/* الوصف */}
                <div>
                  <label htmlFor="food-description" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                    {isAr ? 'وصف الوجبة وملاحظات الحفظ' : 'Description & Food Notes'} <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="food-description"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={isAr ? 'اذكر المكونات، حالة التغليف، وتاريخ التحضير وموعد الاستلام المناسب...' : 'Dietary details, packaging status, collection time window...'}
                    className={`w-full px-4 py-3 text-sm font-bold rounded-xl border ${
                      formErrors.description ? 'border-red-500 bg-red-50/40' : 'border-[#d1c7b8] bg-[#fdfdfc]'
                    } focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-all`}
                  />
                  {formErrors.description && (
                    <p className="text-xs font-bold text-red-600 mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* خيار إضافة صورة للطعام (تحميل أو اختيار جاهز) */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-black text-black">
                      {isAr ? 'صورة الطعام (اختياري لكن مفضل جداً)' : 'Food Photo (Optional, Highly Recommended)'}
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs font-black text-red-600 hover:underline cursor-pointer"
                      >
                        {isAr ? 'إزالة الصورة' : 'Remove Photo'}
                      </button>
                    )}
                  </div>

                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-[#1b4332] h-44 group">
                      <img
                        src={imagePreview}
                        alt="معاينة صورة الطعام"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-black bg-black/60 px-3 py-1.5 rounded-lg">
                          {isAr ? 'تم تعيين الصورة بنجاح' : 'Photo Attached'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#c2b6a4] hover:border-[#1b4332] bg-[#fbf9f5] hover:bg-[#f4efe8] rounded-2xl p-5 text-center cursor-pointer transition-all"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#e8f2e8] text-[#1b4332] flex items-center justify-center mx-auto mb-2">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-black text-[#1b4332]">
                        {isAr ? 'اضغط لرفع صورة من جهازك أو هاتفك' : 'Click to upload a photo from your phone/device'}
                      </p>
                      <p className="text-xs font-bold text-[#4b5563] mt-1">
                        {isAr ? 'يدعم JPG، PNG، WEBP (حتى 5 ميجابايت)' : 'Supports JPG, PNG, WEBP (up to 5MB)'}
                      </p>
                    </div>
                  )}

                  {/* صور جاهزة وسريعة */}
                  <div>
                    <span className="block text-xs font-black text-[#4b5563] mb-2">
                      {isAr ? 'أو اختر صورة جاهزة بنقرة واحدة:' : 'Or choose a ready photo preset:'}
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_IMAGES.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url)}
                          className={`group relative rounded-lg overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                            imageUrl === preset.url ? 'border-[#1b4332] ring-2 ring-[#1b4332]/30' : 'border-[#e2d8cb] hover:border-[#1b4332]'
                          }`}
                          title={isAr ? preset.titleAr : preset.titleEn}
                        >
                          <img
                            src={preset.url}
                            alt={isAr ? preset.titleAr : preset.titleEn}
                            className="w-full h-12 object-cover rounded-sm group-hover:scale-105 transition-transform"
                          />
                          <span className="block text-[10px] font-black text-center truncate mt-0.5 text-black">
                            {isAr ? preset.titleAr.split(' ')[0] : preset.titleEn.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* زر النشر */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#1b4332] hover:bg-[#143628] text-white font-black text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  {isAr ? 'نشر الوجبة في القائمة المتاحة' : 'Publish Food to Available List'}
                </button>

                <p className="text-xs font-bold text-center text-[#4b5563]">
                  {isAr
                    ? 'يتم حفظ البيانات فورياً في متصفحك محلياً بكل خصوصية ومجاناً.'
                    : 'Saved immediately in local browser storage. Free & anonymous.'}
                </p>

              </form>
            </div>

            {/* ميثاق الأمانة */}
            <div className="bg-[#f5f0e6] border border-[#dfd4c4] rounded-2xl p-5 space-y-2 text-xs sm:text-sm text-black">
              <div className="font-black text-[#1b4332] flex items-center gap-2 text-sm sm:text-base">
                <Info className="w-5 h-5 text-[#1b4332]" />
                {isAr ? 'ميثاق الأمانة والسلامة الغذائية' : 'Food Safety & Community Pledge'}
              </div>
              <p className="leading-relaxed font-bold">
                {isAr
                  ? 'يرجى التأكد من نظافة وصلاحية الطعام وتغليفه بالشكل اللائق وحفظه مبرداً أو في مكان نظيف بعيداً عن أشعة الشمس.'
                  : 'Please ensure food is safe, unexpired, and handled cleanly in appropriate packaging.'}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              العمود الثاني: تصفح الأطعمة المتاحة + الأطعمة المحجوزة
              ------------------------------------------------------------------ */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* قسم تصفح الأطعمة المتاحة */}
            <section id="browse-food-section" className="bg-white rounded-3xl border border-[#e2d8cb] shadow-sm overflow-hidden">
              
              <div className="p-6 border-b border-[#e2d8cb] bg-[#fbf9f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-black flex items-center gap-2.5">
                    <Utensils className="w-6 h-6 text-[#1b4332]" />
                    {isAr ? 'تصفح الأطعمة المتاحة للحجز' : 'Browse Available Food'}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-[#4b5563] mt-1">
                    {isAr ? 'اضغط على "حجز هذه الوجبة" للاستلام وحفظ النعمة' : 'Click "Claim Food" to reserve and collect'}
                  </p>
                </div>

                <div className="text-xs sm:text-sm font-black px-4 py-1.5 rounded-full bg-[#e8f2e8] text-[#1b4332] self-start sm:self-auto tabular-nums">
                  {availableItems.length} {isAr ? 'وجبة متاحة' : 'available'}
                </div>
              </div>

              {/* الفلاتر والبحث */}
              <div className="p-4 border-b border-[#eee5d8] bg-[#fcfbf8] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {(
                    [
                      { id: 'All', labelAr: 'الكل', labelEn: 'All' },
                      { id: 'Cooked', labelAr: 'مطبوخ', labelEn: 'Cooked' },
                      { id: 'Raw', labelAr: 'طازج', labelEn: 'Produce' },
                      { id: 'Packaged', labelAr: 'معلبات ومؤن', labelEn: 'Packaged' },
                      { id: 'Other', labelAr: 'مخبوزات وأخرى', labelEn: 'Bakery' },
                    ] as const
                  ).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedFilter(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
                        selectedFilter === tab.id
                          ? 'bg-[#1b4332] text-white shadow-xs'
                          : 'bg-white text-black border border-[#d8cdbd] hover:bg-[#f4efe8]'
                      }`}
                    >
                      {isAr ? tab.labelAr : tab.labelEn}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث بالاسم أو الموقع...' : 'Search by item or location...'}
                    className="w-full ps-9 pe-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-[#d1c7b8] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]/20 focus:border-[#1b4332]"
                  />
                  <Search className="w-4 h-4 text-[#718096] absolute start-3 top-3.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute end-3 top-3 text-[#718096] hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* شبكة البطاقات */}
              <div className="p-6">
                {availableItems.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#f4ede4] text-[#8c7853] flex items-center justify-center mx-auto">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-lg text-black">
                      {isAr ? 'لا توجد أطعمة متاحة تطابق هذا البحث' : 'No available food matches your search'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4b5563] font-bold max-w-md mx-auto leading-relaxed">
                      {searchQuery || selectedFilter !== 'All'
                        ? (isAr ? 'جرب إعادة ضبط الفلتر أو مسح كلمات البحث' : 'Try clearing filters or search query')
                        : (isAr ? 'تم حجز جميع الوجبات المعروضة! يمكنك إضافة وجبة جديدة للمشاركة عبر النموذج.' : 'All food has been claimed! Use the form to share new surplus food.')}
                    </p>
                    {(searchQuery || selectedFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedFilter('All');
                        }}
                        className="text-xs sm:text-sm font-black text-[#1b4332] underline hover:no-underline cursor-pointer"
                      >
                        {isAr ? 'إعادة تعيين البحث والفلاتر' : 'Reset search & filters'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {availableItems.map(item => {
                      const typeBadge = getTypeBadge(item.type);
                      const IconComponent = typeBadge.icon;
                      const title = isAr ? item.name : (item.nameEn || item.name);
                      const quantityDisplay = isAr ? item.quantity : (item.quantityEn || item.quantity);
                      const locationDisplay = isAr ? item.location : (item.locationEn || item.location);
                      const descDisplay = isAr ? item.description : (item.descriptionEn || item.description);
                      const postedTime = isAr ? item.postedAt : (item.postedAtEn || item.postedAt);

                      return (
                        <div
                          key={item.id}
                          className="group bg-white rounded-2xl border border-[#e2d8cb] hover:border-[#1b4332] p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-1 overflow-hidden"
                        >
                          <div className="space-y-3">
                            
                            {/* صورة الطعام البارزة */}
                            {item.imageUrl && (
                              <div className="relative rounded-xl overflow-hidden h-44 bg-[#f4ede4] mb-2">
                                <img
                                  src={item.imageUrl}
                                  alt={title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                                  }}
                                />
                                <div className="absolute top-2.5 end-2.5">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-xs backdrop-blur-md ${typeBadge.color}`}>
                                    <IconComponent className="w-3.5 h-3.5" />
                                    {typeBadge.label}
                                  </span>
                                </div>
                              </div>
                            )}

                            {!item.imageUrl && (
                              <div className="flex items-center justify-between text-xs font-black text-[#4b5563]">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${typeBadge.color}`}>
                                  <IconComponent className="w-3.5 h-3.5" />
                                  {typeBadge.label}
                                </span>
                                <span className="flex items-center gap-1 text-[#4b5563]">
                                  <Clock className="w-3.5 h-3.5" />
                                  {postedTime}
                                </span>
                              </div>
                            )}

                            {/* اسم الوجبة بخط أسود عريض */}
                            <h3 className="font-headline font-black text-lg text-black leading-snug group-hover:text-[#1b4332] transition-colors">
                              {title}
                            </h3>

                            {/* شريط الكمية والموقع */}
                            <div className="bg-[#fbf9f5] rounded-xl p-3 space-y-2 text-xs sm:text-sm border border-[#e8dfd2]">
                              <div className="flex items-baseline gap-2">
                                <span className="font-black text-[#4b5563] text-xs shrink-0">
                                  {isAr ? 'الكمية:' : 'Qty:'}
                                </span>
                                <span className="font-black text-black">
                                  {quantityDisplay}
                                </span>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                                <span className="text-black font-bold leading-tight">
                                  {locationDisplay}
                                </span>
                              </div>
                            </div>

                            {/* الوصف */}
                            <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-bold line-clamp-3">
                              {descDisplay}
                            </p>

                          </div>

                          {/* زر الحجز */}
                          <div className="pt-4 mt-3 border-t border-[#f0e8dc]">
                            <button
                              onClick={() => setClaimModalItem(item)}
                              className="w-full py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143628] text-white text-xs sm:text-sm font-black shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {isAr ? 'حجز هذه الوجبة الآن' : 'Claim Food Now'}
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </section>

            {/* قسم الأطعمة المحجوزة */}
            <section id="claimed-food-section" className="bg-white rounded-3xl border border-[#e2d8cb] shadow-sm overflow-hidden">
              
              <div className="p-6 border-b border-[#e2d8cb] bg-[#fbf9f5] flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-black flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-[#1b4332]" />
                    {isAr ? 'الأطعمة المحجوزة (المستلمة)' : 'Claimed Food'}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-[#4b5563] mt-1">
                    {isAr ? 'الوجبات التي تم حجزها لإنقاذها وتوصيلها للمستفيدين' : 'Reserved food items for community collection'}
                  </p>
                </div>

                <div className="text-xs sm:text-sm font-black px-4 py-1.5 rounded-full bg-[#fceddd] text-[#9a3412] tabular-nums">
                  {claimedItems.length} {isAr ? 'محجوز' : 'claimed'}
                </div>
              </div>

              <div className="p-6">
                {claimedItems.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-xs sm:text-sm font-black text-[#4b5563]">
                      {isAr
                        ? 'لم يتم حجز أي وجبة حتى الآن. عند حجز طعام من القائمة أعلاه، سيظهر هنا.'
                        : 'No food items claimed yet. Items claimed from the list above will appear here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claimedItems.map(item => {
                      const title = isAr ? item.name : (item.nameEn || item.name);
                      const quantityDisplay = isAr ? item.quantity : (item.quantityEn || item.quantity);
                      const locationDisplay = isAr ? item.location : (item.locationEn || item.location);

                      return (
                        <div
                          key={item.id}
                          className="bg-[#faf8f5] border border-dashed border-[#cfc3b0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f5f0e8] transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={title}
                                referrerPolicy="no-referrer"
                                onError={e => {
                                  (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                                }}
                                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#d8cdbd]"
                              />
                            )}

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap text-xs">
                                <span className="font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                                  {isAr ? 'محجوز ومحفوظ' : 'Claimed & Reserved'}
                                </span>
                                <span className="text-[#718096]">·</span>
                                <span className="text-black font-black">
                                  {isAr ? `الكمية: ${quantityDisplay}` : `Qty: ${quantityDisplay}`}
                                </span>
                              </div>

                              <h4 className="font-headline font-black text-base sm:text-lg text-black">
                                {title}
                              </h4>

                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-black font-bold">
                                <MapPin className="w-4 h-4 text-[#1b4332] shrink-0" />
                                <span>{isAr ? `موقع الاستلام: ${locationDisplay}` : `Pickup at: ${locationDisplay}`}</span>
                              </div>

                              {item.claimedAt && (
                                <p className="text-xs text-[#4b5563] font-bold">
                                  {item.claimedAt}
                                  {item.claimerNote ? ` · Note: "${item.claimerNote}"` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center justify-end">
                            <button
                              onClick={() => handleUnclaim(item)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#d8cdbd] hover:border-red-400 bg-white hover:bg-red-50 text-xs sm:text-sm font-black text-black hover:text-red-700 transition-colors cursor-pointer"
                              title={isAr ? 'إعادة للعرض' : 'Return to Available'}
                            >
                              <RotateCcw className="w-4 h-4" />
                              {isAr ? 'إلغاء الحجز / إعادة للعرض' : 'Release / Return'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </section>

          </div>

        </div>
      </main>

      {/* ====================================================================
          نافذة تأكيد الحجز (Modal)
          ==================================================================== */}
      {claimModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#e2d8cb] shadow-2xl p-6 sm:p-7 space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f2e8] text-[#1b4332] flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <button
                onClick={() => setClaimModalItem(null)}
                className="text-[#a0aec0] hover:text-black p-1.5 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <h3 className="font-headline text-2xl font-black text-black">
                {isAr
                  ? `تأكيد حجز: "${claimModalItem.name}"`
                  : `Confirm Claim: "${claimModalItem.nameEn || claimModalItem.name}"`}
              </h3>
              <p className="text-sm font-bold text-[#4b5563] mt-1.5">
                {isAr
                  ? `أنت على وشك حجز ${claimModalItem.quantity} لحفظ النعمة وسد الحاجة.`
                  : `You are reserving ${claimModalItem.quantityEn || claimModalItem.quantity} for pickup.`}
              </p>
            </div>

            {claimModalItem.imageUrl && (
              <div className="rounded-xl overflow-hidden h-36 border border-[#e2d8cb]">
                <img
                  src={claimModalItem.imageUrl}
                  alt={claimModalItem.name}
                  referrerPolicy="no-referrer"
                  onError={e => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-[#faf8f5] rounded-2xl p-4 border border-[#e8dfd2] space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-black">
                    {isAr ? 'موقع ومكان الاستلام:' : 'Pickup Location:'}
                  </span>
                  <p className="text-black font-bold mt-0.5">
                    {isAr ? claimModalItem.location : (claimModalItem.locationEn || claimModalItem.location)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#4b5563] font-bold pt-2 border-t border-[#ede4d7]">
                {isAr
                  ? 'يرجى الالتزام بموعد وموقع الاستلام تقديراً لجهد صاحب الطعام.'
                  : 'Please pick up promptly to respect the donor and maintain food safety.'}
              </p>
            </div>

            <div>
              <label htmlFor="claimer-note" className="block text-xs sm:text-sm font-black text-black mb-1.5">
                {isAr ? 'ملاحظة اختيارية للاستلام' : 'Optional note / estimated pickup time'}
              </label>
              <input
                id="claimer-note"
                type="text"
                value={claimerNote}
                onChange={e => setClaimerNote(e.target.value)}
                placeholder={isAr ? 'موعد وصولك التقريبي أو هاتفك...' : 'Estimated arrival time or note...'}
                className="w-full px-4 py-3 text-sm font-bold rounded-xl border border-[#d1c7b8] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setClaimModalItem(null)}
                className="flex-1 py-3 px-5 rounded-xl border border-[#d8cdbd] hover:bg-[#f4efe8] text-sm font-black text-[#4b5563] transition-colors cursor-pointer"
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmClaim}
                className="flex-1 py-3 px-5 rounded-xl bg-[#1b4332] hover:bg-[#143628] text-white text-sm font-black shadow-sm transition-all cursor-pointer"
              >
                {isAr ? 'تأكيد الحجز الآن' : 'Confirm Claim'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================================
          إشعار النجاح والتنبيه الفوري
          ==================================================================== */}
      {alertInfo.show && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 start-6 z-50 max-w-md bg-[#1b4332] text-white p-5 rounded-2xl shadow-2xl border-2 border-[#2d6a4f] flex items-start gap-4 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-[#86efac]" />
          </div>
          <div className="flex-1 space-y-1">
            <h5 className="font-black text-sm text-white">
              {alertInfo.title}
            </h5>
            <p className="text-xs sm:text-sm text-[#d8f3dc] leading-relaxed font-bold">
              {alertInfo.message}
            </p>
          </div>
          <button
            onClick={() => setAlertInfo(prev => ({ ...prev, show: false }))}
            className="text-white/70 hover:text-white shrink-0 p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </aside>
      )}

      {/* ====================================================================
          تذييل الصفحة (Footer مع اللوجو الجديد)
          ==================================================================== */}
      <footer className="border-t border-[#e2d8cb] bg-white py-12 px-4 sm:px-6 text-xs sm:text-sm text-[#4b5563]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <img
              src={LOGO_IMAGE_PATH}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover border border-[#c4b9a7]"
            />
            <div>
              <p className="font-black text-black text-sm sm:text-base">
                {isAr ? 'منصة شير بليت (SharePlate) المجتمعية' : 'SharePlate Community Food Platform'}
              </p>
              <p className="text-xs font-bold text-[#4b5563]">
                {isAr
                  ? 'مبادرة لحفظ النعمة وسد حاجة المحتاجين · متعددة اللغات'
                  : 'Zero food waste initiative connecting neighbors in need · Multilingual'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-black text-xs sm:text-sm text-black">
            <a href="#post-food-section" className="hover:text-[#1b4332]">
              {isAr ? 'نشر طعام' : 'Post Food'}
            </a>
            <a href="#browse-food-section" className="hover:text-[#1b4332]">
              {isAr ? 'تصفح الأطعمة' : 'Browse'}
            </a>
            <a href="#claimed-food-section" className="hover:text-[#1b4332]">
              {isAr ? 'المحجوزات' : 'Claimed'}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
