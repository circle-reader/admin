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
      <Form.Item name="reply">
        <Input.TextArea
          rows={5}
          showCount
          maxLength={300}
          autoComplete="off"
          placeholder="内容"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          回复
        </Button>
      </Form.Item>
    </>
  );
}
