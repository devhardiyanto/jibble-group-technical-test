import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CardMovieFavorites from '../CardMovieFavorites.vue'
import { useMovieStore } from '@/stores/index'
import type { Movie } from '@/types/movie'

describe('CardMovieFavorites', () => {
  const mockMovies: Movie[] = [
    { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
    { Title: 'Spiderman 2', Year: 2004, imdbID: 'tt0316654' },
    { Title: 'Spiderman 3', Year: 2007, imdbID: 'tt0413300' },
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should not render when no favorites', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = []

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('should render when favorites exist', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.find('h2').exists()).toBe(true)
  })

  it('should display favorites count in header', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487', 'tt0316654']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Favorites (2)')
  })

  it('should display correct count for single favorite', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Favorites (1)')
  })

  it('should display star icon in header', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    const starIcon = wrapper.find('svg')
    expect(starIcon.exists()).toBe(true)
    expect(starIcon.classes()).toContain('fill-yellow-400')
    expect(starIcon.classes()).toContain('text-yellow-400')
  })

  it('should render CardMovieContent for each favorite movie', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487', 'tt0316654']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub" :data-imdb="movie.imdbID">{{ movie.Title }}</div>',
            props: ['movie'],
          },
        },
      },
    })

    const movieCards = wrapper.findAll('.movie-card-stub')
    expect(movieCards).toHaveLength(2)
  })

  it('should only render favorited movies', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487', 'tt0413300'] // Only first and third

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">{{ movie.Title }}</div>',
            props: ['movie'],
          },
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('Spiderman')
    expect(text).not.toContain('Spiderman 2')
    expect(text).toContain('Spiderman 3')
  })

  it('should update when favorites change', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Favorites (1)')

    // Add another favorite
    store.favorites.push('tt0316654')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Favorites (2)')
  })

  it('should hide when all favorites are removed', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    expect(wrapper.find('h2').exists()).toBe(true)

    // Remove all favorites
    store.favorites = []
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('should have sticky positioning classes', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('sticky')
    expect(container.classes()).toContain('top-0')
  })

  it('should use grid layout for movie cards', () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.data = mockMovies
    store.favorites = ['tt0145487', 'tt0316654']

    const wrapper = mount(CardMovieFavorites, {
      global: {
        plugins: [pinia],
        stubs: {
          CardMovieContent: {
            template: '<div class="movie-card-stub">Movie Card</div>',
            props: ['movie'],
          },
        },
      },
    })

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('gap-4')
  })
})
