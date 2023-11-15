import React from 'react';

interface NoResultProps {
  message: string;
}

const NoResults: React.FC<NoResultProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-full w-full text-neutral-500">
      {message}
    </div>
  );
};

export default NoResults;
