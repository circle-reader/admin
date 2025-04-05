import FormItem from '@/components/condition/form';
import { Button, Form, Input, Space, Switch, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
      <Form.List name="condition">
        {(fields, { add, remove }) => (
          <>
            <Form.Item>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  add({
                    value: 'ext',
                    type: 'type',
                    operator: '=',
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
                        value: 'type',
                        label: '平台渠道',
                      },
                      {
                        value: 'role',
                        label: '所属角色',
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
                <Form.Item noStyle dependencies={[['condition', name, 'type']]}>
                  {(form) => (
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true }]}
                    >
                      <FormItem
                        data={form.getFieldValue(['condition', name, 'type'])}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
          </>
        )}
      </Form.List>
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
