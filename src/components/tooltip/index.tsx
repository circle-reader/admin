import { Tooltip, TooltipProps } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import './index.less';

export interface IProps extends Omit<TooltipProps, 'title'> {
  title: any;
  style?: React.CSSProperties;
}

export default function CTooltip(props: IProps) {
  const { style, title, children, ...resetProps } = props;
  const container = useRef<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!container || !container.current) {
      return;
    }
    const target = container.current;
    if (target.scrollHeight > target.clientHeight) {
      setOpen(true);
    }
  }, []);

  return (
    <Tooltip title={open ? title : null} {...resetProps}>
      <span title={title} ref={container} className="tooltip" style={style}>
        {children}
      </span>
    </Tooltip>
  );
}
