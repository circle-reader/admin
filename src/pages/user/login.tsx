import { Button, Result } from 'antd';
import { useApp } from 'circle-react-hook';

export default function Login() {
  const { app } = useApp();
  const handleLogin = () => {
    app.fire('account', 'login', () => {
      app.fire('account');
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
