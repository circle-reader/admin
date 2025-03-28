import Update from './update';
import { useState, useEffect } from 'react';
import { usePager } from 'circle-react-hook';
import { Form, Input, Space, Modal, Table, Button } from 'antd';

export default function Config() {
  const [form] = Form.useForm();
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'storage/list_data',
  });
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (data: { id: string; data: string }) => {
    onSubmiting(true);
    app
      .fetch('storage/update_data', {
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
            <Form form={form} name="config" onFinish={handleFinish}>
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
          placeholder="UID或数据"
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
            width: '40%',
            title: '用户',
            dataIndex: 'uid',
          },
          {
            width: '40%',
            title: '表',
            dataIndex: 'type',
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (_id, record) => {
              return (
                <Button
                  danger
                  size="small"
                  type="primary"
                  onClick={() => setEditing(record)}
                >
                  编辑
                </Button>
              );
            },
          },
        ]}
      />
    </Space>
  );
}
