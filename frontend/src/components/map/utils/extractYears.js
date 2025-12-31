export const extractYears = (rows) => {
  const years = new Set(
    rows
      .map(r => (r.year ?? r.Year ?? r.YEAR))
      .filter(y => y !== undefined && y !== null && y !== '' && y !== 'NDA')
      .map(String)
  );
  return [...years].sort((a, b) => Number(a) - Number(b));
};
