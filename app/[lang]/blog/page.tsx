import Link from 'next/link';
import { getSortedPostsData } from '../../../lib/blog';

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Latest Escort & VIP Nightlife Articles</h1>
      <div className="grid gap-6">
        {allPostsData.map(({ id, date, title, image }) => (
          <Link href={`/en/blog/${id}`} key={id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition flex flex-col md:flex-row">
              {image && <img src={image} alt={title} className="w-full md:w-1/3 h-48 object-cover" />}
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-pink-500 mb-2">{title}</h2>
                <small className="text-gray-400">{date}</small>
                <p className="text-gray-300 mt-2">Read our latest guide to discover the best VIP experiences...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
