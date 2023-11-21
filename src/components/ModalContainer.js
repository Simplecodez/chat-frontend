import React, { useEffect } from 'react';
import ImageModal from './ImageModal';

const ModalContainer = ({ imageUrl, imageUrlArray, postID, isOpen, onRequestClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <ImageModal
      imageUrl={imageUrl}
      imageUrlArray={imageUrlArray}
      postID={postID}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  );
};

export default ModalContainer;
