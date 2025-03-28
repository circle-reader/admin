import Update from './update';
import { useState, useEffect } from 'react';
import Tooltip from '@/components/tooltip';
import { usePager } from 'circle-react-hook';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Tag,
  Form,
  Input,
  Space,
  Modal,
  Table,
  Button,
  Popconfirm,
  Tooltip as CTooltip,
} from 'antd';

export default function Store() {
  const [form] = Form.useForm();
  const [approve, onApprove] = useState(false);
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'store/list',
  });
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (data: { id: string; reply: string }) => {
    onSubmiting(true);
    app
      .fetch('store/update', {
        data,
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
      form.setFieldsValue(editing);
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
          title="管理"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form form={form} name="app" onFinish={handleFinish}>
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
          placeholder="搜索应用"
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
            title: '标题',
            dataIndex: 'title',
          },
          {
            width: '20%',
            title: '版本',
            dataIndex: 'version',
            render: (val, record) => {
              if (record.active === '0') {
                if (record.reply) {
                  return (
                    <CTooltip title={record.reply}>
                      <Space size={3}>
                        <Tag color="error">
                          <span>v{val}</span>
                          <QuestionCircleOutlined />
                        </Tag>
                      </Space>
                    </CTooltip>
                  );
                }
                return (
                  <Tag color="error">
                    <span>v{val}</span>
                  </Tag>
                );
              }
              if (record.reply) {
                return (
                  <CTooltip title={record.reply}>
                    <Space size={3}>
                      <Tag color="success">
                        <span>v{val}</span>
                        <QuestionCircleOutlined />
                      </Tag>
                    </Space>
                  </CTooltip>
                );
              }
              return (
                <Tag color="success">
                  <span>v{val}</span>
                </Tag>
              );
            },
          },
          {
            width: '40%',
            title: '描述',
            dataIndex: 'desc',
            render: (val) => <Tooltip title={val}>{val}</Tooltip>,
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id, record) => {
              if (record.active === '1') {
                return null;
              }
              return (
                <Space>
                  <Popconfirm
                    title="审核应用"
                    description="确认审核应用吗?"
                    onConfirm={() => {
                      onApprove(true);
                      app
                        .fetch('store/update', {
                          data: {
                            id,
                          },
                        })
                        .then(refetch)
                        .catch((err) => {
                          app.error(err && err.message ? err.message : err);
                        })
                        .finally(() => {
                          onApprove(false);
                        });
                    }}
                  >
                    <Button
                      danger
                      size="small"
                      type="primary"
                      loading={approve}
                    >
                      审核
                    </Button>
                  </Popconfirm>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setEditing(record)}
                  >
                    回复
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
