'use client';

import { useSearchParams } from 'next/navigation';
import SuccessMessagePage from '@/components/SuccessMessagePage/page';
import { Suspense } from 'react';

// Create a component to handle the search params logic
const SuccessContent = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Success';
  const redirectURL = searchParams.get('redirect') || '/';

  return <SuccessMessagePage message={message} redirectURL={redirectURL} />;
};

// Wrap the component in Suspense
const Success = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default Success;