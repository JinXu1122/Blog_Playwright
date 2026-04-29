import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              My Blog
            </Link>
            <Link
              href="/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Write Post
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <div className="flex gap-3 text-sm">
              <Link href="/" className="text-gray-600 hover:text-blue-600">All</Link>
              <Link href="/?category=tech" className="text-gray-600 hover:text-blue-600">Tech</Link>
              <Link href="/?category=life" className="text-gray-600 hover:text-blue-600">Life</Link>
              <Link href="/?category=thoughts" className="text-gray-600 hover:text-blue-600">Thoughts</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
