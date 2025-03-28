import Update from './update';
import Tooltip from '@/components/tooltip';
import { useState, useEffect } from 'react';
import { usePager } from 'circle-react-hook';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Space, Modal, Table, Button, Popconfirm } from 'antd';

export default function Rule() {
  const [form] = Form.useForm();
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'rule/list',
  });
  const handleOpen = () => {
    setEditing({});
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (data: { id?: string; body: string }) => {
    onSubmiting(true);
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
          width={600}
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
            title: 'ID',
            dataIndex: 'id',
          },
          {
            width: '80%',
            title: '规则',
            dataIndex: 'body',
            render: (val) => {
              return (
                <Tooltip title={val} style={{ maxWidth: 800 }}>
                  {val}
                </Tooltip>
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
                      onSubmiting(true);
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
                          onSubmiting(false);
                        });
                    }}
                  >
                    <Button
                      danger
                      size="small"
                      type="primary"
                      loading={submiting}
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
