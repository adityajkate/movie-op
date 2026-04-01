const API_BASE_URL = 'http://localhost:5000/api';

// State management
const state = {
  currentView: 'popular',
  searchQuery: '',
  movies: [],
  selectedMovie: null
};

// DOM elements
const elements = {
  searchInput: null,
  sectionTitle: null,
  loadingState: null,
  errorState: null,
  moviesGrid: null,
  movieModal: null,
  modalBody: null,
  modalOverlay: null,
  modalClose: null,
  retryButton: null
};

// IntersectionObserver for advanced lazy loading
let imageObserver = null;

function initImageObserver() {
  if ('IntersectionObserver' in window) {
    imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }
}

// Utility: Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// API calls
async function fetchPopularMovies() {
  const response = await fetch(`${API_BASE_URL}/movies/popular`);
  if (!response.ok) throw new Error('Failed to fetch popular movies');
  const json = await response.json();
  return json.data || json; // Handle wrapped response
}

async function searchMovies(query) {
  const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search movies');
  const json = await response.json();
  return json.data || json; // Handle wrapped response
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
  if (!response.ok) throw new Error('Failed to fetch movie details');
  const json = await response.json();
  return json.data || json; // Handle wrapped response
}

// UI State handlers
function showLoading() {
  elements.loadingState.removeAttribute('hidden');
  elements.errorState.setAttribute('hidden', '');
  elements.moviesGrid.innerHTML = '';
}

function hideLoading() {
  elements.loadingState.setAttribute('hidden', '');
}

function showError(message) {
  hideLoading();
  elements.errorState.removeAttribute('hidden');
  elements.errorState.querySelector('.error-message').textContent = message;
}

function hideError() {
  elements.errorState.setAttribute('hidden', '');
}

// Movie card creation
function createMovieCard(movie) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${movie.title}`);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  // Create elements directly instead of innerHTML for better performance
  if (posterUrl) {
    const img = document.createElement('img');
    img.alt = `${movie.title} poster`;
    img.className = 'movie-poster';
    img.loading = 'lazy';
    img.decoding = 'async';

    // Use IntersectionObserver if available, otherwise fallback to native lazy loading
    if (imageObserver) {
      img.dataset.src = posterUrl;
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 513"%3E%3C/svg%3E';
      imageObserver.observe(img);
    } else {
      img.src = posterUrl;
    }

    card.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'movie-poster placeholder';
    placeholder.textContent = 'No Image';
    card.appendChild(placeholder);
  }

  const movieInfo = document.createElement('div');
  movieInfo.className = 'movie-info';

  const title = document.createElement('h3');
  title.className = 'movie-title';
  title.textContent = movie.title;

  const meta = document.createElement('div');
  meta.className = 'movie-meta';

  const rating = document.createElement('span');
  rating.className = 'movie-rating';
  rating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const year = document.createElement('span');
  year.className = 'movie-year';
  year.textContent = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  meta.appendChild(rating);
  meta.appendChild(year);
  movieInfo.appendChild(title);
  movieInfo.appendChild(meta);
  card.appendChild(movieInfo);

  card.addEventListener('click', () => openMovieModal(movie.id));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMovieModal(movie.id);
    }
  });

  return card;
}

// Render movies grid
function renderMovies(movies) {
  hideLoading();
  hideError();

  // Batch DOM updates to prevent layout thrashing
  const currentGrid = elements.moviesGrid;
  currentGrid.style.display = 'none';
  currentGrid.innerHTML = '';

  if (movies.length === 0) {
    currentGrid.innerHTML = `
      <div class="empty-state">
        <p>No movies found</p>
      </div>
    `;
    currentGrid.style.display = '';
    return;
  }

  const fragment = document.createDocumentFragment();
  movies.forEach(movie => {
    fragment.appendChild(createMovieCard(movie));
  });
  currentGrid.appendChild(fragment);
  currentGrid.style.display = '';
}

// Load popular movies
async function loadPopularMovies() {
  try {
    console.log('loadPopularMovies: starting...');
    showLoading();
    state.currentView = 'popular';
    state.searchQuery = '';
    elements.sectionTitle.textContent = 'Popular Movies';

    console.log('Fetching popular movies from API...');
    const data = await fetchPopularMovies();
    console.log('API response:', data);
    state.movies = data.results || [];
    console.log('Movies to render:', state.movies.length);
    renderMovies(state.movies);
    console.log('Movies rendered successfully');
  } catch (error) {
    console.error('Error loading popular movies:', error);
    showError('Failed to load popular movies. Please try again.');
  }
}

// Handle search
async function handleSearch(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    loadPopularMovies();
    return;
  }

  try {
    showLoading();
    state.currentView = 'search';
    state.searchQuery = trimmedQuery;
    elements.sectionTitle.textContent = `Search Results for "${trimmedQuery}"`;

    const data = await searchMovies(trimmedQuery);
    state.movies = data.results || [];
    renderMovies(state.movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    showError('Failed to search movies. Please try again.');
  }
}

// Modal: Open
async function openMovieModal(movieId) {
  try {
    // Batch DOM updates to prevent layout thrashing
    elements.modalBody.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading details...</p></div>';
    elements.movieModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    const movie = await fetchMovieDetails(movieId);
    state.selectedMovie = movie;
    renderMovieModal(movie);
  } catch (error) {
    console.error('Error loading movie details:', error);
    elements.modalBody.innerHTML = '<div class="error-state"><p class="error-message">Failed to load movie details</p></div>';
  }
}

// Modal: Render
function renderMovieModal(movie) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  const genres = movie.genres && movie.genres.length > 0
    ? movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('')
    : '<span class="genre-tag">N/A</span>';

  elements.modalBody.innerHTML = `
    <div class="modal-header">
      ${backdropUrl ? `<img src="${backdropUrl}" alt="${movie.title} backdrop" class="modal-backdrop" loading="lazy" decoding="async">` : ''}
      <h2 id="modalTitle" class="modal-title">${movie.title}</h2>
      <div class="modal-meta">
        <span class="modal-rating">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        <span>${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
        <span>${movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
      </div>
    </div>

    <div class="modal-section">
      <h3>Genres</h3>
      <div class="genres-list">${genres}</div>
    </div>

    ${movie.overview ? `
      <div class="modal-section">
        <h3>Overview</h3>
        <p>${movie.overview}</p>
      </div>
    ` : ''}

    ${movie.tagline ? `
      <div class="modal-section">
        <h3>Tagline</h3>
        <p><em>"${movie.tagline}"</em></p>
      </div>
    ` : ''}
  `;
}

// Modal: Close
function closeMovieModal() {
  elements.movieModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  state.selectedMovie = null;
}

// Event listeners setup
function setupEventListeners() {
  // Search input with debounce
  const debouncedSearch = debounce((query) => handleSearch(query), 500);
  elements.searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Retry button
  elements.retryButton.addEventListener('click', () => {
    if (state.searchQuery) {
      handleSearch(state.searchQuery);
    } else {
      loadPopularMovies();
    }
  });

  // Modal close handlers
  elements.modalClose.addEventListener('click', closeMovieModal);
  elements.modalOverlay.addEventListener('click', closeMovieModal);

  // Keyboard navigation for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.movieModal.hasAttribute('hidden')) {
      closeMovieModal();
    }
  });
}

// Initialize app
async function initApp() {
  console.log('initApp called');

  // Cache DOM elements
  elements.searchInput = document.getElementById('searchInput');
  elements.sectionTitle = document.getElementById('sectionTitle');
  elements.loadingState = document.getElementById('loadingState');
  elements.errorState = document.getElementById('errorState');
  elements.moviesGrid = document.getElementById('moviesGrid');
  elements.movieModal = document.getElementById('movieModal');
  elements.modalBody = document.getElementById('modalBody');
  elements.modalOverlay = elements.movieModal.querySelector('.modal-overlay');
  elements.modalClose = elements.movieModal.querySelector('.modal-close');
  elements.retryButton = elements.errorState.querySelector('.retry-button');

  console.log('DOM elements cached:', elements);

  // Initialize IntersectionObserver for lazy loading
  initImageObserver();

  // Setup event listeners
  setupEventListeners();

  // Load initial content
  console.log('Loading popular movies...');
  await loadPopularMovies();
}

// Start the app when DOM is ready
console.log('Script loaded');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, initializing app...');
  initApp();
});
