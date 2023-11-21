function Modal({ display, children }) {
  return <div className={`modal-in ${display ? 'zoomed' : ''}`}>{children}</div>;
}

export default Modal;
