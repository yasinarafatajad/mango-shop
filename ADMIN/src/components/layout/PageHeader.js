"use client"
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, showBack = false, actions }) => {
   const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };
  
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 md:px-6 md:h-16">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleGoBack}
              className="w-8 h-8 -ml-2 flex items-center justify-center rounded-full hover:bg-secondary transition-colors touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
