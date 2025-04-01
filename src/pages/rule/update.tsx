import { Button, Form, Switch, Input } from 'antd';

interface IProps {
  loading: boolean;
}

export default function Update(props: IProps) {
  const { loading } = props;
  const validator = (_: any, val: string) => {
    try {
      if (val) {
        JSON.parse(val); // 尝试解析 JSON
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('请输入有效的 JSON 格式'));
    }
  };

  return (
    <>
      <Form.Item hidden name="id">
        <Input />
      </Form.Item>
      <Form.Item name="active">
        <Switch checkedChildren="发布" unCheckedChildren="草稿" />
      </Form.Item>
      <Form.Item name="body" rules={[{ required: true }, { validator }]}>
        <Input.TextArea
          rows={15}
          showCount
          maxLength={3000}
          placeholder="规则"
          autoComplete="off"
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
