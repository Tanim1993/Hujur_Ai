export interface NooraniLesson {
  id: string;
  title: string;
  titleBengali: string;
  description: string;
  descriptionBengali: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  letters: Array<{
    arabic: string;
    name: string;
    nameBengali: string;
    transliteration: string;
    pronunciation: string;
    position: 'isolated' | 'initial' | 'medial' | 'final';
    examples?: Array<{
      word: string;
      meaning: string;
      meaningBengali: string;
    }>;
  }>;
  exercises: Array<{
    type: 'recognition' | 'pronunciation' | 'combination' | 'reading';
    instruction: string;
    instructionBengali: string;
    content: string;
    options?: string[];
    correctAnswer: string;
  }>;
}

export const NOORANI_QAIDA_LESSONS: NooraniLesson[] = [
  {
    id: "lesson-1-alif-ba-ta",
    title: "Arabic Alphabet - Part 1 (Alif, Ba, Ta)",
    titleBengali: "আরবি বর্ণমালা - ১ম অংশ (আলিফ, বা, তা)",
    description: "Learn the first three letters of the Arabic alphabet with proper pronunciation",
    descriptionBengali: "সঠিক উচ্চারণসহ আরবি বর্ণমালার প্রথম তিনটি অক্ষর শিখুন",
    level: 'beginner',
    letters: [
      {
        arabic: "ا",
        name: "Alif",
        nameBengali: "আলিফ",
        transliteration: "alif",
        pronunciation: "aa (long vowel)",
        position: 'isolated',
        examples: [
          { word: "أب", meaning: "Father", meaningBengali: "বাবা" },
          { word: "أم", meaning: "Mother", meaningBengali: "মা" }
        ]
      },
      {
        arabic: "ب",
        name: "Ba",
        nameBengali: "বা",
        transliteration: "ba",
        pronunciation: "b as in 'book'",
        position: 'isolated',
        examples: [
          { word: "بيت", meaning: "House", meaningBengali: "ঘর" },
          { word: "بحر", meaning: "Sea", meaningBengali: "সমুদ্র" }
        ]
      },
      {
        arabic: "ت",
        name: "Ta",
        nameBengali: "তা",
        transliteration: "ta",
        pronunciation: "t as in 'tea'",
        position: 'isolated',
        examples: [
          { word: "تفاح", meaning: "Apple", meaningBengali: "আপেল" },
          { word: "تمر", meaning: "Date", meaningBengali: "খেজুর" }
        ]
      }
    ],
    exercises: [
      {
        type: 'recognition',
        instruction: "Identify this Arabic letter",
        instructionBengali: "এই আরবি অক্ষরটি চিহ্নিত করুন",
        content: "ا",
        options: ["Alif", "Ba", "Ta", "Tha"],
        correctAnswer: "Alif"
      },
      {
        type: 'pronunciation',
        instruction: "Pronounce this letter correctly",
        instructionBengali: "এই অক্ষরটি সঠিকভাবে উচ্চারণ করুন",
        content: "ب",
        correctAnswer: "ba"
      },
      {
        type: 'combination',
        instruction: "Read this combination: بت",
        instructionBengali: "এই সমন্বয়টি পড়ুন: بت",
        content: "بت",
        correctAnswer: "bat"
      }
    ]
  },
  {
    id: "lesson-2-tha-jeem-haa",
    title: "Arabic Alphabet - Part 2 (Tha, Jeem, Haa)",
    titleBengali: "আরবি বর্ণমালা - ২য় অংশ (সা, জিম, হা)",
    description: "Continue learning Arabic letters with Tha, Jeem, and Haa",
    descriptionBengali: "সা, জিম এবং হা দিয়ে আরবি অক্ষর শেখা অব্যাহত রাখুন",
    level: 'beginner',
    letters: [
      {
        arabic: "ث",
        name: "Tha",
        nameBengali: "সা",
        transliteration: "tha",
        pronunciation: "th as in 'think'",
        position: 'isolated',
        examples: [
          { word: "ثلج", meaning: "Snow", meaningBengali: "বরফ" },
          { word: "ثعلب", meaning: "Fox", meaningBengali: "শিয়াল" }
        ]
      },
      {
        arabic: "ج",
        name: "Jeem",
        nameBengali: "জিম",
        transliteration: "jeem",
        pronunciation: "j as in 'jam'",
        position: 'isolated',
        examples: [
          { word: "جبل", meaning: "Mountain", meaningBengali: "পাহাড়" },
          { word: "جمل", meaning: "Camel", meaningBengali: "উট" }
        ]
      },
      {
        arabic: "ح",
        name: "Haa",
        nameBengali: "হা",
        transliteration: "haa",
        pronunciation: "h (heavy breathing)",
        position: 'isolated',
        examples: [
          { word: "حب", meaning: "Love", meaningBengali: "ভালোবাসা" },
          { word: "حليب", meaning: "Milk", meaningBengali: "দুধ" }
        ]
      }
    ],
    exercises: [
      {
        type: 'recognition',
        instruction: "Which letter makes the 'th' sound?",
        instructionBengali: "কোন অক্ষরটি 'th' শব্দ করে?",
        content: "ث",
        options: ["ت", "ث", "ج", "ح"],
        correctAnswer: "ث"
      },
      {
        type: 'pronunciation',
        instruction: "Pronounce this letter correctly",
        instructionBengali: "এই অক্ষরটি সঠিকভাবে উচ্চারণ করুন",
        content: "ج",
        correctAnswer: "jeem"
      },
      {
        type: 'reading',
        instruction: "Read this word: حج",
        instructionBengali: "এই শব্দটি পড়ুন: حج",
        content: "حج",
        correctAnswer: "hajj"
      }
    ]
  },
  {
    id: "lesson-3-short-vowels",
    title: "Short Vowels (Harakat)",
    titleBengali: "হ্রস্ব স্বরধ্বনি (হারাকাত)",
    description: "Learn Fatha, Kasra, and Damma - the three short vowels in Arabic",
    descriptionBengali: "ফাতহা, কাসরা এবং দাম্মা - আরবিতে তিনটি হ্রস্ব স্বরধ্বনি শিখুন",
    level: 'beginner',
    letters: [
      {
        arabic: "َ",
        name: "Fatha",
        nameBengali: "ফাতহা",
        transliteration: "a",
        pronunciation: "short 'a' as in 'cat'",
        position: 'isolated',
        examples: [
          { word: "بَ", meaning: "Ba with Fatha", meaningBengali: "ফাতহাসহ বা" }
        ]
      },
      {
        arabic: "ِ",
        name: "Kasra",
        nameBengali: "কাসরা",
        transliteration: "i",
        pronunciation: "short 'i' as in 'bit'",
        position: 'isolated',
        examples: [
          { word: "بِ", meaning: "Bi with Kasra", meaningBengali: "কাসরাসহ বি" }
        ]
      },
      {
        arabic: "ُ",
        name: "Damma",
        nameBengali: "দাম্মা",
        transliteration: "u",
        pronunciation: "short 'u' as in 'put'",
        position: 'isolated',
        examples: [
          { word: "بُ", meaning: "Bu with Damma", meaningBengali: "দাম্মাসহ বু" }
        ]
      }
    ],
    exercises: [
      {
        type: 'pronunciation',
        instruction: "Pronounce: بَ",
        instructionBengali: "উচ্চারণ করুন: بَ",
        content: "بَ",
        correctAnswer: "ba"
      },
      {
        type: 'pronunciation',
        instruction: "Pronounce: تِ",
        instructionBengali: "উচ্চারণ করুন: تِ",
        content: "تِ",
        correctAnswer: "ti"
      },
      {
        type: 'pronunciation',
        instruction: "Pronounce: جُ",
        instructionBengali: "উচ্চারণ করুন: جُ",
        content: "جُ",
        correctAnswer: "ju"
      }
    ]
  },
  {
    id: "lesson-4-sukoon-tanween",
    title: "Sukoon and Tanween",
    titleBengali: "সুকূন এবং তানবীন",
    description: "Learn about Sukoon (no vowel) and Tanween (double short vowels)",
    descriptionBengali: "সুকূন (কোন স্বরধ্বনি নেই) এবং তানবীন (দ্বিগুণ হ্রস্ব স্বরধ্বনি) সম্পর্কে জানুন",
    level: 'intermediate',
    letters: [
      {
        arabic: "ْ",
        name: "Sukoon",
        nameBengali: "সুকূন",
        transliteration: "sukoon",
        pronunciation: "no vowel sound",
        position: 'isolated',
        examples: [
          { word: "بْ", meaning: "B with Sukoon", meaningBengali: "সুকূনসহ ব" }
        ]
      },
      {
        arabic: "ً",
        name: "Tanween Fath",
        nameBengali: "তানবীন ফাতহ",
        transliteration: "an",
        pronunciation: "an sound",
        position: 'isolated',
        examples: [
          { word: "كتاباً", meaning: "A book (object)", meaningBengali: "একটি বই (কর্ম)" }
        ]
      },
      {
        arabic: "ٍ",
        name: "Tanween Kasr",
        nameBengali: "তানবীন কাসর",
        transliteration: "in",
        pronunciation: "in sound",
        position: 'isolated',
        examples: [
          { word: "كتابٍ", meaning: "Of a book", meaningBengali: "একটি বইয়ের" }
        ]
      }
    ],
    exercises: [
      {
        type: 'recognition',
        instruction: "Identify the Sukoon mark",
        instructionBengali: "সুকূন চিহ্ন চিহ্নিত করুন",
        content: "بْتَ",
        options: ["َ", "ْ", "ِ", "ُ"],
        correctAnswer: "ْ"
      },
      {
        type: 'pronunciation',
        instruction: "Read: كتاباً",
        instructionBengali: "পড়ুন: كتاباً",
        content: "كتاباً",
        correctAnswer: "kitaban"
      }
    ]
  },
  {
    id: "lesson-5-letter-connections",
    title: "Connecting Letters",
    titleBengali: "অক্ষর সংযোগ",
    description: "Learn how Arabic letters connect to form words",
    descriptionBengali: "আরবি অক্ষরগুলি কীভাবে সংযুক্ত হয়ে শব্দ গঠন করে তা শিখুন",
    level: 'intermediate',
    letters: [
      {
        arabic: "بت",
        name: "Ba + Ta",
        nameBengali: "বা + তা",
        transliteration: "bat",
        pronunciation: "bat",
        position: 'medial',
        examples: [
          { word: "بيت", meaning: "House", meaningBengali: "ঘর" }
        ]
      },
      {
        arabic: "جب",
        name: "Jeem + Ba",
        nameBengali: "জিম + বা",
        transliteration: "jab",
        pronunciation: "jab",
        position: 'medial'
      }
    ],
    exercises: [
      {
        type: 'combination',
        instruction: "Connect ب + ت to make:",
        instructionBengali: "ب + ت সংযোগ করে তৈরি করুন:",
        content: "بت",
        correctAnswer: "بت"
      },
      {
        type: 'reading',
        instruction: "Read this connected word: بيت",
        instructionBengali: "এই সংযুক্ত শব্দটি পড়ুন: بيت",
        content: "بيت",
        correctAnswer: "bayt"
      }
    ]
  }
];

export const getNooraniLessonById = (id: string): NooraniLesson | undefined => {
  return NOORANI_QAIDA_LESSONS.find(lesson => lesson.id === id);
};

export const getNooraniLessonsByLevel = (level: 'beginner' | 'intermediate' | 'advanced'): NooraniLesson[] => {
  return NOORANI_QAIDA_LESSONS.filter(lesson => lesson.level === level);
};