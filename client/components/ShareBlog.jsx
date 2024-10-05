import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ShareButton = ({ children, onClick }) => (
  <button
    className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </button>
);

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/post/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost({
          ...data,
          author: data.author.username || data.author,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

      fetchPost();

  }, []);

  const shareUrl = window.location.href;

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareOnInstagram = () => {
    // Note: Instagram doesn't have a direct share URL like Twitter or Facebook
    // Usually, this would open the Instagram app or website
    // For now, we'll copy the URL to clipboard and alert the user
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('URL copied to clipboard! Open Instagram to share.');
    }).catch(() => {
      alert('Failed to copy URL. Please copy it manually: ' + shareUrl);
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading post...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!post) {
    return <div className="text-center">No post found</div>;
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">By {post.email}</p>
      {post.cover && (
        <div className="mb-8 relative w-full h-[400px]">
          <img
            src={post.cover}
            alt={post.title}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}
      <p className="text-xl mb-6 font-semibold">{post.summary}</p>
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="flex flex-wrap gap-4 mb-4">
        <ShareButton onClick={shareOnTwitter}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Share on Twitter
        </ShareButton>

        <ShareButton onClick={shareOnInstagram}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Share on Instagram
        </ShareButton>
      </div>
    </article>
  );
}