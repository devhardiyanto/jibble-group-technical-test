import { test, expect } from '@playwright/test'

test.describe('Favorites Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    // Wait for movies to load
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
  })

  test('should display star button on each movie card', async ({ page }) => {
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') })
    
    await expect(starButton).toBeVisible()
  })

  test('should add movie to favorites when star is clicked', async ({ page }) => {
    // Initially no favorites section
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).not.toBeVisible()
    
    // Click star on first movie
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    
    // Wait a bit for state update
    await page.waitForTimeout(300)
    
    // Favorites section should appear
    await expect(favoritesSection).toBeVisible()
  })

  test('should display favorites count in header', async ({ page }) => {
    // Add first movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Check favorites count
    const favoritesHeader = page.locator('h2').filter({ hasText: /Favorites.*\(1\)/ })
    await expect(favoritesHeader).toBeVisible()
  })

  test('should show filled star for favorited movies', async ({ page }) => {
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    
    // Click to favorite
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Star should be filled (yellow)
    const starIcon = starButton.locator('svg').first()
    const classes = await starIcon.getAttribute('class')
    expect(classes).toContain('fill-yellow-400')
    expect(classes).toContain('text-yellow-400')
  })

  test('should remove movie from favorites when star is clicked again', async ({ page }) => {
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    
    // Add to favorites
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Favorites section should be visible
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).toBeVisible()
    
    // Click again to unfavorite
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Favorites section should disappear
    await expect(favoritesSection).not.toBeVisible()
  })

  test('should display favorited movies in favorites section', async ({ page }) => {
    // Get first movie details
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const movieTitle = await firstMovie.locator('h3, [class*="card-title"]').first().textContent()
    
    // Add to favorites
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Check if movie appears in favorites section
    const favoritesSection = page.locator('div').filter({ has: page.locator('h2', { hasText: /Favorites/ }) }).first()
    await expect(favoritesSection).toContainText(movieTitle || '')
  })

  test('should favorite multiple movies', async ({ page }) => {
    // Get first 3 movie cards
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    
    // Favorite first 3 movies
    for (let i = 0; i < 3; i++) {
      const movie = movieCards.nth(i)
      const starButton = movie.getByRole('button').filter({ has: page.locator('svg') }).first()
      await starButton.click()
      await page.waitForTimeout(200)
    }
    
    // Check favorites count
    const favoritesHeader = page.locator('h2').filter({ hasText: /Favorites.*\(3\)/ })
    await expect(favoritesHeader).toBeVisible()
  })

  test('should persist favorites in localStorage', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(500)
    
    // Check localStorage
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage).toBeTruthy()
    expect(storage.favorites).toBeDefined()
    expect(storage.favorites.length).toBeGreaterThan(0)
  })

  test('should restore favorites from localStorage after page reload', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const movieTitle = await firstMovie.locator('h3, [class*="card-title"]').first().textContent()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(500)
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
    
    // Favorites section should still be visible
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).toBeVisible()
    
    // Movie should still be in favorites
    const favoritesArea = page.locator('div').filter({ has: page.locator('h2', { hasText: /Favorites/ }) }).first()
    await expect(favoritesArea).toContainText(movieTitle || '')
  })

  test('should maintain favorites when navigating between pages', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Navigate to next page
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Favorites section should still be visible
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).toBeVisible()
  })

  test('should maintain favorites when searching', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Search for something
    const searchInput = page.getByPlaceholder('Search movies...')
    await searchInput.fill('batman')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Favorites section should still be visible
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).toBeVisible()
  })

  test('should update favorites section immediately after starring', async ({ page }) => {
    // Initially no favorites
    let favoritesHeader = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesHeader).not.toBeVisible()
    
    // Add first movie
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    let starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Should show count (1)
    favoritesHeader = page.locator('h2').filter({ hasText: /Favorites.*\(1\)/ })
    await expect(favoritesHeader).toBeVisible()
    
    // Add second movie
    const secondMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).nth(1)
    starButton = secondMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Should update to count (2)
    favoritesHeader = page.locator('h2').filter({ hasText: /Favorites.*\(2\)/ })
    await expect(favoritesHeader).toBeVisible()
  })

  test('should toggle favorite from favorites section', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Find the same movie in favorites section and unfavorite it
    const favoritesArea = page.locator('div').filter({ has: page.locator('h2', { hasText: /Favorites/ }) }).first()
    const favoriteMovieCard = favoritesArea.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const favoriteStarButton = favoriteMovieCard.getByRole('button').filter({ has: page.locator('svg') }).first()
    await favoriteStarButton.click()
    await page.waitForTimeout(300)
    
    // Favorites section should disappear
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).not.toBeVisible()
  })

  test('should show yellow filled star icon in favorites header', async ({ page }) => {
    // Add movie to favorites
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Check for yellow star icon in header
    const favoritesHeader = page.locator('div').filter({ has: page.locator('h2', { hasText: /Favorites/ }) }).first()
    const headerStar = favoritesHeader.locator('svg').first()
    
    await expect(headerStar).toBeVisible()
    const classes = await headerStar.getAttribute('class')
    expect(classes).toContain('fill-yellow-400')
  })
})
