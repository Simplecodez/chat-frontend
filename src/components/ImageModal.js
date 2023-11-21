import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link, useParams } from 'react-router-dom';

const ImageModal = ({ imageUrl, imageUrlArray, postID, isOpen, onRequestClose }) => {
  const imageUrlSplit = imageUrl.split('/');
  const imageName = imageUrlSplit[imageUrlSplit.length - 1];
  const [imageNumber, setImageNumber] = useState(imageUrlArray.indexOf(imageName) + 1);
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);
  const [slideIn, setSlideIn] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [buttonPressed, setButtonPressed] = useState('');
  console.log(imageNumber);
  useEffect(
    function () {
      if (buttonPressed === 'next') {
        setNewImageUrl(`http://localhost:5000/images/${imageUrlArray[imageNumber - 1]}`);
      }
      const timer = setTimeout(() => {
        setSlideIn(false);
      }, 300);

      return () => {
        console.log('cleanup slideIn timer');
        clearTimeout(timer);
      };
    },
    [slideIn, imageUrlArray, imageNumber, buttonPressed]
  );
  useEffect(
    function () {
      if (buttonPressed === 'prev') {
        console.log('button pressed', imageNumber);
        setNewImageUrl(`http://localhost:5000/images/${imageUrlArray[imageNumber - 1]}`);
      }
      const timer = setTimeout(() => {
        setSlideOut(false);
      }, 300);

      return () => {
        console.log('cleanup slideIn timer');
        clearTimeout(timer);
      };
    },
    [slideOut, imageUrlArray, imageNumber, buttonPressed]
  );

  function handleGetNextImage() {
    setImageNumber((state) => state + 1);
    setButtonPressed('next');
    setSlideIn((state) => !state);
  }

  function handleGetPrevImage() {
    setImageNumber((state) => state - 1);
    setButtonPressed('prev');
    setSlideOut((state) => !state);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      contentLabel="Image Modal"
      style={{
        overlay: {
          overflow: 'hidden', // Hide the scroll bars on the overlay
          background: 'rgba(0, 0, 0, 0.7)'
        },
        content: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          //   transform: `translateY(${scrollPosition}px) scale(${isOpen ? 2 : 1.2})`, // Adjust scroll position
          //   transition: 'transform 10s ease',
          overflow: 'hidden', // Hide the scroll bars on the content
          background: 'rgba(0, 0, 0, 0.7)'
        }
      }}
    >
      <Link to="/profile" onClick={onRequestClose}>
        <span
          style={{ fontSize: '33px', color: 'white', position: 'absolute', top: '2%', left: '1%', cursor: 'pointer' }}
          onClick={onRequestClose}
        >
          &times;
        </span>
      </Link>
      {imageNumber - 1 !== 0 && (
        <Link to={`/profile/${postID}/photo/${imageNumber - 1}`} onClick={handleGetPrevImage}>
          <p style={{ fontSize: '28px', color: 'white', position: 'absolute', top: '50%', left: '10%' }}>{'<<<'}</p>
        </Link>
      )}

      <img
        src={newImageUrl}
        alt={newImageUrl}
        className={`slideInOutImage ${slideIn ? 'visible' : ''} ${slideOut ? 'hidden' : ''}`}
      />

      {imageNumber !== imageUrlArray.length && (
        <Link to={`/profile/${postID}/photo/${imageNumber + 1}`} onClick={handleGetNextImage}>
          <p style={{ fontSize: '28px', color: 'white', position: 'absolute', top: '50%', right: '10%' }}>{'>>>'}</p>
        </Link>
      )}
    </Modal>
  );
};
export default ImageModal;
