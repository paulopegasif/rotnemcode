import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './pages/NotFound';
import { ComponentsView } from './views/ComponentsView';
import { DebugAuth } from './views/DebugAuth';
import { FavoritesView } from './views/FavoritesView';
import { Home } from './views/Home';
import { LoginView } from './views/LoginView';
import { MyAssetsView } from './views/MyAssetsView';
import { SectionsView } from './views/SectionsView';
import { TemplatesView } from './views/TemplatesView';
import { UploadView } from './views/Upload';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: <Home />,
        handle: { crumb: 'Dashboard' },
      },
      {
        path: 'templates',
        element: <TemplatesView />,
        handle: { crumb: 'Templates' },
      },
      {
        path: 'sections',
        element: <SectionsView />,
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
        path: 'my-assets',
        element: (
          <ProtectedRoute>
            <MyAssetsView />
          </ProtectedRoute>
        ),
        handle: { crumb: 'My Assets' },
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <FavoritesView />
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
      {
        path: 'debug-auth',
        element: <DebugAuth />,
        handle: { crumb: 'Debug Auth' },
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
