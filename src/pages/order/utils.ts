export function getStatus(val: string) {
  switch (val) {
    case 'cancel':
      return {
        label: '已取消',
        color: 'error',
      };
    case 'done':
      return {
        label: '已完成',
        color: 'success',
      };
    default:
      return {
        label: '待确认',
        color: 'default',
      };
  }
}
