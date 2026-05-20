function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-luxury-bg px-4">
      <h1 className="font-title text-4xl md:text-6xl font-bold text-luxury-gold tracking-widest uppercase text-center mb-4">
        KRTS BEAUTY
      </h1>
      <p className="font-body text-luxury-silver text-sm md:text-base text-center max-w-md tracking-wide">
        The New Era of Beauty & Style Discovery. Premium, Cinematic, Addictive.
      </p>
      <button className="mt-8 px-8 py-3 bg-luxury-gold text-black font-title text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 ease-out shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        Keşfetmeye Başla
      </button>
    </div>
  );
}

export default App;
