import { Input, Select } from 'antd';

interface IProps {
  data: string;
  value?: string;
  onChange?: (value: any) => void;
}

export default function Form(props: IProps) {
  const { data, value, onChange } = props;
  const inputValue = value ? `${value}`.split(',') : [];
  const handleSelectChange = (val: Array<string>) => {
    onChange && onChange(val.join(','));
  };
  const handleInputChange = (e: any) => {
    onChange && onChange(e.target.value);
  };

  if (data === 'type') {
    return (
      <Select
        size="small"
        mode="multiple"
        value={inputValue}
        style={{ width: 220 }}
        onChange={handleSelectChange}
        options={[
          { label: '扩展', value: 'ext' },
          { label: '油猴', value: 'monkey' },
          { label: '在线', value: 'web' },
        ]}
      />
    );
  }

  if (data === 'role') {
    return (
      <Select
        size="small"
        mode="multiple"
        value={inputValue}
        style={{ width: 220 }}
        onChange={handleSelectChange}
        options={[
          { label: '高级帐户', value: 'member' },
          { label: '专业帐户', value: 'premium' },
        ]}
      />
    );
  }

  return (
    <Input
      size="small"
      value={value}
      style={{ width: 220 }}
      onChange={handleInputChange}
    />
  );
}
