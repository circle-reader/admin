import { Result } from 'antd';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <Result
      status="500"
      title="oops"
      subTitle={error.statusText || error.message}
    />
  );
}
