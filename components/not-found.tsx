import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img
        src="/assets/illustrations/error.svg"
        alt="Error illustration"
        className="w-48 h-48 mb-6"
      />
      <p className="text-muted-foreground mb-6">The video you&apos;re looking for doesn&apos;t exist or was removed.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          window.history.back();
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound;

