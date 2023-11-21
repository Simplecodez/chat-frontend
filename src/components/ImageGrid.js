import React from 'react';
import { Link } from 'react-router-dom';

const ImageGrid = ({ imageUrls, postID, onShowImage }) => {
  return (
    <>
      {imageUrls.map((imageUrl, index) => (
        <Link
          to={`/profile/${postID}/photo/${index + 1}`}
          key={index}
          className="image-grid-item"
          onClick={() => onShowImage(`http://localhost:5000/images/${imageUrl}`, imageUrls, postID)}
        >
          <img src={`http://localhost:5000/images/${imageUrl}`} alt={`user-post-pics${index}`} />
        </Link>
      ))}
    </>
  );
};

export default ImageGrid;
