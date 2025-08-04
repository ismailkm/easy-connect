import knowledgebase from '@/assets/data/knowledgebase.json';
import { KnowledgebaseTopic, TextSegment } from '@/types/KnowledgebaseInterface';

const findBestTopic = async (query: string): Promise<KnowledgebaseTopic | null> => {
  if (!query.trim()) return null;

  // Define keywords that are less useful for finding a specific topic
  // "what", "is", "how to", "number" are too common
  const commonKeywords = new Set([
    'what', 'is', 'how', 'to', 'the', 'a', 'an', 'and', 'or', 'for', 'with', 'in', 'your',
    'چیست', 'چطور', 'چگونه', 'است', 'از', 'با', 'در', 'برای', 'شماره', 'دریافت'
  ]);
  
  const queryKeywords = query
    .replace(/[?؟.,]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(k => k.length > 1);

  let bestMatch: KnowledgebaseTopic | null = null;
  let highestScore = 0;

  knowledgebase.topics.forEach(topic => {
    let currentScore = 0;
    
    // Create a single array of all searchable keywords for the topic
    const allTopicKeywords = [
      ...topic.keywords.map(k => k.toLowerCase()),
      ...topic.title_en.toLowerCase().split(/\s+/),
      ...topic.title_native.toLowerCase().split(/\s+/)
    ];

    queryKeywords.forEach(qk => {
      // Check if the query keyword is present in the topic's keywords
      if (allTopicKeywords.includes(qk)) {
        // Give a higher score for specific keywords
        if (!commonKeywords.has(qk)) {
          currentScore += 3;
        } else {
          // Give a lower score for common keywords
          currentScore += 1;
        }
      }
    });

    // We also give a bonus for topics that are a perfect match
    if (topic.title_en.toLowerCase().includes(query.toLowerCase()) || 
        topic.title_native.toLowerCase().includes(query.toLowerCase())) {
      currentScore += 5; // A significant boost for a direct title match
    }
    console.log({'topic_found': topic})
    console.log({currentScore})
    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = topic;
    }
  });

  // Optional: Add a threshold to avoid low-quality matches
  // return highestScore > 0 ? bestMatch : null;
  
  return bestMatch;
};


/**
 * Parses a string with Markdown-style bolding (**text**) into an
 * array of structured text segments.
 * 
 * @param rawText - The text from the AI, e.g., "Please use **this form** to register."
 * @returns An array of TextSegment objects, e.g., 
 *   [{ text: 'Please use ', isBold: false }, 
 *    { text: 'this form', isBold: true }, 
 *    { text: ' to register.', isBold: false }]
 */
export const parseBoldMarkdown = (rawText: string): TextSegment[] => {
  if (!rawText) return [];

  // The regex splits the string by the bold markers (**), keeping the content between them.
  const parts = rawText.split(/\*\*(.*?)\*\*/g);

  const segments: TextSegment[] = [];

  parts.forEach((part, index) => {
    if (!part) return; // Skip empty parts

    // Parts at odd indices are the ones that were INSIDE the **...**
    const isBold = index % 2 === 1;
    segments.push({ text: part, isBold });
  });

  return segments;
};

export const KnowledgebaseHelper = {
  findBestTopic,
  parseBoldMarkdown
}