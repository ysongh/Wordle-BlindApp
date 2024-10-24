export const letterToNumber = (letter: string) => {
  return (letter.charCodeAt(0) - 96).toString();
}