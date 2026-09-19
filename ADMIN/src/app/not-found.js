'use client'
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <button onClick={handleGoBack} className="flex items-center justify-center text-primary underline hover:text-primary/90">
          <ArrowLeft className="mr-2 w-5 h-5" aria-hidden="true" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
