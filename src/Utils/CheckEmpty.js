function CheckEmpty(val) {
  console.log(val)
  if (
    !val ||
    val === undefined ||
    val == null ||
    val === "" ||
    val === "undefined"
  ) {
    return true;
  }
  return false;
}
export default CheckEmpty;
