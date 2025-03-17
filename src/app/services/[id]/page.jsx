// No 'use client' directive here
import { FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';
import SalonServices from './SalonService'; // Fixed typo: 'SalonService' → 'SalonServices'

export async function generateMetadata({ params: paramsPromise }) {
  try {
    // Await the params Promise to get the resolved object
    const params = await paramsPromise;
    const salonData = await FETCH_SALON_DETAILS_BY_ID_FN(params.id);
    const {data} = salonData.data;
    const city = data.location_text?.split(",")[1]?.trim() || "your area";
    return {
      title: `${data.name} - Salon Services in ${city}`,
      description: `Book top salon services at ${data.name} in ${city}. Offering ${data.services?.slice(0, 3).map(s => s.name).join(", ")} and more. Schedule your appointment today!`,
      keywords: `${data.name}, salon ${city}, hair salon, beauty services, ${data.services?.map(s => s.name).join(", ")}`,
      openGraph: {
        title: `${data.name} - Best Salon in ${city}`,
        description: `Visit ${data.name} in ${city} for premium beauty services like ${data.services?.slice(0, 3).map(s => s.name).join(", ")}. Book now!`,
        images: [
          {
            url: data.images?.[0] || "/default-salon.jpg",
            width: 1200,
            height: 630,
            alt: `${data.name} Salon`,
          },
        ],
        url: `https://localhost:3000/services/${params.id}`, // Use resolved params.id
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Salon Services | Cut My Hair",
      description: "Book salon services near you. Explore haircuts, styling, and more.",
    };
  }
}

export default async function Page({ params: paramsPromise }) {
  // Await params in the Page component as well
  const params = await paramsPromise;
  return <SalonServices params={params} />;
}