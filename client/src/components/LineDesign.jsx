function LineDesign() {
  return (
    <div className='my-4 flex items-center justify-center gap-1.5 opacity-80' aria-hidden='true'>
      <div className='h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-white to-transparent'></div>
      <div className='h-1.5 w-1.5 shrink-0 rounded-full bg-white'></div>
      <div className='h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-white to-transparent'></div>
    </div>
  );
}

export default LineDesign;