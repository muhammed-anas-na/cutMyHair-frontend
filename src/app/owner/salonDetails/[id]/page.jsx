'use client';
import SalonDetails from '@/components/owner/SalonDetails/page';
import { use } from 'react';

export default function SalonsPage({ params }) {
    // Unwrap params using React.use()
    const unwrappedParams = use(params);
    
    return <SalonDetails salon_id={unwrappedParams.id} />;
}