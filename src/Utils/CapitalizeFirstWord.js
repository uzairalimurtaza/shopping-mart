function CapitalizeFirstWord(string) {
  if (!string || string == null || string === undefined) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default CapitalizeFirstWord;
