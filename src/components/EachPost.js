import { Link } from 'react-router-dom';
import Repost from './Repost';
import Comments from './Comments';
import Like from './Like';
import Analyses from './Analyses';
import ImageGrid from './ImageGrid';
import { useState } from 'react';

export default function EachPosts({ post, onShowImage, checkIfLiked, checkIfReposted, username }) {
  const dateObj = new Date(post.postedAt || post.repostedAt);
  const day = dateObj.getUTCDate(); // Get day (1-31)
  const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObj);
  const [controller, setController] = useState(null);
  const [likeCount, setLikeCount] = useState(post.likeCount || post.post.likeCount || 0);
  const [repostCount, setRepostCount] = useState(post.repostCount || post.post.repostCount || 0);
  const [seenLikedPost, setSeenLikedPost] = useState(checkIfLiked(isNotObject(post.post) ? post._id : post.post._id));
  const [seenRepostPost, setSeenRepostPost] = useState(
    checkIfReposted(isNotObject(post.post) ? post._id : post.post._id)
  );

  function isNotObject(variable) {
    return typeof variable !== 'object' && variable !== null;
  }
  async function handleLikeAndUnlikePost(postID) {
    let method;
    if (seenLikedPost) {
      method = 'DELETE';
      setLikeCount((state) => state - 1);
      setSeenLikedPost(false);
    } else {
      method = 'POST';
      setLikeCount((state) => state + 1);
      setSeenLikedPost(true);
    }

    if (controller) {
      console.log('clean up');
      controller.abort();
    }
    const newController = new AbortController();
    setController(newController);

    try {
      const options = {
        method,
        credentials: 'include',
        signal: newController.signal
      };
      const response = await fetch(`http://localhost:5000/api/v1/users/posts/${postID}/like`, options);
      const data = await response.json();
      if (!response.ok) {
        if (response.status >= 400 && response.status < 409) {
          // Handle 401 Unauthorized error, you can access the responseponse message
          setLikeCount((state) => state);
          return;
        } else {
          throw new Error(`Server error!!!, Error code: ${response.status}`);
        }
      }
      setLikeCount(data.likeCount);
    } catch (err) {}
  }

  async function handleRepostUnrepostPost(postID) {
    let method;
    if (seenRepostPost) {
      method = 'DELETE';
      setRepostCount((state) => state - 1);
      setSeenRepostPost(false);
    } else {
      method = 'POST';
      setRepostCount((state) => state + 1);
      setSeenRepostPost(true);
    }
    if (controller) {
      console.log('clean up');
      controller.abort();
    }
    const newController = new AbortController();
    setController(newController);

    try {
      const options = {
        method,
        credentials: 'include',
        signal: newController.signal
      };
      const response = await fetch(`http://localhost:5000/api/v1/users/posts/${postID}/repost`, options);
      const data = await response.json();
      if (!response.ok) {
        if (response.status >= 400 && response.status < 409) {
          // Handle 401 Unauthorized error, you can access the responseponse message
          setRepostCount((state) => state);
          return;
        } else {
          throw new Error(`Server error!!!, Error code: ${response.status}`);
        }
      }
      setRepostCount(data.repostCount);
    } catch (err) {}
  }

  return (
    <div className="each-post">
      <div className="user-dp-div">
        <img src={post.user[0].profilePic || 'http://localhost:5000/profile/default.jpg'} alt="user Dp" />
      </div>
      <div className="main-post-details">
        {isNotObject(post.post) ? (
          ''
        ) : (
          <Link to="/profile" className="user-link">
            <h4
              style={{
                color: 'rgba(252, 250, 250, 0.363)',
                fontWeight: '400',
                fontSize: '14px',
                marginBottom: '4px',
                display: 'block'
              }}
            >
              {post.user[0].username === username ? 'You' : post.user[0].name} reposted
            </h4>
          </Link>
        )}
        <Link to="/profile" className="user-link">
          <h4>{post.user[0].name}</h4>&nbsp;@{post.user[0].username}
        </Link>
        <span>
          &nbsp;&nbsp; <strong>.</strong> &nbsp;{monthName} {day}
        </span>
        <p>{isNotObject(post.post) ? post.post : post.post.post}</p>
        {(post.files && post.files.length > 0) || (post.post.files && post.post.files.length > 0) ? (
          <>
            <div
              className={
                (post.files && post.files.length === 1) || (post.post.files && post.post.files.length === 1)
                  ? 'image-grid-one'
                  : 'image-grid'
              }
            >
              <ImageGrid
                imageUrls={post.files || post.post.files}
                postID={post._id || post.post._id}
                onShowImage={onShowImage}
              />
            </div>
          </>
        ) : (
          ''
        )}
        <div className="interact">
          <span>
            <Comments className="comment-hover" />
          </span>
          <span
            onClick={() => handleRepostUnrepostPost(isNotObject(post.post) ? post._id : post.post._id)}
            style={{ display: 'flex', gap: '7px' }}
          >
            <Repost
              className="repost-hover"
              fill={seenRepostPost ? 'rgba(22, 212, 16, 0.89)' : 'rgba(252, 250, 250, 0.363)'}
            />
            {repostCount !== undefined && repostCount !== 0 ? (
              <span style={{ color: 'rgba(22, 212, 16, 0.89)' }}>{repostCount}</span>
            ) : (
              ''
            )}
          </span>
          <span
            onClick={() => handleLikeAndUnlikePost(isNotObject(post.post) ? post._id : post.post._id)}
            style={{ display: 'flex', gap: '7px' }}
          >
            <Like className="like-hover" fill={seenLikedPost ? 'red' : 'rgba(252, 250, 250, 0.363)'} />
            {likeCount !== undefined && likeCount !== 0 ? <span style={{ color: 'red' }}>{likeCount}</span> : ''}
          </span>
          <span>
            <Analyses className="analyse-hover" />
          </span>
        </div>
      </div>
    </div>
  );
}
