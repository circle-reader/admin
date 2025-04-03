import dayjs from 'dayjs';
import { useState } from 'react';
import { usePager } from 'circle-react-hook';
import { Input, Space, Table, Button, Popconfirm } from 'antd';

export default function Backup() {
  const [deleting, onDeleting] = useState('');
  const { app, data, limit, loading, onPager, onSearch, refetch } = usePager({
    uri: 'storage/list',
  });

  return (
    <Space direction="vertical" className="wrapper">
      <Space className="wrapper-header">
        <div />
        <Input.Search
          allowClear
          enterButton
          onSearch={onSearch}
          style={{ width: 200 }}
          placeholder="搜索"
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
          },
          {
            width: '50%',
            title: '创建时间',
            dataIndex: 'create',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: '操作',
            align: 'right',
            dataIndex: 'id',
            render: (id) => {
              return (
                <Popconfirm
                  title="删除备份"
                  description="确认删除备份吗?"
                  onConfirm={() => {
                    onDeleting(id);
                    app
                      .fetch('storage/remove', {
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
              );
            },
          },
        ]}
      />
    </Space>
  );
}
