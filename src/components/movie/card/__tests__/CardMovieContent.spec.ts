import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CardMovieContent from '../CardMovieContent.vue'
import { useMovieStore } from '@/stores/index'
import type { Movie } from '@/types/movie'

describe('CardMovieContent', () => {
  const mockMovie: Movie = {
    Title: 'Spiderman',
    Year: 2002,
    imdbID: 'tt0145487',
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render movie title', () => {
    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('Spiderman')
  })

  it('should render movie year', () => {
    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('2002')
  })

  it('should render IMDB ID', () => {
    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('tt0145487')
  })

  it('should render star button', () => {
    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    const button = wrapper.find('button[aria-label*="favorites"]')
    expect(button.exists()).toBe(true)
  })

  it('should show unfilled star when movie is not favorited', () => {
    const pinia = createPinia()
    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [pinia],
      },
    })

    const store = useMovieStore(pinia)
    expect(store.isFavorite(mockMovie.imdbID)).toBe(false)

    const starIcon = wrapper.find('svg')
    expect(starIcon.classes()).not.toContain('fill-yellow-400')
    expect(starIcon.classes()).toContain('text-muted-foreground')
  })

  it('should show filled star when movie is favorited', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.favorites = [mockMovie.imdbID]

    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [pinia],
      },
    })

    expect(store.isFavorite(mockMovie.imdbID)).toBe(true)

    const starIcon = wrapper.find('svg')
    expect(starIcon.classes()).toContain('fill-yellow-400')
    expect(starIcon.classes()).toContain('text-yellow-400')
  })

  it('should toggle favorite when star button is clicked', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)

    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [pinia],
      },
    })

    expect(store.favorites).not.toContain(mockMovie.imdbID)

    const button = wrapper.find('button[aria-label*="favorites"]')
    await button.trigger('click')

    expect(store.favorites).toContain(mockMovie.imdbID)
  })

  it('should unfavorite when clicking star on favorited movie', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)
    store.favorites = [mockMovie.imdbID]

    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [pinia],
      },
    })

    expect(store.favorites).toContain(mockMovie.imdbID)

    const button = wrapper.find('button[aria-label*="favorites"]')
    await button.trigger('click')

    expect(store.favorites).not.toContain(mockMovie.imdbID)
  })

  it('should update aria-label based on favorite status', async () => {
    const pinia = createPinia()
    const store = useMovieStore(pinia)

    const wrapper = mount(CardMovieContent, {
      props: { movie: mockMovie },
      global: {
        plugins: [pinia],
      },
    })

    let button = wrapper.find('button[aria-label*="favorites"]')
    expect(button.attributes('aria-label')).toBe('Add to favorites')

    // Toggle favorite
    store.toggleFavorite(mockMovie.imdbID)
    await wrapper.vm.$nextTick()

    button = wrapper.find('button[aria-label*="favorites"]')
    expect(button.attributes('aria-label')).toBe('Remove from favorites')
  })

  it('should display full title in tooltip', () => {
    const longTitleMovie: Movie = {
      Title: 'The Amazing Spiderman: A Very Long Title That Should Be Truncated',
      Year: 2012,
      imdbID: 'tt0948470',
    }

    const wrapper = mount(CardMovieContent, {
      props: { movie: longTitleMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain(longTitleMovie.Title)
  })

  it('should accept different movie props', () => {
    const differentMovie: Movie = {
      Title: 'Batman',
      Year: 1989,
      imdbID: 'tt0096895',
    }

    const wrapper = mount(CardMovieContent, {
      props: { movie: differentMovie },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('Batman')
    expect(wrapper.text()).toContain('1989')
    expect(wrapper.text()).toContain('tt0096895')
  })
})
