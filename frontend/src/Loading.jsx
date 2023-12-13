import React from 'react';

const Loading = () => {
  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className="w-16 h-16 border-4 border-black border-t-slate-600 border-r-transparent border-b-green-500 border-l-transparent rounded-full animate-spin">
        
      </div>
    </div>
  );
};

export default Loading;