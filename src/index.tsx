import Error from '@/error';
import Layout from '@/layout';
import Rule from '@/pages/rule';
import User from '@/pages/user';
import Code from '@/pages/code';
import { useEffect } from 'react';
import Order from '@/pages/order';
import Store from '@/pages/store';
import Donate from '@/pages/donate';
import Expire from '@/pages/expire';
import Backup from '@/pages/backup';
import Config from '@/pages/config';
import Service from '@/pages/service';
import Message from '@/pages/message';
import Feedback from '@/pages/feedback';
import { useApp } from 'circle-react-hook';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.less';

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

  return <RouterProvider router={router} />;
}
