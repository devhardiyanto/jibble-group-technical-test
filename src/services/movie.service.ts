import client from '@/lib/client'
import type { Movie } from '@/types/movie'
import type { MovieResponse } from '@/types/api'

export const movieService = {
  async getMovies(params?: { page?: number; search?: string }): Promise<MovieResponse<Movie>> {
    const { data } = await client.get('/movies', { params })
    return data
  },

  async getMovieById(id: string): Promise<Movie> {
    const { data } = await client.get(`/movies/${id}`)
    return data
  }
}