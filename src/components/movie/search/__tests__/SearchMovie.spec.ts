import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchMovie from '../SearchMovie.vue'

describe('SearchMovie', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should render search input with placeholder', () => {
    const wrapper = mount(SearchMovie)
    const input = wrapper.find('input[type="text"]')
    
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search movies...')
  })

  it('should bind v-model correctly', async () => {
    const wrapper = mount(SearchMovie)
    const input = wrapper.find('input[type="text"]')
    
    await input.setValue('Spiderman')
    expect((input.element as HTMLInputElement).value).toBe('Spiderman')
  })

  it('should emit search event after debounce delay', async () => {
    const wrapper = mount(SearchMovie)
    await nextTick() // Wait for mount
    const input = wrapper.find('input[type="text"]')
    
    await input.setValue('Batman')
    await nextTick()
    
    // Should not emit immediately
    expect(wrapper.emitted('search')).toBeUndefined()
    
    // Run all timers including debounce
    await vi.runAllTimersAsync()
    await flushPromises()
    
    // Should emit now
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]).toEqual(['Batman'])
  })

  it('should trim whitespace before emitting', async () => {
    const wrapper = mount(SearchMovie)
    await nextTick() // Wait for mount
    const input = wrapper.find('input[type="text"]')
    
    await input.setValue('  Spiderman  ')
    await nextTick()
    
    // Run all timers
    await vi.runAllTimersAsync()
    await flushPromises()
    
    expect(wrapper.emitted('search')?.[0]).toEqual(['Spiderman'])
  })

  it('should debounce multiple rapid inputs', async () => {
    const wrapper = mount(SearchMovie)
    await nextTick() // Wait for mount
    const input = wrapper.find('input[type="text"]')
    
    // Type multiple times rapidly (each resets the debounce timer)
    await input.setValue('B')
    await nextTick()
    
    await input.setValue('Ba')
    await nextTick()
    
    await input.setValue('Bat')
    await nextTick()
    
    await input.setValue('Batm')
    await nextTick()
    
    await input.setValue('Batman')
    await nextTick()
    
    // Run all timers to complete debounce
    await vi.runAllTimersAsync()
    await flushPromises()
    
    // Should emit with final value
    const emissions = wrapper.emitted('search') || []
    expect(emissions.length).toBeGreaterThan(0)
    expect(emissions[emissions.length - 1]).toEqual(['Batman'])
  })

  it('should show clear button when input has value', async () => {
    const wrapper = mount(SearchMovie)
    const input = wrapper.find('input[type="text"]')
    
    // Initially no clear button
    let clearButton = wrapper.find('[aria-label="Clear search"]')
    expect(clearButton.exists()).toBe(false)
    
    // After typing, clear button should appear
    await input.setValue('Spiderman')
    await nextTick()
    
    clearButton = wrapper.find('[aria-label="Clear search"]')
    expect(clearButton.exists()).toBe(true)
  })

  it('should clear input when clear button is clicked', async () => {
    const wrapper = mount(SearchMovie)
    const input = wrapper.find('input[type="text"]')
    
    await input.setValue('Spiderman')
    await nextTick()
    
    const clearButton = wrapper.find('[aria-label="Clear search"]')
    await clearButton.trigger('click')
    
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('should emit empty string after clearing', async () => {
    const wrapper = mount(SearchMovie)
    await nextTick() // Wait for mount
    const input = wrapper.find('input[type="text"]')
    
    await input.setValue('Spiderman')
    await nextTick()
    
    // Wait for first emit
    await vi.runAllTimersAsync()
    await flushPromises()
    
    // Clear the search
    const clearButton = wrapper.find('[aria-label="Clear search"]')
    await clearButton.trigger('click')
    await nextTick()
    
    // Wait for second emit (empty string)
    await vi.runAllTimersAsync()
    await flushPromises()
    
    // Should emit empty string
    const emitted = wrapper.emitted('search')
    expect(emitted?.[emitted.length - 1]).toEqual([''])
  })

  it('should render search icon', () => {
    const wrapper = mount(SearchMovie)
    const searchIcon = wrapper.find('svg circle')
    
    expect(searchIcon.exists()).toBe(true)
  })
})
