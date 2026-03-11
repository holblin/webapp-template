import { parseDate, type CalendarDate } from '@internationalized/date';

export const toCalendarDate = (value: string): CalendarDate | null => {
  if (!value) {
    return null;
  }

  try {
    return parseDate(value);
  } catch {
    return null;
  }
};
