export function safeInt(val: string) {
  if (!val) {
    return '';
  }
  const data = parseInt(val, 10);
  return isNaN(data) ? val : data;
}
