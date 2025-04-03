import { useEffect } from 'react';
import { useUser } from 'circle-react-hook';
import { Menu, Layout, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

export default function CHeader() {
  const loc = useLocation();
  const navigation = useNavigate();
  const { app, user } = useUser();
  const handleAccount = () => {
    app.fire('account', 'login', () => {
      app.fire('account');
    });
  };
  const handleClick = ({ key }: any) => {
    if (key.startsWith('http')) {
      location.href = key;
    } else if (key.startsWith('/')) {
      navigation(key);
    }
  };

  useEffect(() => {
    if (user && user.is_logged_in) {
      return;
    }
    navigation('login');
  }, [user]);

  return (
    <Header>
      <Menu
        mode="horizontal"
        onClick={handleClick}
        defaultSelectedKeys={[loc.pathname]}
        items={[
          {
            key: '/',
            label: '订单',
          },
          {
            key: '/feedback',
            label: '反馈',
          },
          {
            key: '/store',
            label: '应用',
          },
          {
            key: '/code',
            label: '激活',
          },
          {
            key: '/expire',
            label: '过期',
          },
          {
            key: '/message',
            label: '消息',
          },
          {
            key: '/backup',
            label: '备份',
          },
          {
            key: '/config',
            label: '配置',
          },
          {
            key: '/sale',
            label: '活动',
          },
          {
            key: '/rule',
            label: '规则',
          },
          {
            key: '/user',
            label: '用户',
          },
          {
            key: '/donate',
            label: '捐赠',
          },
          {
            key: '/service',
            label: '服务',
          },
        ]}
      />
      <Text strong className="user-name" onClick={handleAccount}>
        {user.is_logged_in ? user.name : '--'}
      </Text>
    </Header>
  );
}
