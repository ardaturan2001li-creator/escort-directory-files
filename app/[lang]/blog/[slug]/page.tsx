import { getPostData } from '../../../../lib/blog';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl bg-gray-900 text-gray-200 shadow-xl mt-8 rounded-xl">
      {postData.image && <img src={postData.image} alt={postData.title} className="w-full h-64 object-cover rounded-t-xl mb-8" />}
      <h1 className="text-4xl font-bold mb-4 text-white text-center">{postData.title}</h1>
      <div className="text-gray-400 text-center mb-8">{postData.date}</div>
      <div 
        className="prose prose-invert prose-pink max-w-none prose-a:text-pink-400 hover:prose-a:text-pink-300"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
    </article>
  );
}
