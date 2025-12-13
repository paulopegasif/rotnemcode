import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Fallback text (usually initials) when no image */
  fallback?: string;
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Whether to show a ring around the avatar */
  ring?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const statusColors = {
  online: 'bg-accent',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
  away: 'bg-yellow-500',
};

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
};

/**
 * Avatar - User avatar component with image, fallback, and status indicator
 *
 * Features:
 * - Image with graceful fallback to initials
 * - Multiple sizes
 * - Status indicator (online/offline/busy/away)
 * - Optional ring for emphasis
 * - Gradient background for fallback
 *
 * @example
 * ```tsx
 * <Avatar
 *   src={user.avatarUrl}
 *   fallback={getInitials(user.name)}
 *   status="online"
 *   size="md"
 * />
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt = 'Avatar', fallback, size = 'md', status, ring = false, ...props },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const showFallback = !src || imageError;

    // Generate initials from fallback or alt
    const initials = React.useMemo(() => {
      const text = fallback || alt || '';
      return text
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }, [fallback, alt]);

    return (
      <div ref={ref} className={cn('relative inline-flex', className)} {...props}>
        <div
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-full',
            sizeClasses[size],
            ring && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            showFallback && 'bg-gradient-to-br from-primary to-primary-600'
          )}
        >
          {!showFallback ? (
            <img
              src={src!}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="font-medium text-white select-none">{initials}</span>
          )}
        </div>

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
              statusColors[status],
              statusSizes[size]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * AvatarGroup - Display multiple avatars stacked
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show before +N */
  max?: number;
  /** Size of avatars in the group */
  size?: AvatarProps['size'];
  children: React.ReactNode;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = 'md', children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleAvatars = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div ref={ref} className={cn('flex items-center -space-x-2', className)} {...props}>
        {visibleAvatars.map((child, index) => (
          <div key={index} className="relative" style={{ zIndex: max - index }}>
            {React.isValidElement<AvatarProps>(child)
              ? React.cloneElement(child, { size, ring: true })
              : child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full bg-muted ring-2 ring-background',
              sizeClasses[size]
            )}
            style={{ zIndex: 0 }}
          >
            <span className="text-xs font-medium text-muted-foreground">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
