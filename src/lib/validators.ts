export const isValidYear = (value: string) => {
  if (!/^\d{4}$/.test(value)) return false;

  const year = Number(value);
  return Number.isInteger(year) && year >= 1900 && year <= 2100;
};

export const parseYear = (value: string) => {
  if (!isValidYear(value)) return null;
  return Number(value);
};

export const isValidDateString = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const parseDateString = (value: string) => {
  if (!isValidDateString(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
