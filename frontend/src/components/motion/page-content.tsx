"use client";

import { PageTransition } from "./page-transition";

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <PageTransition className={className}>
      {children}
    </PageTransition>
  );
}
