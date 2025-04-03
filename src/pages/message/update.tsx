import { Button, Form, Input, Space, Switch, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
      <Form.List name="condition">
        {(fields, { add, remove }) => (
          <>
            <Form.Item>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  add({
                    type: 'role',
                    operator: '=',
                    value: 'member',
                  });
                }}
              >
                添加条件
              </Button>
            </Form.Item>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                align="baseline"
                style={{ display: 'flex', marginBottom: 8 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'type']}
                  rules={[{ required: true }]}
                >
                  <Select
                    size="small"
                    style={{ width: 200 }}
                    options={[
                      {
                        label: '当前角色',
                        value: 'role',
                      },
                      {
                        label: '安装时间',
                        value: 'installed',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'operator']}
                  rules={[{ required: true }]}
                >
                  <Select
                    size="small"
                    style={{ width: 200 }}
                    options={[
                      {
                        label: '大于',
                        value: '>',
                      },
                      {
                        label: '大于等于',
                        value: '>=',
                      },
                      {
                        label: '小于',
                        value: '<',
                      },
                      {
                        label: '小于等于',
                        value: '<=',
                      },
                      {
                        label: '等于',
                        value: '=',
                      },
                      {
                        label: '不等于',
                        value: '<>',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true }]}
                >
                  <Input size="small" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
          </>
        )}
      </Form.List>
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
