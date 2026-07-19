import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './Skeleton.module.css';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn(styles.skeleton, className)} {...props} />;
};
