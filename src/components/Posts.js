import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import EachPosts from './EachPost';
import { Spinner } from './Spinner';

function Posts({ onShowImage, username }) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [controller, setController] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [repostedPosts, setRepostedPosts] = useState([]);
  function checkIfReposted(postID) {
    const foundRepostedPost = repostedPosts.find((repostedPostID) => repostedPostID.post === postID);
    return !!foundRepostedPost;
  }

  function checkIfLiked(postID) {
    const foundLikedPost = likedPosts.find((likedPostID) => likedPostID.post === postID);
    return !!foundLikedPost;
  }

  async function initialFetch(when) {
    if (controller) {
      console.log('clean up');
      controller.abort();
    }
    const newController = new AbortController();
    setController(newController);

    try {
      const options = {
        method: 'GET',
        credentials: 'include',
        signal: newController.signal
      };

      const response = await fetch(
        `http://localhost:5000/api/v1/users/posts/${username}?page=${page}&limit=3`,
        options
      );
      if (!response.ok) {
        if (response.status >= 400 && response.status < 409) {
          // Handle 401 Unauthorized error, you can access the response message
          const errorData = await response.json(); // If the server sends an error message in the response body
          const errorMessage = errorData.message; // Access the error message
          setErrorMessage(errorMessage);
          return;
        } else {
          console.log('error');
          throw new Error(`Server error!!!, Error code: ${response.status}`);
        }
      }

      const feedback = await response.json();

      if (feedback.status === 'success') {
        if (feedback.data.posts.length > 0) {
          if (when === 'first') {
            setPosts(feedback.data.posts);
            setLikedPosts(feedback.data.likedPosts);
            setRepostedPosts(feedback.data.repostedPosts);
            setPage(2);
          } else if (when === 'second') {
            setPage((page) => page + 1);
            setPosts((prevPosts) => [...prevPosts, ...feedback.data.posts]);
          }
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error);
        setErrorMessage('Network error: Unable to fetch data. Please check your internet connection.');
      }
    }
  }

  function handleInfiniteScroll() {
    if (page > 1) initialFetch('second');
  }

  useEffect(() => {
    initialFetch('first');
    return () => {
      if (controller) {
        console.log('clean up');
        controller.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={handleInfiniteScroll}
      hasMore={hasMore} // You can control this based on your logic
      loader={<Spinner className="post-loader" size="3x" />}
      style={{ overflow: 'hidden' }}
    >
      {posts.map((el) => (
        <EachPosts
          post={el}
          key={el._id}
          onShowImage={onShowImage}
          checkIfLiked={checkIfLiked}
          checkIfReposted={checkIfReposted}
          username={username}
        />
      ))}
    </InfiniteScroll>
  );
}

export default Posts;
