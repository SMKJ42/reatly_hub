export function mortgageCitation(
  name: string,
  code: string,
  updatedAt: string
) {
  return `Freddie Mac, ${name} [${code}], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/${code}, ${updatedAt}.`;
}
