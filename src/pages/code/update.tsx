import { Button, Form, Input, Select, Typography, InputNumber } from 'antd';

interface IProps {
  update: boolean;
  loading: boolean;
}

const { Text } = Typography;

export default function Update(props: IProps) {
  const { update, loading } = props;

  if (update) {
    return (
      <>
        <Form.Item name="uid">
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
        <Form.Item name="code">
          <Input placeholder="激活码" />
        </Form.Item>
        <Form.Item name="expire" extra={<Text>单位：月</Text>}>
          <InputNumber placeholder="过期日期" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="active">
          <Select
            placeholder="状态"
            style={{ width: '100%' }}
            options={[
              {
                label: '有效',
                value: '1',
              },
              {
                label: '无效',
                value: '0',
              },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form.Item>
      </>
    );
  }

  return (
    <>
      <Form.Item name="uid">
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
      <Form.Item
        name="code"
        extra={<Text>留空自动生成，填入内容会自动拼合</Text>}
      >
        <Input placeholder="激活码" />
      </Form.Item>
      <Form.Item name="expire" extra={<Text>单位：月</Text>}>
        <InputNumber placeholder="过期日期" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="number">
        <InputNumber placeholder="数量" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form.Item>
    </>
  );
}
