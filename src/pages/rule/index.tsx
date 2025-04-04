import Update from './update';
import { safeInt } from '../utils';
import { useState, useEffect } from 'react';
import { usePager } from 'circle-react-hook';
import { parse, stringify } from 'circle-utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  Tag,
  Form,
  Input,
  Space,
  Modal,
  Table,
  Button,
  Popconfirm,
  Typography,
} from 'antd';

const { Text } = Typography;

export default function Rule() {
  const [form] = Form.useForm();
  const [deleting, onDeleting] = useState('');
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'rule/list',
  });
  const handleOpen = () => {
    setEditing({ active: '1' });
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (submit: {
    id?: string;
    body: string;
    active: boolean;
    condition?: Array<{
      value: string;
      type: string;
      operator: string;
    }>;
  }) => {
    onSubmiting(true);
    const data = {
      ...submit,
      active: submit.active ? '1' : '0',
      condition:
        Array.isArray(submit.condition) && submit.condition.length > 0
          ? stringify(
              submit.condition.map((item) => ({
                ...item,
                value: safeInt(item.value),
              }))
            )
          : '',
    };
    (data.id
      ? app.fetch('rule/update', {
          data,
        })
      : app.fetch('rule/generate', {
          data,
        })
    )
      .then(() => {
        handleClose();
        refetch();
      })
      .catch((err) => {
        app.error(err && err.message ? err.message : err);
      })
      .finally(() => {
        onSubmiting(false);
      });
  };

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        ...editing,
        active: '1' === editing.active,
        condition: editing.condition
          ? parse(editing.condition).map((item: any) => ({
              ...item,
              value: Array.isArray(item.value)
                ? item.value.join(',')
                : item.value,
            }))
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  return (
    <Space direction="vertical" className="wrapper">
      <Space className="wrapper-header">
        <Button type="primary" onClick={handleOpen} icon={<PlusOutlined />}>
          添加
        </Button>
        <Modal
          width={880}
          footer={null}
          title="管理规则"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form form={form} name="rule" onFinish={handleFinish}>
              {dom}
            </Form>
          )}
        >
          <Update loading={submiting} />
        </Modal>
        <Input.Search
          allowClear
          enterButton
          onSearch={onSearch}
          style={{ width: 200 }}
          placeholder="搜索规则"
        />
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data.items}
        pagination={{
          size: 'small',
          pageSize: limit,
          total: data.total,
          onChange: onPager,
          showSizeChanger: true,
          showQuickJumper: true,
          position: ['bottomCenter'],
        }}
        columns={[
          {
            width: '10%',
            title: '状态',
            dataIndex: 'active',
            render: (val) =>
              '0' === val ? (
                <Tag>草稿</Tag>
              ) : (
                <Tag color="success"> 已发布</Tag>
              ),
          },
          {
            width: '20%',
            title: '条件',
            dataIndex: 'condition',
            render: (val) => {
              if (!val) {
                return '--';
              }
              return (
                <pre className="code-wrapper">
                  {JSON.stringify(parse(val), null, ' ')}
                </pre>
              );
            },
          },
          {
            width: '60%',
            title: '规则',
            dataIndex: 'body',
            render: (val) => {
              return (
                <Space size={4} align="start">
                  <Text copyable={{ text: val }} />
                  <pre className="code-wrapper">
                    {JSON.stringify(parse(val), null, ' ')}
                  </pre>
                </Space>
              );
            },
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id, record) => {
              return (
                <Space>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setEditing(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="删除规则"
                    description="确认删除规则吗?"
                    onConfirm={() => {
                      onDeleting(id);
                      app
                        .fetch('rule/remove', {
                          data: {
                            id,
                          },
                        })
                        .then(refetch)
                        .catch((err) => {
                          app.error(err && err.message ? err.message : err);
                        })
                        .finally(() => {
                          onDeleting('');
                        });
                    }}
                  >
                    <Button
                      danger
                      size="small"
                      type="primary"
                      loading={deleting === id}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </Space>
  );
}
