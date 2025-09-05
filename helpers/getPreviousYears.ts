export const getPreviousYears = (): number[] => {
  const currentYear: number = new Date().getFullYear()
  const years: number[] = []
  for (let year = currentYear; year >= currentYear - 5; year--) {
    years.push(year)
  }
  return years
}
