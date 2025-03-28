import dayjs from 'dayjs';

export function isAfter(val: number) {
  return dayjs().isAfter(dayjs(val * 1000));
}
