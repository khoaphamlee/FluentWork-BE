function toVietnamTime(date: Date | null): Date | null {
  if (!date) return null;
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  return new Date(date.getTime() + vnOffsetMs);
}
export default toVietnamTime;
