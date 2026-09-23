import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-6xl font-black text-red-600">404</h1>
        <h2 className="text-2xl font-bold">Destination Not Found</h2>
        <p className="text-neutral-400 text-sm">
          The requested city or listing does not exist in our global directory.
        </p>
        <div className="pt-4">
          <Link
            href="/en"
            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-sm transition-colors inline-block"
          >
            &larr; Back to Global Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
