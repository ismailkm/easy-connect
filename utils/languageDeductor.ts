export const isEnglish = (text: string, threshold = 0.7) => {
  if (!text || text.trim().length === 0) {
    return false;
  }

  const latinCharactersCount = text
    .split('')
    .filter(char => {
      const charCode = char.charCodeAt(0);
      // Check for Latin alphabet characters (a-z, A-Z)
      return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    })
    .length;

  // Compare the count of Latin characters to the total length of the text
  const ratio = latinCharactersCount / text.length;

  // Return true if the ratio is above the threshold (default 70%)
  return ratio >= threshold;
};