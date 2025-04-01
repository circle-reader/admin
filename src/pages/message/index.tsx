import Update from './update';
import Tooltip from '@/components/tooltip';
import { useState, useEffect } from 'react';
import { usePager } from 'circle-react-hook';
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
} from 'antd';
import './index.less';

export default function Message() {
  const [form] = Form.useForm();
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'message/list',
  });
  const handleOpen = () => {
    setEditing({});
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (data: {
    id?: string;
    title: string;
    body: string;
    active: boolean;
  }) => {
    onSubmiting(true);
    (data.id
      ? app.fetch('message/update', {
          data: { ...data, active: data.active ? '1' : '0' },
        })
      : app.fetch('message/generate', {
          data: { ...data, active: data.active ? '1' : '0' },
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
      form.setFieldsValue({ ...editing, active: '1' === editing.active });
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
          title="管理"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form
              form={form}
              name="message"
              onFinish={handleFinish}
              initialValues={{ active: true }}
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
          placeholder="搜索消息"
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
              '0' === val ? <Tag>草稿</Tag> : <Tag color="success">已发布</Tag>,
          },
          {
            width: '20%',
            title: '标题',
            dataIndex: 'title',
            render: (val) => {
              return <Tooltip title={val}>{val}</Tooltip>;
            },
          },
          {
            width: '60%',
            title: '内容',
            dataIndex: 'body',
            render: (val) => {
              return (
                <Tooltip
                  trigger={['click']}
                  className="inner-tooltip"
                  rootClassName="root-tooltip"
                  title={
                    <div
                      className="modal-tooltip"
                      dangerouslySetInnerHTML={{ __html: val }}
                    />
                  }
                >
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
                    title="删除"
                    description="确认删除吗?"
                    onConfirm={() => {
                      onSubmiting(true);
                      app
                        .fetch('message/remove', {
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
