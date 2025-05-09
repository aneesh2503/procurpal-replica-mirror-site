
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <p className="text-gray-600 text-center mb-6">
          This is a simple starter template with React, Vite, and Shadcn UI.
        </p>
        <div className="flex justify-center">
          <Link to="/intake">
            <Button>Start Intake Form</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
