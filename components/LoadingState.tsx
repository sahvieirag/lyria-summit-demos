import React from 'react';
import { LoadingIcon } from './Icons';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <LoadingIcon className="w-12 h-12 animate-spin text-blue-600" />
    <p className="mt-4 text-lg text-gray-700">{message}</p>
  </div>
);

export default LoadingState;
