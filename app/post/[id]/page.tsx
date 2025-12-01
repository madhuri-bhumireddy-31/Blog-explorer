
export default async function PostDetailsPage( { params,}:{params: Promise<{ id: number }>;}) {
  const postId = (await params).id;
  // parallel query
  const [postRes, commentsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`),
  ]);
  const post = await postRes.json();
  const comments = await commentsRes.json();
  //  Dependent query
  const authorRes = await fetch(
    `https://jsonplaceholder.typicode.com/users/${post.userId}`
  );
  const author = await authorRes.json();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700">{post.title}</h1>
      <p className="mt-4 text-gray-700">{post.body}</p>
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Author</h2>
      <p className="text-gray-600">{author?.name}</p>
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      {comments?.map((c: any) => (
        <div key={c.id} className="border-b py-3">
          <p style={{ color: 'black', fontWeight: 'bold', marginTop: '10px' }}>{c.name}</p>
          <p>{c.body}</p>
          <br />
        </div>
      ))}
    </div>
  );
}
