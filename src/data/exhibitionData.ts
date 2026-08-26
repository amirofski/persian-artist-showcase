import { Artwork, ArtistProfile, StoryFragment } from "../types";

export const ARTIST_DATA: ArtistProfile = {
  nameFa: "سارا احمدی",
  nameEn: "Sara Ahmadi",
  titleFa: "نقاش و خوشنویس معاصر",
  titleEn: "Contemporary Painter & Calligrapher",
  locationFa: "تهران — ۱۴۰۵",
  locationEn: "Tehran — 2026",
  bioFa: [
    "سارا احمدی، متولد ۱۳۶۹ در تهران، دانش‌آموختهٔ نقاشی و استاد انجمن خوشنویسان ایران است.",
    "او در آثار خود سنت چند صد سالهٔ خط نستعلیق و شکسته را با اکسپرسیونیسم تجریدی و بافت‌های مات و ارگانیک در هم می‌آمیزد.",
    "آثار او در بینال‌های استانبول، دبی، پاریس و تهران به نمایش درآمده و تجسمی نو از جوهر، نور و هویت ایرانی معاصر را ارائه می‌دهند."
  ],
  statementFa: "برای سارا، نقاشی از جایی شروع شد که کلمات دیگر کافی نبودند. خط، تنها نوشتن نیست؛ رقصی‌ست از امواج سکوت که در فضا امتداد می‌یابد.",
  statementEn: "For Sara, painting began where words were no longer sufficient. Calligraphy is not merely writing; it is a choreography of silence rippling through space.",
  portraitUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
  exhibitions: [
    { year: "۱۴۰۴", titleFa: "طنین بی‌صدا", galleryFa: "گالری اعتماد", cityFa: "تهران" },
    { year: "۱۴۰۳", titleFa: "جوهر و خاکستر", galleryFa: "گالری آران", cityFa: "تهران" },
    { year: "۲۰۲۴", titleFa: "Echoes of Nastaliq", galleryFa: "Leila Heller Gallery", cityFa: "دبی" },
    { year: "۲۰۲۲", titleFa: "Woven Letters", galleryFa: "Institut du Monde Arabe", cityFa: "پاریس" }
  ]
};

export const FEATURED_ARTWORK: Artwork = {
  id: "search-for-silence",
  titleFa: "در جستجوی سکوت",
  titleEn: "In Search of Silence",
  subtitleFa: "طنین حروف در امتداد غبار زمان",
  mediumFa: "نقاشی / ترکیب مواد، ورق طلا و مرکب سنتی روی بوم دست‌ساز",
  yearFa: "۱۴۰۵",
  yearEn: "2026",
  dimensionsFa: "۱۸۰ × ۲۴۰ سانتی‌متر",
  dimensionsEn: "180 × 240 cm",
  descriptionFa: "این اثر تجلیِ لحظه‌ای‌ست که خط نستعلیق از قید معنا رها شده و به فرمی سیال میان پرده‌های تاریک و تلألؤ طلایی تبدیل می‌شود. تاش‌های آزاد قلم‌مو در کنار لایه‌بندی‌های بافتنی، عمقی چند لایه از تفکر و سکون ایجاد کرده است.",
  descriptionEn: "A monumental manifestation of Nastaliq calligraphy breaking free from literal semantic constraints into fluid atmospheric form. Layered traditional soot ink with gold leaf on raw hand-stretched linen.",
  imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
  palette: ["#0b0c10", "#c5a880", "#2b2a26", "#e5cdab", "#6e5d48"],
  theme: "سکوت و معنا",
  featured: true
};

export const GALLERY_ARTWORKS: Artwork[] = [
  {
    id: "breath-of-ink",
    titleFa: "نفسِ مرکب",
    titleEn: "Breath of Ink",
    subtitleFa: "حرکت آزاد خط شکسته در فضا",
    mediumFa: "مرکب دست‌ساز و اکلیک روی کاغذ دست‌ساز ابریشم",
    yearFa: "۱۴۰۴",
    yearEn: "2025",
    dimensionsFa: "۱۴۰ × ۱۹۰ سانتی‌متر",
    dimensionsEn: "140 × 190 cm",
    descriptionFa: "کشش‌های عمیق قلم در میان هاله‌ای از غبار ذرات، روایتی از بازدمی طولانی در خلوت کارگاه.",
    descriptionEn: "Deep sweeping calligraphic gestures amidst luminous dust particles, evoking a contemplative studio trance.",
    imageUrl: "https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/69588/259040/1621838720789_IMG-1255__87845.1687167088.jpg",
    palette: ["#14151a", "#d4af37", "#3a3731"],
    theme: "فرم و فضا"
  },
  {
    id: "forgotten-manuscript",
    titleFa: "نسخهٔ فراموش‌شده",
    titleEn: "The Forgotten Manuscript",
    subtitleFa: "سایه‌روشن‌های خطوط کهن",
    mediumFa: "ترکیب مواد و پیگمنت‌های معدنی روی پارچه کتان",
    yearFa: "۱۴۰۴",
    yearEn: "2025",
    dimensionsFa: "۱۶۰ × ۱۶۰ سانتی‌متر",
    dimensionsEn: "160 × 160 cm",
    descriptionFa: "بازآفرینی فرم‌های خط ثلث و نسخ با ساختاری شکننده و لایه‌لایه، همچون صفحه‌ای که از دل تاریخ سر برآورده است.",
    descriptionEn: "Reinventing classical scripts with fragile, layered mineral pigments reminiscent of excavated historical parchment.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    palette: ["#1b1c22", "#9e8162", "#4a443b"],
    theme: "زمان و حافظه"
  },
  {
    id: "golden-echo",
    titleFa: "پژواک زرین",
    titleEn: "Golden Echo",
    subtitleFa: "درخششِ پنهان در سیاهیِ مطلق",
    mediumFa: "ورق طلای ۲۴ عیار، دوده و لعاب طبیعی",
    yearFa: "۱۴۰۳",
    yearEn: "2024",
    dimensionsFa: "۲۰۰ × ۱۵۰ سانتی‌متر",
    dimensionsEn: "200 × 150 cm",
    descriptionFa: "تلاقی تاریکی غلیظ با انعکاس طلا، الهام‌گرفته از تذهیب‌های کهن مکتب هرات در قالبی کاملاً معاصر.",
    descriptionEn: "Heavy carbon ink colliding with 24k gold leaf, inspired by Herat school illumination reimagined for modern architecture.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop",
    palette: ["#090a0d", "#d1a764", "#504130"],
    theme: "تذهیب معاصر"
  }
];

export const STORY_FRAGMENTS: StoryFragment[] = [
  {
    id: "frag-1",
    lineFa: "برای سارا،",
    sublineFa: "نقاشی از جایی شروع شد که کلمات دیگر کافی نبودند.",
    englishTranslation: "For Sara, painting began where words were no longer sufficient.",
    accent: true
  },
  {
    id: "frag-2",
    lineFa: "حرکت قلم‌مو، ثبت یک تفکر نیست؛",
    sublineFa: "بلکه تنفسِ دوبارهٔ هویتی‌ست که در میان رگه‌های جوهر تپش دارد.",
    englishTranslation: "The stroke of the reed is not the recording of a thought; it is the resurgence of an identity pulsing through ink veins."
  },
  {
    id: "frag-3",
    lineFa: "نستعلیق، عروسِ خطوط جهان،",
    sublineFa: "اینجا نه در خدمت متن، بلکه به عنوان کالبدِ نور و سایه متولد می‌شود.",
    englishTranslation: "Nastaliq, the bride of scripts, is born here not in service of text, but as an embodiment of light and shadow.",
    accent: true
  },
  {
    id: "frag-4",
    lineFa: "در تاریکیِ گالری،",
    sublineFa: "هر ذرهٔ غبار حامل نغمه‌ای‌ست از گذشته تا ابدیت.",
    englishTranslation: "In the gallery's dusk, every grain of dust carries a melody stretching from antiquity to eternity."
  }
];
