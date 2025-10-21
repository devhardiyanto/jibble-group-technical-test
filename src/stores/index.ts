import { defineStore } from "pinia";
import type { Movie } from "@/types/movie";
import type { MovieResponse } from "@/types/api";

interface MovieStore extends MovieResponse<Movie> {
  loading: boolean;
  favorites: string[]; // Array of imdbID
}

const defaultMovieResponse: MovieResponse<Movie> = {
  page: 0,
  per_page: 0,
  total: 0,
  total_pages: 0,
  data: []
}

export const useMovieStore = defineStore("movie", {
  state: (): MovieStore => ({ 
    ...defaultMovieResponse, 
    loading: true,
    favorites: []
  }),
  getters: {
    movies: (s) => s.data,
    favoriteMovies: (s) => s.data.filter(movie => s.favorites.includes(movie.imdbID)),
    isFavorite: (s) => (imdbID: string) => s.favorites.includes(imdbID),
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setMovies(movies: MovieResponse<Movie>) {
      this.data = movies.data;
      this.page = movies.page;
      this.per_page = movies.per_page;
      this.total = movies.total;
      this.total_pages = movies.total_pages;
    },
    clear() {
      this.data = defaultMovieResponse.data;
      this.page = defaultMovieResponse.page;
      this.per_page = defaultMovieResponse.per_page;
      this.total = defaultMovieResponse.total;
      this.total_pages = defaultMovieResponse.total_pages;
    },
    toggleFavorite(imdbID: string) {
      const index = this.favorites.indexOf(imdbID);
      if (index === -1) {
        this.favorites.push(imdbID);
      } else {
        this.favorites.splice(index, 1);
      }
    },
  },
  persist: {
    key: 'movie',
    pick: ['page', 'per_page', 'total', 'total_pages', 'data', 'favorites'],
  },
});
