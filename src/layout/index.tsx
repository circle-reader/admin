import { Layout } from 'antd';
import Login from '@/pages/user/login';
import { Outlet } from 'react-router-dom';
import { useUser } from 'circle-react-hook';
import Header from './header';
import './index.less';

const { Content } = Layout;

export default function CLayout() {
  const { user } = useUser();

  if (!user.is_logged_in) {
    return <Login />;
  }

  return (
    <Layout className="layout-wrapper">
      <Header />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
