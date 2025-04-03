import Copy from './copy';
import Update from './update';
import { useEffect, useState } from 'react';
import { usePager } from 'circle-react-hook';
import { PlusOutlined } from '@ant-design/icons';
import { each, isNumber, isUndefined } from 'circle-utils';
import {
  Tag,
  Form,
  Modal,
  Input,
  Space,
  Table,
  Button,
  Switch,
  Select,
  Typography,
  Popconfirm,
} from 'antd';

const { Paragraph } = Typography;

export default function Code() {
  const [form] = Form.useForm();
  const [code, onCode] = useState([]);
  const [expire, onExpire] = useState('0');
  const [status, onStatus] = useState('1');
  const [role, onRole] = useState('member');
  const [deleting, onDeleting] = useState('');
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'code/list',
    query: {
      role,
      status,
      expire,
      order: 'active',
    },
  });
  const handleOpen = () => {
    setEditing({});
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleCopyClose = () => {
    onCode([]);
  };
  const handleSwitchChange = (checked: boolean) => {
    onStatus(checked ? '1' : '0');
  };
  const handleFinish = (values: {
    code?: string;
    uid: string;
    name: string;
    price: number;
  }) => {
    onSubmiting(true);
    const data: {
      [index: string]: any;
    } = {};
    each(values, (val, key) => {
      if (!isUndefined(val)) {
        data[key] = val;
      }
    });
    (data.code
      ? app.fetch('code/update', {
          data,
        })
      : app.fetch('code/generate', {
          data,
        })
    )
      .then((code: any) => {
        handleClose();
        refetch();
        if (Array.isArray(code) && code.length > 0) {
          onCode(code as any);
        }
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
      form.setFieldsValue(editing);
    } else {
      form.resetFields();
    }
  }, [editing]);

  return (
    <Space direction="vertical" className="wrapper">
      <Space className="wrapper-header">
        <Button type="primary" onClick={handleOpen} icon={<PlusOutlined />}>
          批量添加
        </Button>
        <Modal
          footer={null}
          open={code.length > 0}
          onCancel={handleCopyClose}
          styles={{
            content: {
              padding: 0,
            },
          }}
        >
          <Copy codes={code} />
        </Modal>
        <Modal
          footer={null}
          title="管理激活码"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form form={form} name="code" onFinish={handleFinish}>
              {dom}
            </Form>
          )}
        >
          <Update loading={submiting} update={editing && editing.code} />
        </Modal>
        <Space>
          <Switch
            checkedChildren="待用"
            unCheckedChildren="使用"
            checked={status === '1'}
            onChange={handleSwitchChange}
          />
          <Select
            value={role}
            onChange={onRole}
            style={{ width: 100 }}
            options={[
              {
                value: 'member',
                label: '高级帐户',
              },
              {
                value: 'premium',
                label: '专业帐户',
              },
            ]}
          />
          <Select
            value={expire}
            onChange={onExpire}
            style={{ width: 80 }}
            options={[
              {
                value: '0',
                label: '终身',
              },
              {
                value: '1',
                label: '1月',
              },
              {
                value: '12',
                label: '12月',
              },
            ]}
          />
          <Input.Search
            allowClear
            enterButton
            onSearch={onSearch}
            style={{ width: 200 }}
            placeholder="用户 ID、角色或激活码"
          />
        </Space>
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
            width: '45%',
            title: '激活码',
            dataIndex: 'code',
            render: (val, record) => {
              let role = '非法';
              if (record.rid === 'member') {
                role = '高级帐户';
              }
              if (record.rid === 'premium') {
                role = '专业帐户';
              }
              return (
                <Space split="-">
                  <span>{role}</span>
                  <Paragraph style={{ margin: 0 }} copyable>
                    {val}
                  </Paragraph>
                </Space>
              );
            },
          },
          {
            width: '20%',
            title: '状态',
            dataIndex: 'active',
            render: (val, record) =>
              parseFloat(record.used) > 0 ? (
                <Tag color={val === '1' ? 'success' : 'error'}>
                  被 {record.uid} 使用
                </Tag>
              ) : (
                <Tag color={val === '1' ? 'success' : 'error'}>未使用</Tag>
              ),
          },
          {
            width: '15%',
            title: '过期时间',
            dataIndex: 'expire',
            render: (val) => {
              const data = isNumber(val) ? val : parseFloat(val);
              return data > 0 ? `${val} 月` : '终身';
            },
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'code',
            render: (code, record) => {
              return (
                <Space size={0}>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setEditing(record);
                    }}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="删除激活码"
                    description="确认删除激活码吗?"
                    onConfirm={() => {
                      onDeleting(code);
                      app
                        .fetch('code/remove', {
                          data: {
                            code,
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
                      type="link"
                      size="small"
                      loading={deleting === code}
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
