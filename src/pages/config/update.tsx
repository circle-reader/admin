import { Button, Form, Input } from 'antd';

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
      <Form.Item name="data" rules={[{ required: true }]}>
        <Input.TextArea
          rows={5}
          showCount
          maxLength={300}
          autoComplete="off"
          placeholder="数据"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </>
  );
}
