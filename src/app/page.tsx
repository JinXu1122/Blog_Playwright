'use client';

import { Suspense } from 'react';
import HomeContent from './HomeContent';

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
