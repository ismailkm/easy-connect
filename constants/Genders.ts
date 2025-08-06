interface GenderOption {
  label: string;
  value: GenderType;
}

export const GENDERS: GenderOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'preferNotToSay' },
];