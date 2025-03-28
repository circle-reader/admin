import { Button, Form, Input, Select } from 'antd';
import { getTypes, getStatusItems } from './utils';

interface IProps {
  loading: boolean;
}

export default function Update(props: IProps) {
  const { loading } = props;
  const types = getTypes();
  const status = getStatusItems();

  return (
    <>
      <Form.Item hidden name="id">
        <Input />
      </Form.Item>
      <Form.Item name="uid" rules={[{ required: true }]}>
        <Input placeholder="用户 ID" />
      </Form.Item>
      <Form.Item
        name="uri"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="地址" />
      </Form.Item>
      <Form.Item
        name="version"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="版本" />
      </Form.Item>
      <Form.Item
        name="useragent"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="用户代理" />
      </Form.Item>
      <Form.Item
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="状态"
          options={Object.keys(status).map((key) => ({
            value: key,
            label: status[key].label,
          }))}
        />
      </Form.Item>
      <Form.Item
        name="type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="类型"
          options={Object.keys(types).map((key) => ({
            value: key,
            label: types[key],
          }))}
        />
      </Form.Item>
      <Form.Item name="desc" rules={[{ required: true }]}>
        <Input.TextArea
          rows={5}
          showCount
          maxLength={300}
          autoComplete="off"
          placeholder="描述"
        />
      </Form.Item>
      <Form.Item name="reply">
        <Input.TextArea
          rows={5}
          showCount
          maxLength={300}
          autoComplete="off"
          placeholder="回复"
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
