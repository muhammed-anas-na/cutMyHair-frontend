import { GET_BLOG_BY_SLUG_FN } from '@/services/userService';
import ClientBlogPost from './ClientBlogPost';
import { Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner';

// Generate metadata function for SEO (runs on server)
export async function generateMetadata({ params }) {
  const { slug } = await params; // Await params to resolve the Promise
  try {
    const response = await GET_BLOG_BY_SLUG_FN(slug);
    const blog = response.data.blog;

    // Clean description for meta tags (strip HTML)
    const description = blog.description
      .substring(0, 160)
      .replace(/<[^>]*>/g, '');

    return {
      title: `${blog.title} | CutMyHair.in Blog`,
      description: description,
      openGraph: {
        title: blog.title,
        description: description,
        url: `https://cutmyhair.in/blogs/${slug}`,
        type: 'article',
        images: [
          {
            url: blog.image,
            width: 1200,
            height: 630,
            alt: blog.imageAlt || blog.title,
          },
        ],
        article: {
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt || blog.createdAt,
          section: blog.category.replace(/-/g, ' '),
          tags: [blog.category.replace(/-/g, ' '), 'beauty', 'salon'],
        },
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: description,
        images: [blog.image],
      },
      alternates: {
        canonical: `https://cutmyhair.in/blogs/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata if blog fetch fails
    return {
      title: 'Blog Post | CutMyHair.in',
      description: 'Read our latest beauty and salon articles on CutMyHair.in',
    };
  }
}

// Generate JSON-LD schema for structured data
async function generateJsonLd({ params }) {
  const { slug } = await params; // Await params to resolve the Promise
  try {
    const response = await GET_BLOG_BY_SLUG_FN(slug);
    const blog = response.data.blog;

    const cleanDescription = blog.description.substring(0, 160).replace(/<[^>]*>/g, '');
    const isoDate = new Date(blog.createdAt).toISOString();

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'image': [blog.image],
      'datePublished': isoDate,
      'dateModified': blog.updatedAt ? new Date(blog.updatedAt).toISOString() : isoDate,
      'author': {
        '@type': 'Organization',
        'name': 'CutMyHair.in',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'CutMyHair.in',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://cutmyhair.in/images/logo.png',
        },
      },
      'description': cleanDescription,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://cutmyhair.in/blogs/${slug}`,
      },
      'keywords': `${blog.category.replace(/-/g, ' ')}, beauty salon, hair styling, cutmyhair`,
    };
  } catch (error) {
    console.error('Error generating JSON-LD:', error);
    return null;
  }
}

// Main page component (server component)
export default async function BlogPostPage({ params }) {
  const { slug } = await params; // Await params to resolve the Promise
  try {
    // Fetch blog data on the server
    const response = await GET_BLOG_BY_SLUG_FN(slug);
    const blogData = response.data.blog;

    // Generate the JSON-LD
    const jsonLd = await generateJsonLd({ params });

    // Pass the data to the client component
    return (
      <>
        {/* Add JSON-LD structured data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        {/* Wrap the client component with Suspense for loading states */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <LoadingSpinner />
            </div>
          }
        >
          <ClientBlogPost blogData={blogData} slug={slug} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading blog:', error);
    // Render error state
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load the blog post. Please try again later.
          </p>
          <a
            href="/blogs"
            className="bg-[#CE145B] text-white px-6 py-2 rounded-lg hover:bg-[#A81049] transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }
}