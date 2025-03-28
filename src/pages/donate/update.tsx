import { Button, Form, Input, InputNumber } from 'antd';

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
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="用户名" />
      </Form.Item>
      <Form.Item name="price" rules={[{ required: true }]}>
        <InputNumber
          stringMode
          step="1.00"
          placeholder="费用"
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name="uid">
        <Input placeholder="用户 ID" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form.Item>
    </>
  );
}
