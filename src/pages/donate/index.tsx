import dayjs from 'dayjs';
import Update from './update';
import { useEffect, useState } from 'react';
import { usePager } from 'circle-react-hook';
import { each, isUndefined } from 'circle-utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  Input,
  Space,
  Form,
  Table,
  Button,
  Modal,
  Popconfirm,
  Typography,
} from 'antd';

const { Paragraph } = Typography;

export default function Donate() {
  const [form] = Form.useForm();
  const [deleting, onDeleting] = useState('');
  const [confirming, onConfirming] = useState(false);
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'donate/list',
    query: {
      order: 'price',
    },
  });
  const handleOpen = () => {
    setEditing({});
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (values: {
    id: string;
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
    (data.id
      ? app.fetch('donate/update', {
          data,
        })
      : app.fetch('donate/generate', {
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
      form.setFieldsValue(editing);
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
          footer={null}
          title="变更捐赠"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form form={form} name="donate" onFinish={handleFinish}>
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
          placeholder="用户名"
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
            width: '30%',
            title: '用户',
            dataIndex: 'uid',
            render: (val, record) => {
              return (
                <Space split="-">
                  <span>{record.name || '匿名'}</span>
                  <Paragraph style={{ margin: 0 }} copyable>
                    {val || '--'}
                  </Paragraph>
                </Space>
              );
            },
          },
          {
            width: '30%',
            title: '费用',
            dataIndex: 'price',
            render: (val) => `${val}元`,
          },
          {
            width: '30%',
            title: '创建时间',
            dataIndex: 'create',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id, record) => {
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
                    title="删除捐赠"
                    description="确认删除捐赠吗?"
                    onConfirm={() => {
                      onDeleting(id);
                      app
                        .fetch('donate/remove', {
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
                      type="link"
                      size="small"
                      loading={deleting === id}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                  {record.active !== '1' && (
                    <Popconfirm
                      title="确认捐赠"
                      description="确认捐赠有效吗?"
                      onConfirm={() => {
                        onConfirming(true);
                        app
                          .fetch('donate/confirm', {
                            data: {
                              id,
                            },
                          })
                          .then(refetch)
                          .catch((err) => {
                            app.error(err && err.message ? err.message : err);
                          })
                          .finally(() => {
                            onConfirming(false);
                          });
                      }}
                    >
                      <Button
                        danger
                        type="primary"
                        size="small"
                        loading={confirming}
                      >
                        确认
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </Space>
  );
}
