import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Spinner({ className, size }) {
  return (
    <span className={className}>
      <FontAwesomeIcon icon={faSpinner} size={size} color="brown" spin />
    </span>
  );
}
