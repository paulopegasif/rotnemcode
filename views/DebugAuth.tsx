import React from 'react';

import { useAuth } from '../contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DebugAuth() {
  const { user, session, loading } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug - Auth Status</h1>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold mb-2">Loading State:</h2>
          <pre className="bg-muted p-3 rounded overflow-auto">{loading ? 'true' : 'false'}</pre>
        </div>

        <div>
          <h2 className="font-semibold mb-2">User Object:</h2>
          <pre className="bg-muted p-3 rounded overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Session Object:</h2>
          <pre className="bg-muted p-3 rounded overflow-auto">
            {session ? JSON.stringify(session, null, 2) : 'null'}
          </pre>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Local Storage (Supabase):</h2>
          <pre className="bg-muted p-3 rounded overflow-auto">
            {localStorage.getItem('supabase.auth.token') || 'No token in localStorage'}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
          <Button variant="outline" onClick={() => localStorage.clear()}>
            Clear LocalStorage
          </Button>
        </div>
      </Card>
    </div>
  );
}
