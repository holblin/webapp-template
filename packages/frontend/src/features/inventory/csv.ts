export const toUniqueCsvValues = (raw: string): string[] => {
  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(values)];
};
