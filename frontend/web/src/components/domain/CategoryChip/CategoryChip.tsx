import React from 'react';
import { Pill } from '../../ui/Pill/Pill';
import type { PillProps } from '../../ui/Pill/Pill';

export const CategoryChip = React.forwardRef<HTMLButtonElement, PillProps>(
  (props, ref) => {
    return <Pill ref={ref} {...props} />;
  }
);
CategoryChip.displayName = 'CategoryChip';
