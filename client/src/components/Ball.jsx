import { memo } from 'react';
import PropTypes from 'prop-types';

function Ball({ number, delay = 0 }) {
  const isQuestion = number === '?';

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`relative flex items-center justify-center transition-all ${
        isQuestion ? 'ball-placeholder' : 'ball-monochrome animate-ball'
      }`}
      aria-label={isQuestion ? 'Unrevealed lotto number' : `Lotto number ${number}`}
    >
      <span className='z-10 font-black drop-shadow-sm'>{number}</span>
    </div>
  );
}

Ball.propTypes = {
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  delay: PropTypes.number,
};

const MemoizedBall = memo(Ball);
export default MemoizedBall;