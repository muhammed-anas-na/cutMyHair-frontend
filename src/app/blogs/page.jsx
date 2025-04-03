import { GET_BLOGS_FN } from "@/services/userService";
import { Suspense } from 'react';
import ClientBlogListing from './ClientBlogListing';
import LoadingSpinner from './LoadingSpinner';

// Static metadata for the Blog section
export const metadata = {
  title: 'Beauty & Salon Blog | CutMyHair.in',
  description: 'Discover the latest beauty tips, hair styling trends, salon news, and special promotions from CutMyHair.in.',
  keywords: 'beauty blog, salon blog, hair tips, beauty tips, salon news, hair trends',
  openGraph: {
    title: 'Beauty & Salon Blog | CutMyHair.in',
    description: 'Discover the latest beauty tips, hair styling trends, salon news, and special promotions.',
    url: 'https://cutmyhair.in/blogs',
    type: 'website',
    images: [
      {
        url: 'https://cutmyhair.in/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CutMyHair.in Blog',
      },
    ],
  },
};

// Generate JSON-LD for Blog listing
function generateBlogListJsonLd(blogs) {
  // Prepare BlogPosting items for the schema
  const blogPostings = blogs.slice(0, 10).map(blog => ({
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image,
    "datePublished": new Date(blog.createdAt).toISOString(),
    "dateModified": blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date(blog.createdAt).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "CutMyHair.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CutMyHair.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cutmyhair.in/images/logo.png"
      }
    },
    "url": `https://cutmyhair.in/blogs/${blog.slug}`,
    "description": blog.description.substring(0, 160).replace(/<[^>]*>/g, '')
  }));

  // Return the full schema
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CutMyHair.in Beauty Blog",
    "description": "Discover the latest beauty tips, hair styling trends, salon news, and special promotions.",
    "url": "https://cutmyhair.in/blogs",
    "blogPost": blogPostings
  };
}

// Main component
export default async function BlogsPage() {
  try {
    // Fetch blog data on the server
    const response = await GET_BLOGS_FN();
    const blogsData = response?.data?.blogs || [];
    
    // Format the blog data
    const formattedBlogs = blogsData.map(blog => ({
      id: blog._id,
      title: blog.title,
      excerpt: blog.description.substring(0, 150).replace(/<[^>]*>/g, '') + "...",
      image: blog.image || "/images/default-blog.jpg",
      slug: blog.slug,
      category: blog.category,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt
    }));
    
    // Extract unique categories
    const categories = [...new Set(blogsData.map(blog => blog.category))].sort();
    
    // Generate JSON-LD
    const jsonLd = generateBlogListJsonLd(blogsData);
    
    return (
      <>
        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Breadcrumbs schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://cutmyhair.in"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://cutmyhair.in/blogs"
                }
              ]
            })
          }}
        />
        
        {/* Render the client component with data */}
        <Suspense fallback={<LoadingSpinner />}>
          <ClientBlogListing 
            blogs={formattedBlogs} 
            categories={categories} 
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    
    // Error state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">Failed to load blog posts. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#CE145B] text-white rounded-md hover:bg-[#b01050] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}