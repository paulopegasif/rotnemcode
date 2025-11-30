import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './components/Layout';
import { NotFoundPage } from './pages/NotFound';
import { ComponentsView } from './views/ComponentsView';
import { Home } from './views/Home';
import { ListView } from './views/ListView';
import { UploadView } from './views/Upload';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'templates',
        element: <ListView type="template" />,
        handle: { crumb: 'Templates' },
      },
      {
        path: 'sections',
        element: <ListView type="section" />,
        handle: { crumb: 'Sections' },
      },
      {
        path: 'components',
        element: <ComponentsView />,
        handle: { crumb: 'Components' },
      },
      {
        path: 'upload',
        element: <UploadView />,
        handle: { crumb: 'Upload' },
      },
      {
        path: 'favorites',
        element: <ListView type="favorites" />,
        handle: { crumb: 'Favorites' },
      },
      {
        path: 'settings',
        element: <div className="p-6">Settings page (em desenvolvimento)</div>,
        handle: { crumb: 'Settings' },
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
