import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={clsx("glass-card rounded-xl", className)} {...props} />;
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={clsx("flex flex-col space-y-1.5 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("font-semibold leading-none text-slate-800 dark:text-slate-200", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={clsx("p-5 pt-0", className)} {...props} />;
}
