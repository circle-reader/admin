import Error from '@/error';
import { Spin } from 'antd';
import Layout from '@/layout';
import { useApp } from 'circle-react-hook';
import { lazy, Suspense, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.less';

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
    <Suspense fallback={<Spin />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
