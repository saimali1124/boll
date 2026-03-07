import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { bollywoodMovies } from './moviesData';
import { movieEmojis } from './moviesEmojis';

function App() {
  const [targetMovie, setTargetMovie] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [yearRange, setYearRange] = useState({ min: null, max: null });
  const [revealedGenres, setRevealedGenres] = useState(new Set());
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'emoji'
  const [revealedEmojis, setRevealedEmojis] = useState(1); // Start with 1 emoji revealed
  const [winMessages, setWinMessages] = useState({ noReward: '', reward: '' });
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Win message arrays
  const noRewardMessages = [
    'No coffee for you',
    'No crumble cookie for you',
    'No cheese factor pizza for you'
  ];

  const rewardMessages = [
    'Your joyland tickets are confirmed',
    'Salman Khan is proud of you',
    'Shahrukh khan wants to meet you'
  ];

  // Calculate min and max years from all movies (memoized)
  const initialYearRange = useMemo(() => {
    const years = bollywoodMovies.map(movie => movie.year);
    return {
      min: Math.min(...years) -1,
      max: Math.max(...years) +1
    };
  }, []);

  // Initialize target movie and year range on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bollywoodMovies.length);
    const movie = bollywoodMovies[randomIndex];
    setTargetMovie(movie);
    setYearRange({
      min: initialYearRange.min,
      max: initialYearRange.max
    });
    setRevealedEmojis(1); // Reset to 1 revealed emoji for new game
  }, [initialYearRange]);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on input (deduplicate by name so each movie appears once)
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const seen = new Set();
      const filtered = bollywoodMovies
        .filter(movie => {
          if (seen.has(movie.name)) return false;
          if (!movie.name.toLowerCase().includes(inputValue.toLowerCase())) return false;
          if (guesses.some(g => g.name === movie.name)) return false;
          seen.add(movie.name);
          return true;
        })
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, guesses]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleMovieSelect = (movie) => {
    if (guesses.length >= 7 || gameWon || gameLost) return;
    if (guesses.some(g => g.name === movie.name)) return;

    const newGuesses = [...guesses, movie];
    setGuesses(newGuesses);
    setInputValue('');
    setShowSuggestions(false);

    // Check if won
    if (movie.name === targetMovie.name) {
      // Generate random win messages
      const randomNoReward = noRewardMessages[Math.floor(Math.random() * noRewardMessages.length)];
      const randomReward = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];
      setWinMessages({ noReward: randomNoReward, reward: randomReward });
      setGameWon(true);
      return;
    }

    // Update year range
    updateYearRange(movie.year);

    // Update revealed genres
    const commonGenres = movie.genres.filter(genre => 
      targetMovie.genres.includes(genre)
    );
    if (commonGenres.length > 0) {
      setRevealedGenres(prev => {
        const newSet = new Set(prev);
        commonGenres.forEach(genre => newSet.add(genre));
        return newSet;
      });
    }

    // In emoji mode, reveal one more emoji per guess
    if (gameMode === 'emoji') {
      setRevealedEmojis(prev => Math.min(prev + 1, 7));
    }

    // Check if lost
    if (newGuesses.length >= 7) {
      setGameLost(true);
    }
  };

  const updateYearRange = (guessedYear) => {
    setYearRange(prev => {
      let newMin = prev.min;
      let newMax = prev.max;

      if (guessedYear < targetMovie.year) {
        // Guessed year is before target - update minimum
        newMin = Math.max(newMin, guessedYear);
      } else if (guessedYear > targetMovie.year) {
        // Guessed year is after target - update maximum
        newMax = Math.min(newMax, guessedYear);
      }

      return { min: newMin, max: newMax };
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleMovieSelect(suggestions[0]);
    }
  };

  const resetGame = (newMode = null) => {
    // If switching modes, filter movies that have emojis in emoji mode
    let availableMovies = bollywoodMovies;
    if (newMode === 'emoji' || (newMode === null && gameMode === 'emoji')) {
      availableMovies = bollywoodMovies.filter(movie => movieEmojis[movie.name]);
    }
    
    const randomIndex = Math.floor(Math.random() * availableMovies.length);
    const movie = availableMovies[randomIndex];
    setTargetMovie(movie);
    setGuesses([]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setYearRange({
      min: initialYearRange.min,
      max: initialYearRange.max
    });
    setRevealedGenres(new Set());
    setRevealedEmojis(1); // Reset to 1 revealed emoji
    setGameWon(false);
    setGameLost(false);
    setWinMessages({ noReward: '', reward: '' });
  };

  const getTargetMovieEmojis = () => {
    if (!targetMovie) return [];
    return movieEmojis[targetMovie.name] || [];
  };

  const formatYearRange = () => {
    if (!targetMovie || yearRange.min == null || yearRange.max == null) {
      return null;
    }
    // If any guess matched the target year, show exact year
    const yearMatched = guesses.some(g => g.year === targetMovie.year);
    if (yearMatched) {
      return `Year = ${targetMovie.year}`;
    }
    return `${yearRange.min} < ? < ${yearRange.max}`;
  };

  const getCommonGenresCount = (movie) => {
    return movie.genres.filter(genre => targetMovie.genres.includes(genre)).length;
  };

  if (!targetMovie) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎬 Fizzah's Bollywoodle</h1>
        <p className="subtitle">Sponsored by Crumble, Cheese Factor and Coco Cubano!</p>
        <p className="subtitle" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Guess the Bollywood movie in 7 tries!</p>
        
        <div className="game-mode-toggle">
          <button
            className={`mode-btn ${gameMode === 'classic' ? 'active' : ''}`}
            onClick={() => {
              setGameMode('classic');
              resetGame('classic');
            }}
          >
            Classic Mode
          </button>
          <button
            className={`mode-btn ${gameMode === 'emoji' ? 'active' : ''}`}
            onClick={() => {
              setGameMode('emoji');
              resetGame('emoji');
            }}
          >
            Emoji Mode
          </button>
        </div>

        {gameWon && targetMovie && (
          <div className="game-status won">
            <h2>🎉 Congratulations! You guessed it!</h2>
            <p>The movie was: <strong>{targetMovie.name}</strong> ({targetMovie.year})</p>
            <p className="win-message reward">{winMessages.reward || 'Your joyland tickets are confirmed'}</p>
            <button onClick={resetGame} className="reset-btn">Play Again</button>
          </div>
        )}

        {gameLost && !gameWon && targetMovie && (
          <div className="game-status lost">
            <h2>😔 Game Over!</h2>
            <p>The movie was: <strong>{targetMovie.name}</strong> ({targetMovie.year})</p>
            <p className="win-message">{winMessages.noReward || 'No coffee for you'}</p>
            <button onClick={resetGame} className="reset-btn">Play Again</button>
          </div>
        )}

        {gameMode === 'classic' && (
          <>
            <div className="year-range-display">
              {targetMovie && formatYearRange() && (
                <div className="year-range">
                  <strong>Year Range:</strong> {formatYearRange()}
                </div>
              )}
            </div>

            {targetMovie && (
              <div className="genres-display">
                <div className="genres-container">
                  <strong>Genres:</strong>
                  <div className="genres-list">
                    {targetMovie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className={`genre-placeholder ${revealedGenres.has(genre) ? 'revealed' : ''}`}
                      >
                        {revealedGenres.has(genre) ? genre : 'y'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {gameMode === 'emoji' && targetMovie && (
          <>
            <div className="year-range-display">
              {formatYearRange() && (
                <div className="year-range">
                  <strong>Year Range:</strong> {formatYearRange()}
                </div>
              )}
            </div>

            <div className="emojis-display">
              <div className="emojis-container">
                <strong>Movie Hints:</strong>
                <div className="emojis-list">
                  {getTargetMovieEmojis().length > 0 ? (
                    getTargetMovieEmojis().map((emoji, index) => (
                      <span
                        key={index}
                        className={`emoji-item ${index < revealedEmojis ? 'revealed' : 'hidden'}`}
                      >
                        {index < revealedEmojis ? emoji : '?'}
                      </span>
                    ))
                  ) : (
                    <p>Emojis not available for this movie</p>
                  )}
                </div>
                {getTargetMovieEmojis().length > 0 && (
                  <p className="emoji-hint">One emoji revealed per guess ({revealedEmojis}/7)</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            placeholder="Enter movie name..."
            disabled={guesses.length >= 7 || gameWon || gameLost}
            className="movie-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions">
              {suggestions.map((movie, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleMovieSelect(movie)}
                >
                  {movie.name} ({movie.year})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="guesses-container">
          <h3>Your Guesses ({guesses.length}/7)</h3>
          <div className="guesses-list">
            {guesses.map((guess, index) => {
              const commonGenres = guess.genres.filter(genre => 
                targetMovie.genres.includes(genre)
              );
              const commonGenresCount = commonGenres.length;
              const isCorrect = guess.name === targetMovie.name;
              const yearComparison = 
                guess.year < targetMovie.year ? 'earlier' : 
                guess.year > targetMovie.year ? 'later' : 'same';

              return (
                <div key={index} className={`guess-item ${isCorrect ? 'correct' : ''}`}>
                  <div className="guess-header">
                    <span className="guess-number">{index + 1}.</span>
                    <span className="guess-name">{guess.name}</span>
                    <span className="guess-year">({guess.year})</span>
                    {isCorrect && <span className="correct-badge">✓</span>}
                  </div>
                  <div className="guess-details">
                    <div className="year-hint">
                      {yearComparison === 'earlier' && '⬆️ Earlier than target'}
                      {yearComparison === 'later' && '⬇️ Later than target'}
                      {yearComparison === 'same' && '🎯 Same year!'}
                    </div>
                    {gameMode === 'classic' && (
                      <div className="genre-hint">
                        <span className="genre-count">
                          Matching genres: {commonGenresCount} / {guess.genres.length}
                        </span>
                        {commonGenresCount > 0 && (
                          <div className="revealed-genres">
                            {commonGenres.map((genre, idx) => (
                              <span key={idx} className="genre-tag">{genre}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {guesses.length === 0 && (
          <div className="hint-box">
            <p>💡 Start guessing! Type a movie name to see suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

