interface UserInterface {
  firstName: string;
  nativeLanguage: Language;
  englishLevel: EnglishLevel;
  age?: number;
  profession?: string;
  gender?: GenderType;
}

export default UserInterface;