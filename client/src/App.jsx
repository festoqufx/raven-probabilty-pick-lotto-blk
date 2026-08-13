import axios from 'axios';
import { useState, useEffect } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import {
  IoCopyOutline,
  IoBookmarkOutline,
  IoTimeOutline,
  IoStatsChartOutline,
  IoFilterOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import './App.css';
import Ball from './components/Ball';
import LineDesign from './components/LineDesign';
import LottoTypeRadio from './components/LottoTypeRadio';
import PopupInfo from './components/PopupInfo';
import StatsModal from './components/StatsModal';
import HistoryDrawer from './components/HistoryDrawer';
import { LOTTO_GAMES, generateClientNumbers } from './data/pcsoData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function App() {
  const [lottoType, setLottoType] = useState(42);
  const [method, setMethod] = useState('probability'); // 'probability' | 'random' | 'balanced'
  const [setCount, setSetCount] = useState(1); // 1, 3, 5, 10
  const [autoSort, setAutoSort] = useState(true);
  
  // Results can be an array of number sets: e.g. [[1, 2, 3, 4, 5, 6], ...]
  const [results, setResults] = useState([['?', '?', '?', '?', '?', '?']]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Filter settings
  const [showFilters, setShowFilters] = useState(false);
  const [includeNum, setIncludeNum] = useState('');
  const [excludeNums, setExcludeNums] = useState('');

  // Modals
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Saved history in localStorage
  const [savedHistory, setSavedHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('probability_pick_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('probability_pick_history', JSON.stringify(savedHistory));
    } catch {
      // ignore storage errors
    }
  }, [savedHistory]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleGameSelect = (type) => {
    setLottoType(type);
    setResults(Array.from({ length: setCount }, () => ['?', '?', '?', '?', '?', '?']));
  };

  const handleSetCountChange = (count) => {
    setSetCount(count);
    setResults(Array.from({ length: count }, () => ['?', '?', '?', '?', '?', '?']));
  };

  const handleGenerate = async () => {
    setLoading(true);

    const parsedExclude = excludeNums
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '' && !isNaN(s))
      .map(Number);

    try {
      // Try backend first if available
      let fetchedSets = [];
      const response = await axios.get(
        `${API_BASE_URL}/api/generate/${lottoType}?count=${setCount}`,
        { timeout: 3500 }
      );

      if (Array.isArray(response.data)) {
        if (Array.isArray(response.data[0])) {
          fetchedSets = response.data;
        } else {
          fetchedSets = [response.data];
        }
      }

      // If backend fetched valid numbers, apply sorting/filter rules if needed
      if (fetchedSets.length > 0) {
        const finalSets = fetchedSets.map((arr) => (autoSort ? [...arr].sort((a, b) => a - b) : arr));
        setResults(finalSets);
      } else {
        throw new Error('Fallback to client sampling');
      }
    } catch {
      // Offline fallback using pre-compiled historical weights engine
      const generatedSets = [];
      for (let i = 0; i < setCount; i++) {
        const set = generateClientNumbers(
          lottoType,
          method,
          autoSort,
          includeNum,
          parsedExclude
        );
        generatedSets.push(set);
      }
      setResults(generatedSets);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const saveCombination = (setNumbers) => {
    if (setNumbers.includes('?')) return;
    const newItem = {
      lottoType,
      numbers: setNumbers,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSavedHistory((prev) => [newItem, ...prev]);
    showToast('Saved to history!');
  };

  const currentGame = LOTTO_GAMES[lottoType];

  return (
    <div className='min-h-screen bg-[#09090b] px-3 py-6 text-zinc-100 selection:bg-white selection:text-black sm:py-10'>
      <PopupInfo />

      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-bounce'>
          <IoCheckmarkCircle className='text-base text-white' />
          {toastMessage}
        </div>
      )}

      <div className='mx-auto min-h-[calc(100vh-4rem)] max-w-[620px] flex flex-col justify-center'>
        <main className='bw-card w-full rounded-[32px] p-5 sm:p-8'>
          
          {/* Header Bar */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950 font-black text-sm'>
                π
              </div>
              <span className='text-xs font-black uppercase tracking-[0.25em] text-zinc-400'>
                ProbabilityPick
              </span>
            </div>

            {/* Quick Action Drawer Buttons */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setShowStats(true)}
                className='flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[11px] font-bold text-zinc-300 hover:border-white hover:text-white transition-all'
                title='View PCSO Statistics & Draw Info'
              >
                <IoStatsChartOutline className='text-sm' />
                <span>Stats</span>
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className='relative flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[11px] font-bold text-zinc-300 hover:border-white hover:text-white transition-all'
                title='Saved combinations'
              >
                <IoTimeOutline className='text-sm' />
                <span>History</span>
                {savedHistory.length > 0 && (
                  <span className='ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-zinc-950'>
                    {savedHistory.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <LineDesign />

          {/* Hero Branding */}
          <div className='my-3 text-center'>
            <h1 className='text-2xl font-black uppercase tracking-[0.35em] text-white sm:text-3xl'>
              PCSO LOTTO <span className='text-zinc-500'>PICK</span>
            </h1>
            <p className='mt-1 text-[11px] font-medium tracking-wide text-zinc-400'>
              Data-Driven Probability Sampling & Combination Generator
            </p>
          </div>

          {/* Draw Preview Area */}
          <div className='mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-inner sm:p-5'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-white animate-pulse'></span>
                <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400'>
                  Generated Picks ({setCount} {setCount === 1 ? 'Set' : 'Sets'})
                </p>
              </div>
              <span className='rounded-full border border-zinc-700 bg-zinc-900 px-3 py-0.5 text-[10px] font-bold text-white'>
                {currentGame.name}
              </span>
            </div>

            {/* Generated Numbers Container */}
            <div className='space-y-3.5'>
              {results.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className='group relative rounded-xl border border-zinc-900 bg-zinc-900/40 p-3 transition-all hover:border-zinc-700'
                >
                  <div className='grid grid-cols-6 gap-2 sm:gap-3'>
                    {set.map((number, ballIndex) => (
                      <Ball key={ballIndex} number={number} delay={ballIndex * 60} />
                    ))}
                  </div>

                  {!set.includes('?') && (
                    <div className='mt-2.5 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-400'>
                      <span>Set #{setIndex + 1}</span>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => copyToClipboard(set.join(', '))}
                          className='flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-200 hover:bg-white hover:text-black transition-all'
                        >
                          <IoCopyOutline /> Copy
                        </button>
                        <button
                          onClick={() => saveCombination(set)}
                          className='flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-200 hover:bg-white hover:text-black transition-all'
                        >
                          <IoBookmarkOutline /> Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Game Selection */}
          <div className='mt-5'>
            <label className='mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400'>
              Select Game
            </label>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-5'>
              {[42, 45, 49, 55, 58].map((type) => (
                <LottoTypeRadio
                  key={type}
                  type={type}
                  lottoType={lottoType}
                  onSelect={handleGameSelect}
                />
              ))}
            </div>
          </div>

          {/* Algorithm & Configuration Options */}
          <div className='mt-4 space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4'>
            {/* Sampling Method */}
            <div>
              <label className='mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400'>
                Generation Mode
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { id: 'probability', label: 'Probability', desc: 'Historical' },
                  { id: 'random', label: 'Pure Random', desc: 'Uniform' },
                  { id: 'balanced', label: 'Hot/Cold Mix', desc: 'Balanced' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => setMethod(item.id)}
                    className={`rounded-xl border px-2 py-2 text-center transition-all ${
                      method === item.id
                        ? 'bw-pill-active font-bold'
                        : 'bw-pill text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className='text-xs uppercase font-bold tracking-wider'>{item.label}</p>
                    <p className={`text-[9px] ${method === item.id ? 'text-zinc-800' : 'text-zinc-500'}`}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Set Count & Controls */}
            <div className='flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-900'>
              {/* Multi-set selector */}
              <div>
                <span className='mr-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400'>
                  Sets:
                </span>
                <div className='inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5'>
                  {[1, 3, 5, 10].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleSetCountChange(count)}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                        setCount === count
                          ? 'bg-white text-zinc-950 shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className='flex items-center gap-3'>
                <label className='flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-300'>
                  <input
                    type='checkbox'
                    checked={autoSort}
                    onChange={(e) => setAutoSort(e.target.checked)}
                    className='h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-white accent-white cursor-pointer'
                  />
                  <span>Auto-Sort</span>
                </label>

                <button
                  type='button'
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                    showFilters ? 'border-white bg-white text-black' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <IoFilterOutline />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Filter Inputs Drawer */}
            {showFilters && (
              <div className='mt-3 space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs'>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  <div>
                    <label className='block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1'>
                      Must Include (Optional #)
                    </label>
                    <input
                      type='number'
                      min='1'
                      max={currentGame.max}
                      placeholder='e.g. 7'
                      value={includeNum}
                      onChange={(e) => setIncludeNum(e.target.value)}
                      className='w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1'>
                      Exclude (Comma Separated)
                    </label>
                    <input
                      type='text'
                      placeholder='e.g. 13, 4, 18'
                      value={excludeNums}
                      onChange={(e) => setExcludeNums(e.target.value)}
                      className='w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className='bw-button-primary mt-5 flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-black uppercase tracking-[0.3em] disabled:opacity-50'
          >
            {loading ? <ImSpinner2 className='animate-spin text-lg' /> : null}
            {loading ? 'Computing Probability...' : `Generate ${currentGame.shortName} (${setCount} ${setCount === 1 ? 'Set' : 'Sets'})`}
          </button>

          <LineDesign />

          {/* Disclaimer & Footer */}
          <p className='text-center text-[10px] leading-relaxed text-zinc-500'>
            Exclusively calibrated for PCSO draws using statistical probability sampling.
          </p>

          <footer className='mt-4 flex flex-col items-center justify-center gap-2 border-t border-zinc-900 pt-4 text-center'>
            <p className='text-[11px] text-zinc-500'>Made with ❤️ by Ravenom</p>
            <a
              href='https://github.com/festoqufx/lotto-probability-pick'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[10px] font-bold text-zinc-300 transition-all hover:border-white hover:text-white'
            >
              ⭐ Star Me On GitHub
            </a>
          </footer>
        </main>
      </div>

      {/* Modals */}
      {showStats && (
        <StatsModal lottoType={lottoType} onClose={() => setShowStats(false)} />
      )}

      {showHistory && (
        <HistoryDrawer
          history={savedHistory}
          onClose={() => setShowHistory(false)}
          onClear={() => {
            setSavedHistory([]);
            showToast('History cleared');
          }}
          onCopySet={(text) => copyToClipboard(text)}
          onToast={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}

export default App;