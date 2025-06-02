import React from 'react';
import SuccessMessagePage from '@/components/SuccessMessagePage/page';

const SuccessComponent = () => {
  return (
    <SuccessMessagePage message={'Registration Completed'} redirectURL={'/owner/dashboard?from=register'}/>
  );
};

export default SuccessComponent;