import dayjs from 'dayjs';
import Update from './update';
import Tooltip from '@/components/tooltip';
import { useEffect, useState } from 'react';
import { getType, getStatus } from './utils';
import { usePager } from 'circle-react-hook';
import { each, isUndefined } from 'circle-utils';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Tag,
  Form,
  Modal,
  Input,
  Space,
  Table,
  Button,
  Popconfirm,
  Typography,
  Tooltip as CTooltip,
} from 'antd';

const { Paragraph } = Typography;

export default function Feedback() {
  const [form] = Form.useForm();
  const [deleting, onDeleting] = useState('');
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'feedback/list',
    query: {
      order: 'create',
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
    uri: string;
    desc: string;
    reply?: string;
    type: string;
    status: string;
    version: string;
    useragent: string;
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
      ? app.fetch('feedback/update', {
          data,
        })
      : app.fetch('feedback/generate', {
          data: {
            ...data,
            vote: 0,
            status: 'pending',
          },
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
          title="管理反馈"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form
              form={form}
              name="code"
              onFinish={handleFinish}
              initialValues={{
                type: 'bug',
                status: 'pending',
              }}
            >
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
          placeholder="搜索描述"
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
            title: '描述',
            dataIndex: 'desc',
            render: (val, record) => {
              return (
                <Space split="-" style={{ alignItems: 'self-start' }}>
                  <Paragraph
                    copyable
                    style={{ margin: 0, whiteSpace: 'nowrap' }}
                  >
                    {record.id}
                  </Paragraph>
                  <Tooltip title={val}>{val}</Tooltip>
                </Space>
              );
            },
          },
          {
            width: '12%',
            title: '类型',
            dataIndex: 'type',
            render: (val, record) => {
              return <CTooltip title={record.uri}>{getType(val)}</CTooltip>;
            },
          },
          {
            width: '12%',
            title: '版本',
            dataIndex: 'version',
            render: (val, record) => {
              return <CTooltip title={record.useragent}>{val}</CTooltip>;
            },
          },
          {
            width: '12%',
            title: '状态',
            dataIndex: 'status',
            render: (val, record) => {
              const { color, label } = getStatus(val);
              if (record.reply) {
                return (
                  <CTooltip title={record.reply}>
                    <Tag color={color}>
                      <Space size={3}>
                        <span>{label}</span>
                        <QuestionCircleOutlined />
                      </Space>
                    </Tag>
                  </CTooltip>
                );
              }
              return <Tag color={color}>{label}</Tag>;
            },
          },
          {
            width: '15%',
            title: '创建时间',
            dataIndex: 'create',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            width: '10%',
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id, record) => {
              return (
                <Space size={0}>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setEditing(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="删除反馈"
                    description="确认删除反馈吗?"
                    onConfirm={() => {
                      onDeleting(id);
                      app
                        .fetch('feedback/remove', {
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
                </Space>
              );
            },
          },
        ]}
      />
    </Space>
  );
}
