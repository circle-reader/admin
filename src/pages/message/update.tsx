import { Button, Form, Input, Switch } from 'antd';

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
      <Form.Item name="title" rules={[{ required: true }]}>
        <Input placeholder="标题" />
      </Form.Item>
      <Form.Item name="active">
        <Switch checkedChildren="发布" unCheckedChildren="草稿" />
      </Form.Item>
      <Form.Item name="body" rules={[{ required: true }]}>
        <Input.TextArea rows={15} autoComplete="off" placeholder="内容" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </>
  );
}
