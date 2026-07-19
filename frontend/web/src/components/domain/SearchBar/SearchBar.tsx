import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { cn } from '../../../utils/cn';
import styles from './SearchBar.module.css';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(styles.container, className)}>
        <IoSearchOutline size={20} className={styles.icon} />
        <input
          ref={ref}
          type="search"
          className={styles.input}
          placeholder="Search for products..."
          {...props}
        />
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
