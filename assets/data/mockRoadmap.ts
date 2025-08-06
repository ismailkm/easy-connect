import { RoadmapInterface } from '@/types/RoadmapInterface';

export const MOCK_ROADMAPS: RoadmapInterface[] =  [
    {
    "id": "roadmap_basics_1722125000000",
    "title": "Your First Month of English",
    "duration": "4 Weeks",
    "progress": 0.0,
    "stages": [
        {
        "id": "stage_b0",
        "title": "Week 1: Essential Greetings",
        "duration": "1 Week",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Confidently greet people and introduce yourself and your family.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "Key Phrases",
            "items": [
                { "en": "Hello", "native": "سلام" },
                { "en": "Good morning", "native": "سهار مو پخیر" },
                { "en": "My name is...", "native": "زما نوم دی..." },
                { "en": "This is my husband", "native": "دا زما میړه دی" },
                { "en": "This is my son", "native": "دا زما زوی دی" },
                { "en": "This is my daughter", "native": "دا زما لور ده" },
                { "en": "Nice to meet you", "native": "په لیدو مو خوشحاله شوم" },
                { "en": "How are you?", "native": "څنګه یاست؟" },
                { "en": "I'm fine, thank you", "native": "زه ښه یم، مننه" },
                { "en": "Goodbye", "native": "د خدای په امان" }
            ]
            }
        ],
        "quiz": {
        "title": "Test Your Knowledge",
        "questions": [
          {
            "question": "How do you say 'Hello' in Pashto?",
            "options": ["د خدای په امان", "مننه", "سلام", "زما نوم دی..."],
            "correctAnswer": "سلام"
          },
          {
            "question": "What is the English meaning of 'څنګه یاست؟'?",
            "options": ["My name is...", "Nice to meet you", "Goodbye", "How are you?"],
            "correctAnswer": "How are you?"
          },
          {
            "question": "Which phrase do you use to introduce yourself?",
            "options": ["I'm fine, thank you", "My name is...", "Nice to meet you", "Hello"],
            "correctAnswer": "My name is..."
          },
          {
            "question": "What is the English meaning of 'د خدای په امان'?",
            "options": ["Hello", "Goodbye", "Good morning", "How are you?"],
            "correctAnswer": "Goodbye"
          },
          {
            "question": "You meet someone for the first time. What do you say?",
            "options": ["I'm fine, thank you", "My name is...", "Nice to meet you", "Goodbye"],
            "correctAnswer": "Nice to meet you"
          }
        ]
      }
        },
        {
        "id": "stage_b1",
        "title": "Week 2: At the Doctor's Office",
        "duration": "1 Week",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Learn how to book an appointment and describe a simple health problem.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "Healthcare Words",
            "items": [
                { "en": "Doctor", "native": "ډاکټر" },
                { "en": "GP (General Practitioner)", "native": "جي پي (عمومي ډاکټر)" },
                { "en": "Appointment", "native": "ملاقات" },
                { "en": "I need help", "native": "زه مرستې ته اړتیا لرم" },
                { "en": "My child is sick", "native": "زما ماشوم ناروغه دی" },
                { "en": "Headache", "native": "سرخوږی" },
                { "en": "Fever", "native": "تبه" },
                { "en": "Medicine", "native": "درمل" }
            ]
            }
        ],
        "quiz": {
            "title": "Test Your Knowledge",
            "questions": [
            {
                "question": "What is the English word for a doctor in the UK?",
                "options": ["Help", "GP", "Medicine", "Fever"],
                "correctAnswer": "GP"
            }
            ]
        }
        },
        {
        "id": "stage_b2",
        "title": "Week 3: Parent-Teacher Meeting",
        "duration": "1 Week",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Understand basic communication with your child's school and teacher.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "School Phrases",
            "items": [
                { "en": "Teacher", "native": "ښوونکی/ښوونکې" },
                { "en": "School", "native": "ښوونځی" },
                { "en": "My son's name is...", "native": "زما د زوی نوم دی..." },
                { "en": "He is doing well", "native": "هغه ښه دی" },
                { "en": "She needs help with...", "native": "هغه... سره مرستې ته اړتیا لري" },
                { "en": "Homework", "native": "کورنۍ دنده" }
            ]
            }
        ],
        "quiz": {
            "title": "Test Your Knowledge",
            "questions": [
            {
                "question": "What is the English word for the work children do at home?",
                "options": ["School", "Teacher", "Homework", "Help"],
                "correctAnswer": "Homework"
            }
            ]
        }
        }
    ]
    },
    {
    "id": "roadmap_shopping_1722125100000",
    "title": "Shopping at the Supermarket",
    "duration": "3 Lessons",
    "progress": 0.0,
    "stages": [
        {
        "id": "stage_s0",
        "title": "Lesson 1: Finding What You Need",
        "duration": "1 Lesson",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Learn how to ask a shop assistant for help finding items.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "Key Phrases",
            "items": [
                { "en": "Excuse me, can you help me?", "native": "بښنه غواړم، مرسته کولی شئ؟" },
                { "en": "Where can I find the...?", "native": "...چیرته پیدا کولی شم؟" },
                { "en": "I'm looking for...", "native": "زه... لټوم" },
                { "en": "Aisle", "native": "لاره / قطار" },
                { "en": "Bread", "native": "ډوډۍ" },
                { "en": "Milk", "native": "شیدې" },
                { "en": "Eggs", "native": "هګۍ" }
            ]
            }
        ],
        "quiz": {
            "title": "Test Your Knowledge",
            "questions": [
            {
                "question": "How do you ask for the location of an item?",
                "options": ["I'm looking for...?", "Where can I find the...?", "Excuse me", "Do you have...?"],
                "correctAnswer": "Where can I find the...?"
            }
            ]
        }
        },
        {
        "id": "stage_s1",
        "title": "Lesson 2: Asking About Prices",
        "duration": "1 Lesson",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Learn how to ask about the price of items and understand the currency.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "Money Words",
            "items": [
                { "en": "How much is this?", "native": "دا په څو دی؟" },
                { "en": "Pounds", "native": "پونډ" },
                { "en": "Pence", "native": "پنس" },
                { "en": "That's expensive", "native": "دا قیمته دی" },
                { "en": "Do you have anything cheaper?", "native": "آیا تاسو کوم ارزانه شی لرئ؟" }
            ]
            }
        ],
        "quiz": {
            "title": "Test Your Knowledge",
            "questions": [
            {
                "question": "What is the main currency in the UK?",
                "options": ["Dollars", "Pence", "Pounds", "Euros"],
                "correctAnswer": "Pounds"
            }
            ]
        }
        },
        {
        "id": "stage_s2",
        "title": "Lesson 3: At the Checkout",
        "duration": "1 Lesson",
        "progress": 0.0,
        "status": "not_started",
        "goal": "Learn the phrases you need to pay for your items.",
        "learningMaterials": [
            {
            "type": "vocabulary",
            "title": "Checkout Phrases",
            "items": [
                { "en": "I'll pay by card", "native": "زه به په کارت پیسې ورکړم" },
                { "en": "I'll pay with cash", "native": "زه به نغدې پیسې ورکړم" },
                { "en": "Do you need a bag?", "native": "بکسې ته اړتیا لرئ؟" },
                { "en": "Yes, please", "native": "هو، مهرباني وکړئ" },
                { "en": "No, thank you", "native": "نه، مننه" },
                { "en": "Can I have a receipt, please?", "native": "آیا رسید راکولی شئ، مهرباني وکړئ؟" }
            ]
            }
        ],
        "quiz": {
            "title": "Test Your Knowledge",
            "questions": [
            {
                "question": "What do you ask for after you pay?",
                "options": ["A bag", "Contactless", "A receipt", "Cash"],
                "correctAnswer": "A receipt"
            }
            ]
        }
        }
    ]
    }
]