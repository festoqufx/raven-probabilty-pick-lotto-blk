import { useState, useEffect } from 'react';
import { BiSolidInfoSquare } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import LineDesign from './LineDesign';

const PopupInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed right-4 top-4 z-20 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 p-2.5 text-zinc-300 backdrop-blur-md transition-all hover:border-white hover:bg-zinc-800 hover:text-white'
        title='App Information & Methodology'
        aria-label='About ProbabilityPick'
      >
        <BiSolidInfoSquare className='text-xl' />
      </button>

      {isOpen && (
        <div className='popup fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='popup-content bw-card w-full max-w-[500px] rounded-3xl p-6 text-zinc-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='rounded-lg bg-white px-2.5 py-1 text-xs font-black uppercase text-zinc-950'>
                  PCSO
                </span>
                <h2 className='text-xl font-bold tracking-tight text-white'>About ProbabilityPick</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                aria-label='Close modal'
              >
                <IoClose className='text-xl' />
              </button>
            </div>

            <LineDesign />

            <div className='space-y-4 text-xs leading-relaxed text-zinc-300'>
              <p>
                <strong>ProbabilityPick</strong> uses empirical draw history from the Philippine Charity Sweepstakes Office (PCSO) to compute weighted probability distributions for each ball position.
              </p>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3'>
                <h4 className='mb-1 font-bold text-white uppercase tracking-wider text-[11px]'>Official Data Source</h4>
                <a
                  href='https://www.pcsodraw.com/'
                  target='_blank'
                  rel='noreferrer'
                  className='text-white underline hover:text-zinc-300 text-[11px]'
                >
                  https://www.pcsodraw.com/
                </a>
                <p className='mt-1 text-[10px] text-zinc-400'>
                  Data includes full historical winning numbers for Lotto 6/42, 6/45, 6/49, 6/55, and Ultra Lotto 6/58.
                </p>
              </div>

              <p className='text-zinc-400 italic text-[11px]'>
                Note: Lottery draws are fundamentally random events. Historical frequency probability modeling provides statistical insights and pattern distribution, but does not guarantee future jackpot outcomes.
              </p>
            </div>

            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => setIsOpen(false)}
                className='bw-button-primary rounded-xl px-5 py-2.5 text-xs font-bold'
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupInfo;
