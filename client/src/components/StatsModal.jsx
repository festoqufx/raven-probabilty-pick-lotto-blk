import PropTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';
import { LOTTO_GAMES, getHotColdNumbers } from '../data/pcsoData';
import LineDesign from './LineDesign';

function StatsModal({ lottoType, onClose }) {
  const game = LOTTO_GAMES[lottoType] || LOTTO_GAMES[42];
  const { hot, cold } = getHotColdNumbers(game.id);

  return (
    <div className='popup fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div className='popup-content bw-card my-8 w-full max-w-[620px] rounded-3xl p-6 text-zinc-200'>
        <div className='flex items-center justify-between'>
          <div>
            <span className='rounded-md bg-white px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950'>
              Insights & Analytics
            </span>
            <h2 className='text-2xl font-bold tracking-tight text-white mt-1'>
              {game.name} Analysis
            </h2>
          </div>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            aria-label='Close insights modal'
          >
            <IoClose className='text-2xl' />
          </button>
        </div>

        <LineDesign />

        {/* Matrix Grid */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-zinc-500'>Numbers Range</p>
            <p className='mt-1 text-lg font-black text-white'>1 – {game.max}</p>
          </div>
          <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-zinc-500'>Draw Schedule</p>
            <p className='mt-1 text-xs font-bold text-white'>{game.drawDays}</p>
          </div>
          <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-zinc-500'>Jackpot Base</p>
            <p className='mt-1 text-xs font-bold text-white'>{game.minJackpot}</p>
          </div>
          <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center'>
            <p className='text-[10px] font-semibold uppercase tracking-wider text-zinc-500'>Combinations</p>
            <p className='mt-1 text-xs font-bold text-white'>{game.odds}</p>
          </div>
        </div>

        {/* Hot / Cold Analysis */}
        <div className='mt-6 space-y-4'>
          <div className='rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-white'></span>
                Hot Numbers (Highest Draw Frequencies)
              </h3>
              <span className='text-[10px] text-zinc-400'>Top 8</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {hot.map(({ number, count }) => (
                <div
                  key={number}
                  className='flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs font-bold text-white'
                >
                  <span className='rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-zinc-950'>
                    #{number}
                  </span>
                  <span className='text-[10px] text-zinc-400'>{count}x</span>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-zinc-600'></span>
                Cold Numbers (Lowest Draw Frequencies)
              </h3>
              <span className='text-[10px] text-zinc-400'>Bottom 8</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {cold.map(({ number, count }) => (
                <div
                  key={number}
                  className='flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs text-zinc-300'
                >
                  <span className='rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300'>
                    #{number}
                  </span>
                  <span className='text-[10px] text-zinc-500'>{count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <button
            onClick={onClose}
            className='bw-button-primary rounded-xl px-5 py-2.5 text-xs font-bold'
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

StatsModal.propTypes = {
  lottoType: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatsModal;
