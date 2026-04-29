import PostForm from '@/components/PostForm';

export default function CreatePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Write Post</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <PostForm />
      </div>
    </div>
  );
}
