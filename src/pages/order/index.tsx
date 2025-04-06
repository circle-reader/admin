import dayjs from 'dayjs';
import { useState } from 'react';
import { isNumber } from 'circle-utils';
import { usePager } from 'circle-react-hook';
import {
  Tag,
  Input,
  Space,
  Table,
  Select,
  Button,
  Popconfirm,
  Typography,
} from 'antd';
import { getStatus } from './utils';

const { Paragraph } = Typography;

export default function Order() {
  const [cancel, onCancel] = useState('');
  const [status, onStatus] = useState('done');
  const [confirming, onConfirming] = useState('');
  const { app, data, limit, loading, refetch, onPager, onSearch } = usePager({
    uri: 'order/list',
    query: {
      status,
      order: 'create',
    },
  });

  return (
    <Space direction="vertical" className="wrapper">
      <Space className="wrapper-header">
        <div />
        <Space>
          <Select
            allowClear
            value={status}
            onChange={onStatus}
            style={{ width: 100 }}
            options={[
              { label: '已完成', value: 'done' },
              { label: '已取消', value: 'cancel' },
            ]}
          />
          <Input.Search
            allowClear
            enterButton
            onSearch={onSearch}
            style={{ width: 200 }}
            placeholder="ID、角色或支付方式"
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
            width: '18%',
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
            width: '10%',
            title: '状态',
            dataIndex: 'status',
            render: (val) => {
              const { color, label } = getStatus(val);
              return <Tag color={color}>{label}</Tag>;
            },
          },
          {
            width: '30%',
            title: '支付方式',
            dataIndex: 'method',
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
            width: '15%',
            title: '创建时间',
            dataIndex: 'create',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'status',
            render: (val, record) => {
              if (val === 'pending') {
                return (
                  <Space size={0}>
                    <Popconfirm
                      title="审核订单"
                      description="确认订单有效吗？"
                      onConfirm={() => {
                        onConfirming(record.id);
                        app
                          .fetch('order/update', {
                            data: {
                              id: record.id,
                              status: 'done',
                            },
                          })
                          .then(refetch)
                          .catch((err) => {
                            app.error(err && err.message ? err.message : err);
                          })
                          .finally(() => {
                            onConfirming('');
                          });
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        loading={confirming === record.id}
                      >
                        确认
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="审核订单"
                      description="确认取消订单吗?"
                      onConfirm={() => {
                        onCancel(record.id);
                        app
                          .fetch('order/update', {
                            data: {
                              id: record.id,
                              status: 'cancel',
                            },
                          })
                          .then(refetch)
                          .catch((err) => {
                            app.error(err && err.message ? err.message : err);
                          })
                          .finally(() => {
                            onCancel('');
                          });
                      }}
                    >
                      <Button
                        danger
                        type="link"
                        size="small"
                        loading={cancel === record.id}
                      >
                        取消
                      </Button>
                    </Popconfirm>
                  </Space>
                );
              }
              if (val === 'done') {
                return (
                  <Popconfirm
                    title="取消订单"
                    description="确认取消订单吗?"
                    onConfirm={() => {
                      onCancel(record.id);
                      app
                        .fetch('order/update', {
                          data: {
                            id: record.id,
                            status: 'cancel',
                          },
                        })
                        .then(refetch)
                        .catch((err) => {
                          app.error(err && err.message ? err.message : err);
                        })
                        .finally(() => {
                          onCancel('');
                        });
                    }}
                  >
                    <Button
                      danger
                      type="primary"
                      size="small"
                      loading={cancel === record.id}
                    >
                      取消
                    </Button>
                  </Popconfirm>
                );
              }
              return null;
            },
          },
        ]}
      />
    </Space>
  );
}
