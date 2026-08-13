import PropTypes from 'prop-types';
import { LOTTO_GAMES } from '../data/pcsoData';

function LottoTypeRadio({ type, lottoType, onSelect }) {
  const game = LOTTO_GAMES[type];
  const isSelected = lottoType === type;

  return (
    <button
      type='button'
      onClick={() => onSelect(type)}
      className={`group relative flex flex-col items-center justify-between rounded-xl border p-3 text-left transition-all ${
        isSelected
          ? 'bw-pill-active scale-[1.02]'
          : 'bw-pill text-zinc-300 hover:text-white'
      }`}
      aria-checked={isSelected}
      role='radio'
    >
      <div className='flex w-full items-center justify-between gap-1'>
        <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
          {game.shortName}
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight ${
            isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {game.max} Max
        </span>
      </div>

      <p className={`mt-1.5 w-full text-[10px] font-medium tracking-tight ${isSelected ? 'text-zinc-800' : 'text-zinc-400'}`}>
        {game.drawDays}
      </p>

      {isSelected && (
        <span className='absolute -top-1 -right-1 flex h-3 w-3'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75'></span>
          <span className='relative inline-flex h-3 w-3 rounded-full bg-white'></span>
        </span>
      )}
    </button>
  );
}

LottoTypeRadio.propTypes = {
  type: PropTypes.number.isRequired,
  lottoType: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

export default LottoTypeRadio;