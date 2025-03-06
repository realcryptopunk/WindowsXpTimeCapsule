import React, { ReactNode } from 'react';

interface DesktopProps {
  children: ReactNode;
}

const Desktop: React.FC<DesktopProps> = ({ children }) => {
  return (
    <div className="xp-desktop">
      {children}
    </div>
  );
};

export default Desktop;