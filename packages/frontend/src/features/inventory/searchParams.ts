export const parseString = (value: unknown, fallback = ''): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value;
};

export const parsePositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
};

export const parseNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return fallback;
  }

  const parsed = Number.parseFloat(String(value));
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
};

export const parseEnum = <TValue extends string>(
  value: unknown,
  allowed: readonly TValue[],
  fallback: TValue,
): TValue => {
  if (typeof value !== 'string') {
    return fallback;
  }

  return (allowed as readonly string[]).includes(value) ? value as TValue : fallback;
};

export const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
  }

  return fallback;
};
