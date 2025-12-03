import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './pages/NotFound';
import { ComponentsView } from './views/ComponentsView';
import { Home } from './views/Home';
import { ListView } from './views/ListView';
import { LoginView } from './views/LoginView';
import { UploadView } from './views/Upload';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
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
        element: (
          <ProtectedRoute>
            <UploadView />
          </ProtectedRoute>
        ),
        handle: { crumb: 'Upload' },
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <ListView type="favorites" />
          </ProtectedRoute>
        ),
        handle: { crumb: 'Favorites' },
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <div className="p-6">Settings page (em desenvolvimento)</div>
          </ProtectedRoute>
        ),
        handle: { crumb: 'Settings' },
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
