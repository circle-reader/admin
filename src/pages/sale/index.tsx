import Update from './update';
import { safeInt } from '../utils';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { usePager } from 'circle-react-hook';
import { isString, parse, stringify } from 'circle-utils';
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

export default function Sale() {
  const [form] = Form.useForm();
  const [deleting, onDeleting] = useState('');
  const [submiting, onSubmiting] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'sale/list',
  });
  const handleOpen = () => {
    setEditing({
      active: '1',
      begin: dayjs().unix(),
      end: dayjs().add(1, 'day').unix(),
    });
  };
  const handleClose = () => {
    setEditing(null);
  };
  const handleFinish = (submit: {
    id?: string;
    end: Dayjs;
    begin: Dayjs;
    discount: number;
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
      end: submit.end.unix(),
      begin: submit.begin.unix(),
      active: submit.active ? '1' : '0',
      condition:
        Array.isArray(submit.condition) && submit.condition.length > 0
          ? stringify(
              submit.condition.map((item) => {
                let conditionData: any = safeInt(item.value);
                if (isString(conditionData)) {
                  const conditionDatas = conditionData.split(',');
                  if (conditionDatas.length > 1) {
                    conditionData = conditionDatas;
                  }
                }
                return {
                  ...item,
                  value: conditionData,
                };
              })
            )
          : '',
    };
    (data.id
      ? app.fetch('sale/update', {
          data,
        })
      : app.fetch('sale/generate', {
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
        end: dayjs.unix(editing.end),
        active: '1' === editing.active,
        begin: dayjs.unix(editing.begin),
        condition: editing.condition
          ? parse(editing.condition).map((item: any) => ({
              ...item,
              value: item.value.join(','),
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
          title="管理"
          open={!!editing}
          onCancel={handleClose}
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          modalRender={(dom) => (
            <Form form={form} name="sale" onFinish={handleFinish}>
              {dom}
            </Form>
          )}
        >
          <Update loading={submiting} />
        </Modal>
        <Input.Search
          allowClear
          enterButton
          placeholder="搜索"
          onSearch={onSearch}
          style={{ width: 200 }}
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
            render: (val, record) => {
              if ('0' === val) {
                return <Tag>草稿</Tag>;
              }
              if (dayjs().isBefore(dayjs.unix(record.end))) {
                return <Tag color="success">已发布</Tag>;
              }
              return <Tag color="warning">已结束</Tag>;
            },
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
            width: '20%',
            title: '开始',
            dataIndex: 'begin',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            width: '20%',
            title: '结束',
            dataIndex: 'end',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            width: '20%',
            title: '折扣',
            dataIndex: 'discount',
            render: (val) => `${val * 10} 折`,
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
                    disabled={dayjs().isBefore(dayjs.unix(record.end))}
                    onConfirm={() => {
                      onDeleting(id);
                      app
                        .fetch('sale/remove', {
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
                      disabled={dayjs().isBefore(dayjs.unix(record.end))}
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
