export interface KnowledgebaseTopic {
  id: string;
  category_en: string;
  category_native: string;
  title_en: string;
  title_native: string;
  content_en: string;
  content_native: string;
  keywords: string[];
}


export interface KnowledgebaseInterface {
  topics: KnowledgebaseTopic[];
}

export interface TextSegment {
  text: string;
  isBold: boolean;
}
