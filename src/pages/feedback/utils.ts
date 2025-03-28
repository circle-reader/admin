export function getTypes(): {
  [index: string]: string;
} {
  return {
    bug: 'Bug 报告',
    propose: '意见建议',
    design: '界面设计',
    error: '信息错误',
    other: '其他',
  };
}

export function getType(val: string) {
  const types = getTypes();
  return types[val];
}

export function getStatusItems(): {
  [index: string]: {
    label: string;
    color: string;
  };
} {
  return {
    resolve: {
      label: '已确认',
      color: 'cyan',
    },
    rejected: {
      label: '不予处理',
      color: 'warning',
    },
    progress: {
      label: '处理中',
      color: 'processing',
    },
    done: {
      label: '已处理',
      color: 'success',
    },
    release: {
      label: '已上线',
      color: 'purple',
    },
    duplicate: {
      label: '重复',
      color: 'volcano',
    },
    reproduce: {
      label: '无法复现',
      color: 'error',
    },
    pending: {
      label: '待确认',
      color: 'default',
    },
  };
}

export function getStatus(val: string) {
  const statusItems = getStatusItems();
  return statusItems[val] || statusItems.pending;
}
