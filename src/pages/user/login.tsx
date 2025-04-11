import { Button, Result } from 'antd';
import { useApp } from 'circle-react-hook';

export default function Login() {
  const { app } = useApp();
  const handleLogin = () => {
    app.fire('account', 'login', () => {
      if (app.user.roles.includes('administrator')) {
        app.fire('account');
      } else {
        app.error('当前用户非管理员，请重新登录');
        this.fire('user_refresh', { uid: '0', roles: [], is_logged_in: false });
      }
    });
  };

  return (
    <div className="wrapper" style={{ justifyContent: 'center' }}>
      <Result
        status="500"
        title="请先登录"
        extra={
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        }
      />
    </div>
  );
}
