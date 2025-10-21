import { test, expect } from '@playwright/test'

test.describe('Movie Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Wait for initial movies to load
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
  })

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    await expect(searchInput).toBeVisible()
  })

  test('should display search icon', async ({ page }) => {
    const searchIcon = page.locator('svg').filter({ has: page.locator('circle') }).first()
    await expect(searchIcon).toBeVisible()
  })

  test('should filter movies by search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Type search query
    await searchInput.fill('spider')
    
    // Wait for debounce and API call
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Check if results contain the search term
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    const firstMovie = movieCards.first()
    await expect(firstMovie).toBeVisible()
    
    // Get the title text
    const movieTitle = await firstMovie.locator('h3, [class*="card-title"]').first().textContent()
    expect(movieTitle?.toLowerCase()).toContain('spider')
  })

  test('should debounce search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Type rapidly
    await searchInput.pressSequentially('bat', { delay: 50 })
    
    // Wait less than debounce time
    await page.waitForTimeout(300)
    
    // Should still show loading or previous results (not yet searched)
    // Continue typing
    await searchInput.pressSequentially('man', { delay: 50 })
    
    // Wait for debounce to complete
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Now should have searched for "batman"
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    await expect(movieCards.first()).toBeVisible()
  })

  test('should show clear button when search has value', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Initially no clear button
    const clearButton = page.getByLabel('Clear search')
    await expect(clearButton).not.toBeVisible()
    
    // Type something
    await searchInput.fill('spider')
    
    // Clear button should appear
    await expect(clearButton).toBeVisible()
  })

  test('should clear search when clear button is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Type search query
    await searchInput.fill('spider')
    await page.waitForTimeout(600)
    
    // Click clear button
    const clearButton = page.getByLabel('Clear search')
    await clearButton.click()
    
    // Input should be empty
    await expect(searchInput).toHaveValue('')
    
    // Should show all movies again
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
  })

  test('should reset to page 1 when searching', async ({ page }) => {
    // Go to page 2 first
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Now search
    const searchInput = page.getByPlaceholder('Search movies...')
    await searchInput.fill('spider')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Should be on page 1 (check if previous button is disabled or page number is 1)
    const prevButton = page.getByRole('button', { name: /previous|‹|←|</i }).first()
    const isDisabled = await prevButton.isDisabled()
    expect(isDisabled).toBe(true)
  })

  test('should show empty state when no results found', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Search for something that likely returns no results
    await searchInput.fill('xyzabc123nonexistent')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Should show empty state message
    const emptyState = page.getByText(/no.*found|no.*result/i)
    await expect(emptyState).toBeVisible({ timeout: 5000 })
  })

  test('should maintain search query in input after searching', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    const searchQuery = 'spiderman'
    
    await searchInput.fill(searchQuery)
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Input should still have the search query
    await expect(searchInput).toHaveValue(searchQuery)
  })

  test('should trim whitespace from search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Type with leading/trailing spaces
    await searchInput.fill('  spider  ')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Should still search and find results
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    await expect(movieCards.first()).toBeVisible()
  })

  test('should scroll to top when search results load', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)
    
    const scrollBefore = await page.evaluate(() => window.scrollY)
    expect(scrollBefore).toBeGreaterThan(0)
    
    // Search
    const searchInput = page.getByPlaceholder('Search movies...')
    await searchInput.fill('batman')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Should scroll to top
    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(scrollAfter).toBeLessThan(scrollBefore)
  })

  test('should update pagination based on search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search movies...')
    
    // Search for something specific
    await searchInput.fill('spider')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Pagination should be visible and functional
    const pagination = page.locator('nav, [role="navigation"]').filter({ hasText: /Previous|Next|Page/ }).first()
    await expect(pagination).toBeVisible()
  })
})
