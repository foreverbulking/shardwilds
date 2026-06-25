import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/cn';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...properties }, reference) => (
  <LabelPrimitive.Root
    ref={reference}
    className={cn('text-sm font-medium leading-none', className)}
    {...properties}
  />
));
Label.displayName = 'Label';
export { Label };