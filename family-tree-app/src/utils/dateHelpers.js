import { Solar, Lunar } from 'lunar-javascript';

/**
 * Converts a YYYY-MM-DD solar date string to a readable Lunar date string.
 * @param {string} solarDateString - YYYY-MM-DD
 * @returns {string} Example: "(13/11 Ất Tỵ)"
 */
export const getLunarDateString = (solarDateString) => {
  if (!solarDateString) return '';
  try {
    const [year, month, day] = solarDateString.split('-');
    if (!year || !month || !day) return '';
    const solar = Solar.fromYmd(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
    const lunar = solar.getLunar();
    return `(Âm lịch: ${lunar.getDayInChinese()} tháng ${lunar.getMonthInChinese()} năm ${lunar.getYearInGanZhi()})`;
  } catch (err) {
    return '';
  }
};

/**
 * Calculates years difference between two dates.
 * @param {string} parentDate - YYYY-MM-DD
 * @param {string} childDate - YYYY-MM-DD
 * @returns {number} difference in years
 */
export const calculateAgeDifference = (parentDate, childDate) => {
  if (!parentDate || !childDate) return null;
  const parent = new Date(parentDate);
  const child = new Date(childDate);
  const diffTime = child - parent;
  if (diffTime < 0) return diffTime / (1000 * 60 * 60 * 24 * 365.25); // negative if child is older
  return Math.abs(diffTime / (1000 * 60 * 60 * 24 * 365.25));
};
