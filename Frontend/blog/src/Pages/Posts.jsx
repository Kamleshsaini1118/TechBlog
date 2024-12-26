import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import PostCard from "../components/PostCard";
import { FaSearch } from "react-icons/fa";

export default function Posts() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("http://localhost:4000/posts/get", {
          withCredentials: true,
        });

        // console.log("API Response:", response.data); // debugging ke liye use kiya tha

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("No posts found in API response");
        }

        if (isMounted) {
          setPosts(response.data);
          const tags = response.data.flatMap((post) => post.tags || []);
          setAllTags(Array.from(new Set(tags)));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error while fetching posts:", error.message);
          setError(error?.response?.data?.message || "Failed to load posts");
        }
      } finally {
        if (isMounted) {
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
    <div className="h-16 w-16 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 m-8">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post._id} 
          id={post._id}
          post={post} />
        ))}
      </div>
    </div>
  );
}
