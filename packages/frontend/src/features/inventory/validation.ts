type RequiredField = {
  value: string;
  message: string;
};

export const getRequiredFieldError = (fields: readonly RequiredField[]): string | null => {
  const missingField = fields.find((field) => !field.value.trim());
  return missingField?.message ?? null;
};
