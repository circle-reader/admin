import { Select, Button, Form, Input, DatePicker } from 'antd';

interface IProps {
  loading: boolean;
}

export default function Update(props: IProps) {
  const { loading } = props;

  return (
    <>
      <Form.Item hidden name="id">
        <Input />
      </Form.Item>
      <Form.Item name="uid" rules={[{ required: true }]}>
        <Input placeholder="用户 ID" />
      </Form.Item>
      <Form.Item name="rid" rules={[{ required: true }]}>
        <Select
          placeholder="角色"
          style={{ width: '100%' }}
          options={[
            {
              label: '专业帐户',
              value: 'premium',
            },
            {
              label: '高级帐户',
              value: 'member',
            },
          ]}
        />
      </Form.Item>
      <Form.Item name="expire" rules={[{ required: true }]}>
        <DatePicker showTime placeholder="过期时间" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form.Item>
    </>
  );
}
