import FormItem from '@/components/condition/form';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Space,
  Switch,
  Select,
  Button,
  DatePicker,
  InputNumber,
} from 'antd';

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
      <Form.Item name="begin" rules={[{ required: true }]}>
        <DatePicker showTime placeholder="开始时间" />
      </Form.Item>
      <Form.Item name="end" rules={[{ required: true }]}>
        <DatePicker showTime placeholder="结束时间" />
      </Form.Item>
      <Form.Item name="discount" rules={[{ required: true }]}>
        <InputNumber
          max={0.99}
          min={0.5}
          step={0.1}
          placeholder="折扣"
          style={{ width: 206 }}
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
