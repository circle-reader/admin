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
            width: '40%',
            title: '用户',
            dataIndex: 'uid',
            render: (val, record) => {
              return (
                <Space split="-">
                  <Paragraph style={{ margin: 0 }} copyable>
                    {record.name}
                  </Paragraph>
                  {record.mail && (
                    <Paragraph
                      style={{ margin: 0 }}
                      copyable={{ text: record.mail }}
                    >
                      &lt;{record.mail}&gt;
                    </Paragraph>
                  )}
                  <Paragraph style={{ margin: 0 }} copyable>
                    {val || '--'}
                  </Paragraph>
                </Space>
              );
            },
          },
          {
            width: '25%',
            title: '角色',
            dataIndex: 'roles',
            render: (val) => {
              if (!Array.isArray(val)) {
                return '--';
              }
              return (
                <Space split="-">
                  {val.map((rid) => {
                    let role = '非法';
                    if (rid === 'member') {
                      role = '高级帐户';
                    } else if (rid === 'premium') {
                      role = '专业帐户';
                    } else if (rid === 'administrator') {
                      role = '管理员';
                    }
                    return (
                      <Paragraph
                        key={rid}
                        style={{ margin: 0 }}
                        copyable={{ text: rid }}
                      >
                        {role}
                      </Paragraph>
                    );
                  })}
                </Space>
              );
            },
          },
          {
            width: '10%',
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
            align: 'right',
            title: '创建时间',
            dataIndex: 'created',
            render: (val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
          },
        ]}
      />
    </Space>
  );
}
