import Update from './update';
import { isAfter } from './utils';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { usePager } from 'circle-react-hook';
import { each, isUndefined } from 'circle-utils';
import {
  Tag,
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

export default function Expire() {
  const [form] = Form.useForm();
  const [deleting, onDeleting] = useState('');
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'expire/list',
  });
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (values: {
    id: string;
    uid: string;
    rid: string;
    expire: Dayjs;
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
    app
      .fetch('expire/update', {
        data: {
          ...data,
          expire: data.expire.unix(),
        },
      })
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
        id: editing.id,
        rid: editing.rid,
        uid: editing.uid,
        expire: dayjs(parseInt(editing.expire, 10) * 1000),
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  return (
    <Space direction="vertical" className="wrapper">
      <Space className="wrapper-header">
        <div />
        <Modal
          footer={null}
          open={!!editing}
          title="管理角色过期"
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
          placeholder="用户名或角色"
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
            width: '35%',
            title: '用户',
            dataIndex: 'uid',
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
            width: '25%',
            title: '状态',
            dataIndex: 'reminded',
            render: (val) =>
              val === '1' ? (
                <Tag color="success">已提醒</Tag>
              ) : (
                <Tag color="error">未提醒</Tag>
              ),
          },
          {
            width: '25%',
            title: '过期时间',
            dataIndex: 'expire',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id, record) => {
              return (
                <Space size={0}>
                  {isAfter(record.expire) && (
                    <Popconfirm
                      title="删除角色过期"
                      description="确认删除角色过期吗?"
                      onConfirm={() => {
                        onDeleting(id);
                        app
                          .fetch('expire/remove', {
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
                        type="primary"
                        size="small"
                        loading={deleting === id}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  )}
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setEditing(record)}
                  >
                    编辑
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </Space>
  );
}
