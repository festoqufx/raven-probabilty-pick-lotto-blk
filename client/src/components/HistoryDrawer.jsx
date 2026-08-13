import PropTypes from 'prop-types';
import { IoClose, IoTrashOutline, IoCopyOutline, IoDownloadOutline } from 'react-icons/io5';
import LineDesign from './LineDesign';

function HistoryDrawer({ history, onClose, onClear, onCopySet, onToast }) {
  const exportCSV = () => {
    if (history.length === 0) return;
    const header = 'Timestamp,Lotto Game,Numbers\n';
    const rows = history
      .map((item) => `"${item.timestamp}","Lotto ${item.lottoType}","${item.numbers.join('-')}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProbabilityPick_Saved_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('History exported as CSV');
  };

  return (
    <div className='popup fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div className='popup-content bw-card my-8 w-full max-w-[620px] rounded-3xl p-6 text-zinc-200'>
        <div className='flex items-center justify-between'>
          <div>
            <span className='rounded-md bg-white px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950'>
              Saved Favorites
            </span>
            <h2 className='text-2xl font-bold tracking-tight text-white mt-1'>
              Saved Combinations ({history.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            aria-label='Close history modal'
          >
            <IoClose className='text-2xl' />
          </button>
        </div>

        <LineDesign />

        {history.length === 0 ? (
          <div className='my-8 text-center py-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40'>
            <p className='text-sm text-zinc-400 font-medium'>No saved combinations yet.</p>
            <p className='mt-1 text-xs text-zinc-600'>Generate numbers and click the save icon to store your picks.</p>
          </div>
        ) : (
          <>
            <div className='max-h-[360px] space-y-2.5 overflow-y-auto pr-1'>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 transition-all hover:border-zinc-700'
                >
                  <div>
                    <div className='flex items-center gap-2 mb-1.5'>
                      <span className='rounded bg-white px-2 py-0.5 text-[9px] font-black text-zinc-950 uppercase'>
                        Lotto {item.lottoType}
                      </span>
                      <span className='text-[10px] text-zinc-500 font-medium'>{item.timestamp}</span>
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {item.numbers.map((num, i) => (
                        <span
                          key={i}
                          className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-bold text-white shadow-sm'
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onCopySet(item.numbers.join(', '))}
                    className='rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:border-white hover:text-white transition-all ml-3 shrink-0'
                    title='Copy combination'
                  >
                    <IoCopyOutline className='text-base' />
                  </button>
                </div>
              ))}
            </div>

            <div className='mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800'>
              <div className='flex gap-2'>
                <button
                  onClick={exportCSV}
                  className='flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-white hover:text-white transition-all'
                >
                  <IoDownloadOutline className='text-sm' />
                  Export CSV
                </button>
                <button
                  onClick={onClear}
                  className='flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:border-zinc-600 hover:text-white transition-all'
                >
                  <IoTrashOutline className='text-sm' />
                  Clear All
                </button>
              </div>

              <button
                onClick={onClose}
                className='bw-button-primary rounded-xl px-5 py-2 text-xs font-bold'
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

HistoryDrawer.propTypes = {
  history: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onCopySet: PropTypes.func.isRequired,
  onToast: PropTypes.func.isRequired,
};

export default HistoryDrawer;
