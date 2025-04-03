import dayjs from 'dayjs';
import Error from '@/error';
import Layout from '@/layout';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { useApp } from 'circle-react-hook';
import { Spin, ConfigProvider } from 'antd';
import { lazy, Suspense, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.less';

dayjs.locale('zh-cn');

const Sale = lazy(() => import('@/pages/sale'));
const Rule = lazy(() => import('@/pages/rule'));
const User = lazy(() => import('@/pages/user'));
const Code = lazy(() => import('@/pages/code'));
const Order = lazy(() => import('@/pages/order'));
const Store = lazy(() => import('@/pages/store'));
const Donate = lazy(() => import('@/pages/donate'));
const Expire = lazy(() => import('@/pages/expire'));
const Backup = lazy(() => import('@/pages/backup'));
const Config = lazy(() => import('@/pages/config'));
const Service = lazy(() => import('@/pages/service'));
const Message = lazy(() => import('@/pages/message'));
const Feedback = lazy(() => import('@/pages/feedback'));

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Order />,
      },
      {
        path: '/rule',
        element: <Rule />,
      },
      {
        path: '/service',
        element: <Service />,
      },
      {
        path: '/message',
        element: <Message />,
      },
      {
        path: '/sale',
        element: <Sale />,
      },
      {
        path: '/config',
        element: <Config />,
      },
      {
        path: '/backup',
        element: <Backup />,
      },
      {
        path: '/code',
        element: <Code />,
      },
      {
        path: '/user',
        element: <User />,
      },
      {
        path: '/store',
        element: <Store />,
      },
      {
        path: '/donate',
        element: <Donate />,
      },
      {
        path: '/expire',
        element: <Expire />,
      },
      {
        path: '/feedback',
        element: <Feedback />,
      },
    ],
  },
]);

export default function App() {
  const { app } = useApp();

  useEffect(() => {
    app.fire('display');
    document.title = `${app.i18n('title')} - ${document.title}`;
  }, []);

  return (
    <ConfigProvider locale={locale}>
      <Suspense fallback={<Spin />}>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  );
}
