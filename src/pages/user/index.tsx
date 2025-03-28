import dayjs from 'dayjs';
import { usePager } from 'circle-react-hook';
import { Tag, Input, Space, Table, Typography } from 'antd';

const { Paragraph } = Typography;

export default function User() {
  const { data, limit, loading, onPager, onSearch } = usePager({
    uri: 'circle/list',
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
          placeholder="ID、用户或邮箱"
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
            width: '25%',
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
            width: '20%',
            title: '状态',
            dataIndex: 'status',
            render: (val) => {
              return val === '1' ? (
                <Tag color="success">有效</Tag>
              ) : (
                <Tag color="error">禁用</Tag>
              );
            },
          },
          {
            width: '30%',
            title: '邮箱',
            dataIndex: 'mail',
            render: (val) => {
              return val ? <Paragraph copyable>{val}</Paragraph> : '--';
            },
          },

          {
            title: '创建时间',
            dataIndex: 'created',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
        ]}
      />
    </Space>
  );
}
