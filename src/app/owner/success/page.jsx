'use client';

import { useSearchParams } from 'next/navigation';
import SuccessMessagePage from '@/components/SuccessMessagePage/page';

const Success = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Success';
  const redirectURL = searchParams.get('redirect') || '/';

  return <SuccessMessagePage message={message} redirectURL={redirectURL} />;
};

export default Success;
