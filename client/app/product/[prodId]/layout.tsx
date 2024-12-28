import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      {/* You can add common layout elements here, like a header or footer */}

      <main>{children}</main>

    </div>
  );
}
