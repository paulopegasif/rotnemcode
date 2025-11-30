import { ChevronRight, Home } from 'lucide-react';
import { Link, useMatches } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbs: BreadcrumbItem[] = matches
    .filter((match) => match.handle && (match.handle as { crumb?: string }).crumb)
    .map((match) => ({
      label: (match.handle as { crumb: string }).crumb,
      path: match.pathname,
    }));

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path || index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {crumb.path && index < breadcrumbs.length - 1 ? (
              <Link to={crumb.path} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span
                className={cn('font-medium', index === breadcrumbs.length - 1 && 'text-foreground')}
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
