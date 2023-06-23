export default function getLocalStorageItem(input: string) {
  const check = localStorage.getItem(input);
  if (check) return check;
  return "";
}
