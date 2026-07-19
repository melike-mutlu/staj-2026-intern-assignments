import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'success';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  variant = 'default',
  ...props
}) => {
  return (
    <div className={cn(styles.container, className)} {...props}>
      {icon && (
        <div className={cn(styles.iconWrapper, variant === 'success' && styles.success)}>
          {icon}
        </div>
      )}
      <h3 className={cn('text-heading-20', styles.title)}>{title}</h3>
      {description && <p className={cn('text-body-16', styles.description)}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
