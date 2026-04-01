# Nusrat International - MongoDB Database Schema
## Comprehensive Schema for Dynamic Travel, Hajj & Work Packages

This schema is designed based on your existing HTML structure to make all content dynamic while maintaining your current page architecture.

---

## 📊 Overview

Your website has **3 main package types** with listing pages and detail pages:

| Package Type | Listing Page | Detail Page | Card Types |
|-------------|--------------|-------------|------------|
| **Travel** | `/Travel.html` | `/travel-detail.html` | Multiple card variations |
| **Hajj** | `/Hajj.html` | `/hajj-detail.html` | Horizontal cards |
| **Work** | `/Work.html` | `/work-detail.html` | Work-specific cards |

Plus a **Home Page** (`/index.html`) that displays featured packages from all categories.

---

## 🗄️ Collection Structure

### 1. **travel_packages** Collection
For all travel/tourism packages displayed on `Travel.html` and `travel-detail.html`.

```javascript
{
  _id: ObjectId,
  slug: "santorini-greece-package", // URL-friendly identifier
  type: "travel", // Fixed: "travel"
  
  // === CARD DISPLAY DATA (for Travel.html & index.html) ===
  title: {
    en: "Santorini, Greece",
    bn: "সান্তোরিনি, গ্রীস"
  },
  shortDescription: {
    en: "Whitewashed houses and magical sunsets over the Aegean Sea.",
    bn: "সাদা রঙের বাড়ি ও এজিয়ান সাগরের মনোমুগ্ধকর সূর্যাস্ত।"
  },
  coverImage: "/uploads/packages/travel/santorini-cover.jpg",
  price: {
    amount: 799,
    currency: "USD",
    displayText: "$799"
  },
  duration: {
    days: 7,
    displayText: "7 Days"
  },
  rating: 4.8,
  isFeatured: true, // Show on homepage
  order: 1, // Display order
  
  // === DETAIL PAGE DATA (for travel-detail.html) ===
  fullDescription: {
    en: "<p>Experience the magic of Santorini with its iconic whitewashed houses, magical sunsets over the Aegean Sea, and charming villages.</p>",
    bn: "<p>সান্তোরিনির আইকনিক সাদা বাড়ি, এজিয়ান সাগরের মনোমুগ্ধকর সূর্যাস্ত এবং charming গ্রামগুলো অভিজ্ঞতা নিন।</p>"
  },
  
  // Gallery images (shown in detail page gallery)
  gallery: [
    {
      imageUrl: "/uploads/packages/travel/santorini-01.jpg",
      thumbnailUrl: "/uploads/packages/travel/thumbs/santorini-01.jpg",
      caption: {
        en: "Oia Village, Santorini",
        bn: "ওইয়া গ্রাম, সান্তোরিনি"
      },
      order: 1
    },
    {
      imageUrl: "/uploads/packages/travel/santorini-02.jpg",
      thumbnailUrl: "/uploads/packages/travel/thumbs/santorini-02.jpg",
      caption: {
        en: "Aegean Sea View",
        bn: "এজিয়ান সাগরের দৃশ্য"
      },
      order: 2
    }
  ],
  
  // Package highlights (icons + text)
  highlights: [
    {
      icon: "🏨",
      title: { en: "Cave Hotel", bn: "কেভ হোটেল" },
      description: { en: "Traditional accommodation in Oia", bn: "ওইয়ায় ঐতিহ্যবাহী আবাসন" }
    },
    {
      icon: "🌅",
      title: { en: "Sunset Cruise", bn: "সানসেট ক্রুজ" },
      description: { en: "Caldera sailing experience", bn: "ক্যালডেরা পালতোলা অভিজ্ঞতা" }
    },
    {
      icon: "🍷",
      title: { en: "Wine Tasting", bn: "ওয়াইন টেস্টিং" },
      description: { en: "Local vineyard tours", bn: "স্থানীয় আঙ্গুর ক্ষেত ভ্রমণ" }
    }
  ],
  
  // Day-by-day itinerary
  itinerary: [
    {
      day: 1,
      title: { en: "Arrival in Santorini", bn: "সান্তোরিনিতে আগমন" },
      description: {
        en: "Arrive at Santorini Airport, transfer to your cave hotel in Oia. Welcome dinner with sunset views.",
        bn: "সান্তোরিনি বিমানবন্দরে পৌঁছানো, ওইয়াতে আপনার কেভ হোটেলে স্থানান্তর। সূর্যাস্তের দৃশ্য সহ স্বাগত নৈশভোজ।"
      }
    },
    {
      day: 2,
      title: { en: "Explore Oia Village", bn: "ওইয়া গ্রাম ঘুরে দেখুন" },
      description: {
        en: "Guided walking tour through Oia's narrow streets, visit the famous blue-domed churches and art galleries.",
        bn: "ওইয়ার সরু গলিগুলোর মধ্য দিয়ে গাইডেড হাঁটার ভ্রমণ, বিখ্যাত নীল গম্বুজ গির্জা এবং আর্ট গ্যালারি পরিদর্শন।"
      }
    }
  ],
  
  // Included/Excluded items
  included: [
    "6 nights cave hotel accommodation",
    "Daily Greek breakfast",
    "Airport transfers (round trip)",
    "Sunset caldera cruise with BBQ",
    "Wine tasting tour",
    "Guided Oia & Fira tours",
    "Travel insurance"
  ],
  excluded: [
    "International flights",
    "Lunch & dinner (except cruise)",
    "Personal expenses & tips"
  ],
  
  // Quote displayed on detail page
  quote: {
    text: {
      en: "Travel is the only thing you buy that makes you richer.",
      bn: "ভ্রমণই একমাত্র জিনিস যা কিনলে আপনি আরও ধনী হন।"
    },
    author: "Anonymous"
  },
  
  // Booking/contact info
  bookingInfo: {
    phoneNumber: "+880-1713-165116",
    whatsappNumber: "+880-1713-165116",
    email: "info@nusrat-intl.com"
  },
  
  // SEO & Metadata
  metaTitle: "Santorini Greece Travel Package - Nusrat Travels",
  metaDescription: "7-day Santorini travel package with cave hotel, sunset cruise, and wine tasting. Book now with Nusrat Travels.",
  keywords: ["santorini", "greece", "travel package", "aegean sea"],
  
  // Status
  isActive: true,
  isAvailable: true,
  createdAt: ISODate("2024-01-15"),
  updatedAt: ISODate("2024-01-15")
}
```

---

### 2. **hajj_packages** Collection
For all Hajj & Umrah packages displayed on `Hajj.html` and `hajj-detail.html`.

```javascript
{
  _id: ObjectId,
  slug: "standard-hajj-package-2024",
  type: "hajj", // "hajj" or "umrah"
  subType: "standard", // standard, premium, economy, vip
  
  // === CARD DISPLAY DATA (for Hajj.html & index.html) ===
  title: {
    en: "Standard Hajj Package",
    bn: "স্ট্যান্ডার্ড হজ প্যাকেজ"
  },
  shortDescription: {
    en: "21-day complete hajj package with accommodation in Makkah & Madinah.",
    bn: "মক্কা ও মদীনায় আবাসন সহ ২১ দিনের সম্পূর্ণ হজ প্যাকেজ।"
  },
  coverImage: "/uploads/packages/hajj/standard-hajj-cover.jpg",
  price: {
    amount: 2999,
    currency: "USD",
    displayText: "$2,999"
  },
  duration: {
    days: 21,
    displayText: "21 Days"
  },
  rating: 4.8,
  isFeatured: true,
  order: 1,
  
  // === DETAIL PAGE DATA (for hajj-detail.html) ===
  fullDescription: {
    en: "<p>A complete 21-day Hajj package with accommodation in both Makkah and Madinah. Fully guided by experienced Islamic scholars.</p>",
    bn: "<p>মক্কা ও মদীনায় আবাসন সহ ২১ দিনের সম্পূর্ণ হজ প্যাকেজ। অভিজ্ঞ আলেমদের গাইডেন্সে সকল কার্যক্রম পরিচালিত।</p>"
  },
  
  gallery: [
    {
      imageUrl: "/uploads/packages/hajj/masjid-al-haram.jpg",
      thumbnailUrl: "/uploads/packages/hajj/thumbs/masjid-al-haram.jpg",
      caption: {
        en: "Masjid al-Haram, Makkah",
        bn: "মসজিদ আল-হারাম, মক্কা"
      },
      order: 1
    },
    {
      imageUrl: "/uploads/packages/hajj/madinah.jpg",
      thumbnailUrl: "/uploads/packages/hajj/thumbs/madinah.jpg",
      caption: {
        en: "Madinah al-Munawwarah",
        bn: "মদিনা আল-মুনাব্বারাহ"
      },
      order: 2
    }
  ],
  
  highlights: [
    {
      icon: "🕋",
      title: { en: "Makkah Stay", bn: "মক্কায় অবস্থান" },
      description: { en: "Hotel near Masjid al-Haram", bn: "মসজিদ আল-হারামের কাছে হোটেল" }
    },
    {
      icon: "🕌",
      title: { en: "Madinah Stay", bn: "মদীনায় অবস্থান" },
      description: { en: "Hotel near Masjid an-Nabawi", bn: "মসজিদে নববীর কাছে হোটেল" }
    },
    {
      icon: "✈️",
      title: { en: "Return Flights", bn: "রিটার্ন ফ্লাইট" },
      description: { en: "Direct from Dhaka", bn: "ঢাকা থেকে সরাসরি" }
    }
  ],
  
  // Programme/Schedule (specific to Hajj)
  programme: [
    {
      day: 1,
      title: { en: "Departure from Dhaka", bn: "ঢাকা থেকে যাত্রা" },
      description: {
        en: "Group assembly at Hazrat Shahjalal Airport. Don Ihram, fly to Jeddah.",
        bn: "হযরত শাহজালাল বিমানবন্দরে গ্রুপ সমাবেশ। ইহরাম বেঁধে জেদ্দার উড়ান।"
      }
    },
    {
      day: 2,
      title: { en: "Arrival in Makkah", bn: "মক্কায় পৌঁছানো" },
      description: {
        en: "Check-in hotel, perform Tawaf al-Qudum (welcome tawaf), rest and lectures.",
        bn: "হোটেলে চেক-ইন, তাওয়াফ আল-কুদুম (স্বাগত তাওয়াফ), বিশ্রাম এবং лекция।"
      }
    }
  ],
  
  included: [
    "Return airfare Dhaka–Jeddah",
    "21 nights accommodation",
    "Makkah–Madinah bus transfers",
    "Hajj visa processing",
    "Mina tent & Arafat transport",
    "Guided group ziyarat",
    "Travel insurance"
  ],
  excluded: [
    "Personal expenses",
    "Qurbani (sacrifice) cost",
    "Vaccinations"
  ],
  
  // Quranic verse for detail page
  quranicVerse: {
    arabic: "وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ",
    translation: {
      en: "Complete the Hajj and Umrah for Allah.",
      bn: "আল্লাহর জন্য হজ ও উমরাহ পূর্ণ কর।"
    },
    reference: "Al-Baqarah 2:196"
  },
  
  // Additional Hajj-specific fields
  accommodation: {
    makkah: {
      hotelName: "Al-Haram Hotel",
      distanceFromHaram: "200 meters",
      starRating: 4
    },
    madinah: {
      hotelName: "Anbar Hotel",
      distanceFromNabawi: "300 meters",
      starRating: 4
    }
  },
  
  scholarGuide: {
    name: "Sheikh Abdullah Al-Rahman",
    qualification: "PhD in Islamic Studies",
    experience: "15 years"
  },
  
  bookingInfo: {
    phoneNumber: "+880-1713-165116",
    whatsappNumber: "+880-1713-165116",
    email: "hajj@nusrat-intl.com"
  },
  
  // Season/Year
  season: "2024",
  
  // SEO & Metadata
  metaTitle: "Standard Hajj Package 2024 - Nusrat International",
  metaDescription: "Complete 21-day Hajj package with Makkah & Madinah accommodation. Guided by experienced scholars.",
  keywords: ["hajj package", "hajj 2024", "makkah", "madinah", "bangladesh"],
  
  isActive: true,
  isAvailable: true,
  createdAt: ISODate("2024-01-15"),
  updatedAt: ISODate("2024-01-15")
}
```

---

### 3. **work_packages** Collection
For all work visa/employment packages displayed on `Work.html` and `work-detail.html`.

```javascript
{
  _id: ObjectId,
  slug: "malaysia-work-visa-2024",
  type: "work",
  
  // === CARD DISPLAY DATA (for Work.html & index.html) ===
  title: {
    en: "Malaysia Work Visa",
    bn: "মালয়েশিয়া ওয়ার্ক ভিসা"
  },
  shortDescription: {
    en: "Factory & construction work with competitive salary and benefits.",
    bn: "কারখানা ও নির্মাণ কাজ, প্রতিযোগিতামূলক বেতন সহ।"
  },
  coverImage: "/uploads/packages/work/malaysia-work-cover.jpg",
  processingFee: {
    amount: 599,
    currency: "USD",
    displayText: "$599"
  },
  contractDuration: {
    years: 2,
    displayText: "2 Years"
  },
  location: {
    country: "Malaysia",
    cities: ["Kuala Lumpur", "Penang"],
    flag: "🇲🇾"
  },
  rating: 4.7,
  isFeatured: true,
  order: 1,
  
  // === DETAIL PAGE DATA (for work-detail.html) ===
  fullDescription: {
    en: "<p>Secure your future with our Malaysia Work Visa program. We offer placement in manufacturing, plantation, and construction sectors.</p>",
    bn: "<p>মালয়েশিয়ায় কর্মসংস্থান নিশ্চিত করুন। মাসিক MYR ১,৫০০ থেকে ২,৫০০ বেতনে কারখানা, বাগান ও নির্মাণ খাতে চাকরির সুযোগ।</p>"
  },
  
  gallery: [
    {
      imageUrl: "/uploads/packages/work/malaysia-kl.jpg",
      thumbnailUrl: "/uploads/packages/work/thumbs/malaysia-kl.jpg",
      caption: {
        en: "Kuala Lumpur City Center",
        bn: "কুয়ালালামপুর সিটি সেন্টার"
      },
      order: 1
    },
    {
      imageUrl: "/uploads/packages/work/factory.jpg",
      thumbnailUrl: "/uploads/packages/work/thumbs/factory.jpg",
      caption: {
        en: "Manufacturing Factory",
        bn: "উৎপাদন কারখানা"
      },
      order: 2
    }
  ],
  
  // Job highlights
  jobHighlights: [
    {
      icon: "💰",
      title: { en: "Competitive Salary", bn: "প্রতিযোগিতামূলক বেতন" },
      description: { en: "MYR 1,500–2,500/month", bn: "MYR ১,৫০০–২,৫০০/মাস" }
    },
    {
      icon: "🏭",
      title: { en: "Sectors", bn: "সেক্টরসমূহ" },
      description: { en: "Manufacturing, Plantation, Construction", bn: "উৎপাদন, বাগান, নির্মাণ" }
    },
    {
      icon: "🏠",
      title: { en: "Accommodation", bn: "আবাসন" },
      description: { en: "Provided by employer", bn: "নিয়োগকর্তা প্রদত্ত" }
    }
  ],
  
  // Application process steps
  applicationProcess: [
    {
      step: 1,
      title: { en: "Submit Application", bn: "আবেদন জমা দিন" },
      description: {
        en: "Fill out the application form with your personal details, educational background, and work experience.",
        bn: "আপনার ব্যক্তিগত বিবরণ, শিক্ষাগত যোগ্যতা এবং কাজের অভিজ্ঞতা সহ আবেদন ফর্ম পূরণ করুন।"
      }
    },
    {
      step: 2,
      title: { en: "Document Verification", bn: "নথি যাচাইকরণ" },
      description: {
        en: "Our team verifies all documents and submits your application to the Malaysian Immigration Department.",
        bn: "আমাদের দল সমস্ত নথি যাচাই করে এবং মালয়েশিয়া ইমিগ্রেশন বিভাগে আপনার আবেদন জমা দেয়।"
      }
    }
  ],
  
  // Requirements & Benefits
  requirements: [
    "Valid passport (minimum 18 months)",
    "Age: 18–45 years",
    "Minimum SSC education",
    "Medical fitness certificate",
    "No criminal record"
  ],
  benefits: [
    "Round-trip flight ticket",
    "Employer-provided accommodation",
    "Medical insurance",
    "24/7 support during contract"
  ],
  
  // Salary information
  salary: {
    min: 1500,
    max: 2500,
    currency: "MYR",
    period: "month",
    displayText: "MYR 1,500–2,500 per month"
  },
  
  // Sectors available
  sectors: ["Manufacturing", "Plantation", "Construction", "Hospitality"],
  
  // Quote for detail page
  quote: {
    text: {
      en: "Opportunities don't happen. You create them.",
      bn: "সুযোগ তৈরি করতে হয়, সুযোগ ঘটে না।"
    },
    author: "Chris Grosser"
  },
  
  bookingInfo: {
    phoneNumber: "+880-1713-165116",
    whatsappNumber: "+880-1713-165116",
    email: "work@nusrat-intl.com"
  },
  
  // SEO & Metadata
  metaTitle: "Malaysia Work Visa 2024 - Nusrat International",
  metaDescription: "Apply for Malaysia work visa. Factory, plantation, and construction jobs with competitive salary.",
  keywords: ["malaysia work visa", "work abroad", "bangladesh to malaysia", "overseas employment"],
  
  isActive: true,
  isAvailable: true,
  createdAt: ISODate("2024-01-15"),
  updatedAt: ISODate("2024-01-15")
}
```

---

### 4. **homepage_content** Collection
Dynamic content for `index.html` - hero slider, certifications, ticketing section, etc.

```javascript
{
  _id: ObjectId,
  pageSlug: "home",
  
  // Hero Slider Section
  heroSlider: {
    isActive: true,
    slides: [
      {
        slideId: "slide-1",
        backgroundImage: "/uploads/homepage/hero-slide-1.jpg",
        tag: { en: "✦ DISCOVER THE WORLD", bn: "✦ বিশ্ব আবিষ্কার করুন" },
        heading: {
          en: "Explore Beyond The Horizon",
          bn: "দিগন্তের ওপারে অভিযান"
        },
        description: {
          en: "Unforgettable journeys crafted for the curious soul.",
          bn: "উৎসুক আত্মার জন্য অসাধারণ যাত্রা।"
        },
        buttonText: { en: "Start Exploring", bn: "অন্বেষণ শুরু করুন" },
        buttonLink: "#travel",
        order: 1
      },
      {
        slideId: "slide-2",
        backgroundImage: "/uploads/homepage/hero-slide-2.jpg",
        tag: { en: "✦ SACRED JOURNEY", bn: "✦ পবিত্র যাত্রা" },
        heading: {
          en: "Perform Hajj with Peace of Mind",
          bn: "নিশ্চিন্তে হজ পালন করুন"
        },
        description: {
          en: "Complete guidance and support for your spiritual journey.",
          bn: "আধ্যাত্মিক যাত্রায় সম্পূর্ণ গাইডেন্স এবং সহায়তা।"
        },
        buttonText: { en: "View Hajj Packages", bn: "হজ প্যাকেজ দেখুন" },
        buttonLink: "#hajj",
        order: 2
      }
    ]
  },
  
  // Certifications Section
  certificationsSection: {
    isActive: true,
    heading: {
      en: "Our Services",
      bn: "আমাদের সেবাসমূহ"
    },
    subHeading: {
      en: "Popular Destinations",
      bn: "জনপ্রিয় গন্তব্যসমূহ"
    },
    mainBadge: {
      code: "RL-1429",
      label: {
        en: "Govt. Approved Recruiting Agency",
        bn: "সরকার অনুমোদিত নিয়োগ সংস্থা"
      }
    },
    description: {
      en: "Bangladesh Government approved recruiting agency, operating legally and transparently under full government oversight since 2010.",
      bn: "২০১০ সাল থেকে সম্পূর্ণ সরকারি তত্ত্বাবধানে আইনানুগ ও স্বচ্ছভাবে পরিচালিত বাংলাদেশ সরকার অনুমোদিত নিয়োগ সংস্থা।"
    },
    cards: [
      {
        cardId: "baira",
        logo: "/uploads/certifications/baira-logo.jpg",
        title: { en: "BAIRA Member", bn: "বাইরা সদস্য" },
        description: {
          en: "Bangladesh Association of International Recruiting Agencies — the national body ensuring ethical overseas employment practices.",
          bn: "বাংলাদেশ আন্তর্জাতিক নিয়োগ সংস্থা সমিতি — নৈতিক বৈদেশিক কর্মসংস্থান অনুশীলন নিশ্চিতকারী জাতীয় সংস্থা।"
        },
        tag: { en: "Manpower Recruiting", bn: "মানবসম্পদ নিয়োগ" },
        isFeatured: false,
        order: 1
      },
      {
        cardId: "iata",
        logo: "/uploads/certifications/iata-logo.jpg",
        title: { en: "IATA Accredited", bn: "আইএটিএ অনুমোদিত" },
        description: {
          en: "International Air Transport Association accreditation — the highest global standard for airline ticketing.",
          bn: "আন্তর্জাতিক বিমান পরিবহন সমিতি অনুমোদন — এয়ারলাইন টিকেটিংয়ের সর্বোচ্চ বৈশ্বিক মান।"
        },
        tag: { en: "Aviation & Travel", bn: "বিমানচালনা ও ভ্রমণ" },
        isFeatured: true,
        order: 2
      },
      {
        cardId: "atab",
        logo: "/uploads/certifications/atab-logo.jpg",
        title: { en: "ATAB Member", bn: "এটাব সদস্য" },
        description: {
          en: "Association of Travel Agents of Bangladesh — ensuring professional standards in travel services.",
          bn: "বাংলাদেশ ট্রাভেল এজেন্টস অ্যাসোসিয়েশন — ভ্রমণ সেবায় পেশাদার মান নিশ্চিতকরণ।"
        },
        tag: { en: "Travel Agency", bn: "ট্রাভেল এজেন্সি" },
        isFeatured: false,
        order: 3
      }
    ]
  },
  
  // Ticketing Section
  ticketingSection: {
    isActive: true,
    heading: {
      en: "We Manage Ticketing Services",
      bn: "আমরা টিকেটিং সেবা পরিচালনা করি"
    },
    subHeading: {
      en: "Ticketing Services for These Countries",
      bn: "এই দেশগুলোর জন্য টিকেটিং সেবা"
    },
    description: {
      en: "As an IATA-accredited agency, Nusrat Travels provides direct airline ticketing to 20+ major global destinations. Fast, reliable, and affordable.",
      bn: "আইএটিএ-অনুমোদিত সংস্থা হিসেবে, নusrat Travels ২০+ প্রধান বৈশ্বিক গন্তব্যে সরাসরি এয়ারলাইন টিকেটিং প্রদান করে। দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী।"
    },
    ctaButton: {
      text: { en: "Book Your Ticket →", bn: "আপনার টিকেট বুক করুন →" },
      link: "Contact.html"
    },
    countries: [
      { flag: "🇸🇦", name: { en: "Saudi Arabia", bn: "সৌদি আরব" } },
      { flag: "🇦🇪", name: { en: "UAE / Dubai", bn: "ইউএই / দুবাই" } },
      { flag: "🇶🇦", name: { en: "Qatar", bn: "কাতার" } },
      { flag: "🇰🇼", name: { en: "Kuwait", bn: "কুয়েত" } },
      { flag: "🇧🇭", name: { en: "Bahrain", bn: "বাহরাইন" } },
      { flag: "🇴🇲", name: { en: "Oman", bn: "ওমান" } },
      { flag: "🇲🇾", name: { en: "Malaysia", bn: "মালয়েশিয়া" } },
      { flag: "🇸🇬", name: { en: "Singapore", bn: "সিঙ্গাপুর" } },
      { flag: "🇰🇷", name: { en: "South Korea", bn: "দক্ষিণ কোরিয়া" } },
      { flag: "🇯🇵", name: { en: "Japan", bn: "জাপান" } },
      { flag: "🇬🇧", name: { en: "United Kingdom", bn: "যুক্তরাজ্য" } },
      { flag: "🇩🇪", name: { en: "Germany", bn: "জার্মানি" } },
      { flag: "🇮🇹", name: { en: "Italy", bn: "ইতালি" } },
      { flag: "🇵🇱", name: { en: "Poland", bn: "পোল্যান্ড" } },
      { flag: "🇹🇷", name: { en: "Turkey", bn: "তুরস্ক" } },
      { flag: "🇹🇭", name: { en: "Thailand", bn: "থাইল্যান্ড" } },
      { flag: "🇮🇳", name: { en: "India", bn: "ভারত" } },
      { flag: "🇨🇳", name: { en: "China", bn: "চীন" } },
      { flag: "🇺🇸", name: { en: "USA", bn: "যুক্তরাষ্ট্র" } },
      { flag: "🇦🇺", name: { en: "Australia", bn: "অস্ট্রেলিয়া" } }
    ],
    contactBar: {
      phone: "01713-165116",
      whatsapp: "+880-1713-165116"
    }
  },
  
  // Featured Packages (for each category on homepage)
  featuredPackages: {
    travel: {
      heading: { en: "Popular Destinations", bn: "জনপ্রিয় গন্তব্যসমূহ" },
      description: {
        en: "Hand-picked destinations for the modern explorer. Adventure awaits at every turn.",
        bn: "আধুনিক অভিযাত্রীদের জন্য নির্বাচিত গন্তব্য। প্রতিটি মোড়ে অপেক্ষা করছে দুর্দান্ত অভিজ্ঞতা।"
      },
      viewAllLink: "Travel.html",
      limit: 6 // Number of cards to show on homepage
    },
    hajj: {
      heading: { en: "Sacred Journey Packages", bn: "পবিত্র হজ প্যাকেজসমূহ" },
      description: {
        en: "Embark on the most sacred journey of your life. We take care of every detail.",
        bn: "আপনার জীবনের সবচেয়ে পবিত্র যাত্রায় অংশ নিন। আমরা প্রতিটি বিবরণ যত্নে সামলাই।"
      },
      featuredImage: "/uploads/homepage/kaaba-featured.jpg",
      featuredOverlay: {
        heading: { en: "Experience the Divine", bn: "ঐশ্বরিক অভিজ্ঞতা নিন" },
        subheading: { en: "Welcome to Allah's House", bn: "আল্লাহর ঘরের পথে আপনাকে স্বাগতম" },
        tagline: {
          en: "Complete Hajj & Umrah packages with full guidance and support",
          bn: "পূর্ণ গাইডেন্স এবং সহায়তায় সম্পূর্ণ হজ ও উমরাহ প্যাকেজ"
        }
      },
      viewAllLink: "Hajj.html",
      limit: 3 // Horizontal cards on homepage
    },
    work: {
      heading: { en: "Work Abroad Programs", bn: "বিদেশে কাজের সুযোগ" },
      description: {
        en: "Build your career internationally. We handle visas, accommodation, and job placements.",
        bn: "আন্তর্জাতিকভাবে আপনার ক্যারিয়ার গড়ুন। আমরা ভিসা, আবাসন এবং চাকরির ব্যবস্থা করি।"
      },
      viewAllLink: "Work.html",
      limit: 6
    }
  },
  
  updatedAt: ISODate("2024-01-15")
}
```

---

### 5. **media_library** Collection
Central repository for all uploaded images and files.

```javascript
{
  _id: ObjectId,
  fileName: "santorini-sunset.jpg",
  originalName: "IMG_20240115_sunset.jpg",
  filePath: "/uploads/packages/travel/santorini-sunset.jpg",
  thumbnailPath: "/uploads/packages/travel/thumbs/santorini-sunset.jpg",
  publicUrl: "https://nusrat-intl.com/uploads/packages/travel/santorini-sunset.jpg",
  fileType: "image/jpeg",
  fileSize: 2458624, // bytes
  dimensions: {
    width: 1920,
    height: 1080
  },
  altText: {
    en: "Beautiful sunset in Santorini",
    bn: "সান্তোরিনিতে সুন্দর সূর্যাস্ত"
  },
  caption: {
    en: "Sunset view from Oia village",
    bn: "ওইয়া গ্রাম থেকে সূর্যাস্তের দৃশ্য"
  },
  category: "travel_package", // travel_package, hajj_package, work_package, certification, gallery, employee, homepage
  tags: ["santorini", "greece", "sunset", "travel"],
  usedIn: [
    {
      collection: "travel_packages",
      documentId: ObjectId("..."),
      field: "gallery"
    }
  ],
  uploadedBy: "admin",
  uploadedAt: ISODate("2024-01-15"),
  usageCount: 3
}
```

---

### 6. **site_settings** Collection
Global configuration for the entire website.

```javascript
{
  _id: ObjectId,
  settingKey: "site_config",
  
  siteInfo: {
    name: "Nusrat International",
    tagline: {
      en: "Your trusted partner for Hajj, Umrah, travel & work",
      bn: "হজ, উমরাহ, ভ্রমণ ও কাজের জন্য আপনার বিশ্বস্ত অংশীদার"
    },
    logo: "/uploads/logo.png",
    favicon: "/uploads/favicon.ico"
  },
  
  contactInfo: {
    phone: "+880-1713-165116",
    altPhone: "+880-1XXX-XXXXXX",
    email: "info@nusrat-intl.com",
    whatsapp: "+880-1713-165116",
    address: {
      en: "Banani Super Market, Dhaka, Bangladesh",
      bn: "বনানী সুপার মার্কেট, ঢাকা, বাংলাদেশ"
    },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7194346099836!2d90.4049653103119!3d23.79300323072133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70e90bb671d%3A0x7eab77d0896252c0!2sBanani%20Super%20Market!5e0!3m2!1sen!2sbd!4v1771968108612!5m2!1sen!2sbd"
  },
  
  socialMedia: {
    facebook: "https://facebook.com/nusratintl",
    youtube: "https://youtube.com/nusratintl",
    instagram: "https://instagram.com/nusratintl",
    whatsapp: "https://wa.me/8801713165116",
    linkedin: "https://linkedin.com/company/nusratintl"
  },
  
  seo: {
    defaultTitle: "Nusrat International - Hajj, Travel & Work Services",
    defaultDescription: "Leading Hajj, Umrah, international travel and work visa services provider in Bangladesh since 2010.",
    defaultKeywords: ["hajj", "umrah", "travel", "work visa", "bangladesh", "nusrat international"]
  },
  
  footerText: {
    en: "Your trusted partner for Hajj, Umrah, travel & work. Serving Bangladesh since 2010.",
    bn: "হজ, উমরাহ, ভ্রমণ ও কাজের জন্য আপনার বিশ্বস্ত অংশীদার। ২০১০ সাল থেকে বাংলাদেশে সেবা প্রদান করছি।"
  },
  
  copyrightText: {
    en: "© 2026 Nusrat International Bangladesh. All rights reserved.",
    bn: "© ২০২৬ নusrat International বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।"
  },
  
  religiousPhrase: {
    arabic: "سبحان الله",
    bn: "সর্বস্বত্ব সংরক্ষিত"
  },
  
  colors: {
    primary: "#1a5f7a",
    secondary: "#159895",
    accent: "#57c5b6",
    gold: "#d4af37", // For Hajj sections
    green: "#27ae60" // For Work sections
  },
  
  updatedAt: ISODate("2024-01-15")
}
```

---

## 🖼️ Image Upload Folder Structure

```
/uploads
├── logo.png
├── favicon.ico
├── packages/
│   ├── travel/
│   │   ├── thumbs/
│   │   ├── santorini-cover.jpg
│   │   └── santorini-01.jpg
│   ├── hajj/
│   │   ├── thumbs/
│   │   ├── standard-hajj-cover.jpg
│   │   └── masjid-al-haram.jpg
│   └── work/
│       ├── thumbs/
│       ├── malaysia-work-cover.jpg
│       └── factory.jpg
├── certifications/
│   ├── baira-logo.jpg
│   ├── iata-logo.jpg
│   └── atab-logo.jpg
├── homepage/
│   ├── hero-slide-1.jpg
│   ├── hero-slide-2.jpg
│   └── kaaba-featured.jpg
└── gallery/
    └── thumbs/
```

---

## 🔌 API Endpoints Structure

### Package APIs
```
GET    /api/packages/travel          - Get all travel packages
GET    /api/packages/travel/:slug    - Get single travel package by slug
GET    /api/packages/hajj            - Get all hajj packages
GET    /api/packages/hajj/:slug      - Get single hajj package
GET    /api/packages/work            - Get all work packages
GET    /api/packages/work/:slug      - Get single work package

POST   /api/packages/travel          - Create new travel package (Admin)
PUT    /api/packages/travel/:id      - Update travel package (Admin)
DELETE /api/packages/travel/:id      - Delete travel package (Admin)
```

### Homepage Content API
```
GET    /api/homepage                 - Get all homepage content
PUT    /api/homepage                 - Update homepage content (Admin)
```

### Media Upload API
```
POST   /api/upload                   - Upload image/file
GET    /api/media                    - Get all media files
DELETE /api/media/:id                - Delete media file (Admin)
```

### Site Settings API
```
GET    /api/settings                 - Get site settings
PUT    /api/settings                 - Update site settings (Admin)
```

---

## 📝 Sample Queries

### Get featured travel packages for homepage:
```javascript
db.travel_packages.find({ 
  isFeatured: true, 
  isActive: true, 
  isAvailable: true 
}).limit(6).sort({ order: 1 })
```

### Get all active Hajj packages:
```javascript
db.hajj_packages.find({ 
  isActive: true, 
  isAvailable: true 
}).sort({ order: 1 })
```

### Get single package by slug (for detail page):
```javascript
db.travel_packages.findOne({ 
  slug: "santorini-greece-package",
  isActive: true 
})
```

### Get homepage content:
```javascript
db.homepage_content.findOne({ 
  pageSlug: "home" 
})
```

---

## 🚀 Implementation Roadmap

### Phase 1: Database Setup
1. Install MongoDB (local or MongoDB Atlas)
2. Install Mongoose: `npm install mongoose`
3. Create Mongoose models for each collection
4. Seed initial data

### Phase 2: Backend API
1. Set up Express.js routes
2. Implement CRUD operations for packages
3. Create file upload endpoint with Multer
4. Add authentication for admin routes

### Phase 3: Frontend Integration
1. Replace static HTML cards with dynamic API calls
2. Create reusable card components
3. Implement client-side routing for detail pages
4. Add loading states and error handling

### Phase 4: Admin Panel
1. Build admin dashboard UI
2. Create forms for adding/editing packages
3. Implement image upload functionality
4. Add package management (activate/deactivate, reorder)

---

## ✅ Key Features

- **Bilingual Support**: All text fields support English (en) and Bengali (bn)
- **Dynamic Cards**: Add/remove packages without code changes
- **Image Management**: Centralized media library with thumbnails
- **SEO Optimized**: Meta titles, descriptions, and keywords per package
- **Flexible Ordering**: Control display order via `order` field
- **Featured Items**: Highlight specific packages on homepage
- **Availability Toggle**: Show/hide packages without deleting
- **Gallery Support**: Multiple images per package with captions

---

## 📞 Contact Information for Booking

All packages include booking contact information that can be customized per package or use global defaults from `site_settings`:

- **Phone**: +880-1713-165116
- **WhatsApp**: +880-1713-165116
- **Email**: Varies by package type (info@, hajj@, work@)

---

This schema is ready for implementation and will make your entire website fully dynamic while preserving your current design and user experience!
