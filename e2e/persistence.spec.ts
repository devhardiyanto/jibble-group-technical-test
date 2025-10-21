import { test, expect } from '@playwright/test'

test.describe('LocalStorage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
  })

  test('should persist current page number', async ({ page }) => {
    // Navigate to page 2
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Check localStorage
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage).toBeTruthy()
    expect(storage.page).toBe(2)
  })

  test('should restore page number after reload', async ({ page }) => {
    // Navigate to page 2
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Get first movie on page 2
    const movieOnPage2 = await page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first().textContent()
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
    
    // Should still be on page 2
    const movieAfterReload = await page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first().textContent()
    expect(movieAfterReload).toBe(movieOnPage2)
  })

  test('should persist movie data', async ({ page }) => {
    // Wait for movies to load
    await page.waitForTimeout(500)
    
    // Check if movie data is in localStorage
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage).toBeTruthy()
    expect(storage.data).toBeDefined()
    expect(Array.isArray(storage.data)).toBe(true)
    expect(storage.data.length).toBeGreaterThan(0)
  })

  test('should persist pagination metadata', async ({ page }) => {
    await page.waitForTimeout(500)
    
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage).toBeTruthy()
    expect(storage.page).toBeDefined()
    expect(storage.per_page).toBeDefined()
    expect(storage.total).toBeDefined()
    expect(storage.total_pages).toBeDefined()
    
    expect(typeof storage.page).toBe('number')
    expect(typeof storage.per_page).toBe('number')
    expect(typeof storage.total).toBe('number')
    expect(typeof storage.total_pages).toBe('number')
  })

  test('should persist favorites array', async ({ page }) => {
    // Add a movie to favorites
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
    expect(Array.isArray(storage.favorites)).toBe(true)
    expect(storage.favorites.length).toBe(1)
    expect(storage.favorites[0]).toMatch(/^tt\d+/)
  })

  test('should restore multiple favorites after reload', async ({ page }) => {
    // Add 3 movies to favorites
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    
    for (let i = 0; i < 3; i++) {
      const movie = movieCards.nth(i)
      const starButton = movie.getByRole('button').filter({ has: page.locator('svg') }).first()
      await starButton.click()
      await page.waitForTimeout(200)
    }
    
    await page.waitForTimeout(500)
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
    
    // Check if 3 favorites are restored
    const favoritesHeader = page.locator('h2').filter({ hasText: /Favorites.*\(3\)/ })
    await expect(favoritesHeader).toBeVisible()
  })

  test('should use correct localStorage key', async ({ page }) => {
    await page.waitForTimeout(500)
    
    const hasKey = await page.evaluate(() => {
      return localStorage.getItem('movie') !== null
    })
    
    expect(hasKey).toBe(true)
  })

  test('should maintain data across navigation', async ({ page }) => {
    // Get initial data
    const initialStorage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    // Navigate to page 2
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Get updated data
    const updatedStorage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    // Page should be updated
    expect(updatedStorage.page).not.toBe(initialStorage.page)
    
    // But other fields should still exist
    expect(updatedStorage.data).toBeDefined()
    expect(updatedStorage.favorites).toBeDefined()
  })

  test('should maintain data across search', async ({ page }) => {
    // Add a favorite first
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    // Search
    const searchInput = page.getByPlaceholder('Search movies...')
    await searchInput.fill('batman')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')
    
    // Check localStorage still has favorites
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage.favorites).toBeDefined()
    expect(storage.favorites.length).toBe(1)
  })

  test('should restore data structure after multiple reloads', async ({ page }) => {
    // Add favorites and navigate
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(300)
    
    const nextButton = page.getByRole('button', { name: /next|›|→|>/i }).first()
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Reload multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload()
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
      await page.waitForTimeout(300)
    }
    
    // Check data structure is still intact
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('movie')
      return data ? JSON.parse(data) : null
    })
    
    expect(storage).toBeTruthy()
    expect(storage.favorites).toBeDefined()
    expect(storage.data).toBeDefined()
    expect(storage.page).toBeDefined()
    expect(Array.isArray(storage.favorites)).toBe(true)
    expect(Array.isArray(storage.data)).toBe(true)
  })

  test('should handle localStorage being cleared externally', async ({ page }) => {
    // Add some data
    const firstMovie = page.locator('[role="region"]').filter({ hasText: /ID: tt/ }).first()
    const starButton = firstMovie.getByRole('button').filter({ has: page.locator('svg') }).first()
    await starButton.click()
    await page.waitForTimeout(500)
    
    // Clear localStorage
    await page.evaluate(() => localStorage.clear())
    
    // Reload
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[class*="skeleton"]', { state: 'detached', timeout: 10000 })
    
    // App should still work (start fresh)
    const movieCards = page.locator('[role="region"]').filter({ hasText: /ID: tt/ })
    await expect(movieCards.first()).toBeVisible()
    
    // No favorites section
    const favoritesSection = page.locator('h2').filter({ hasText: /Favorites/ })
    await expect(favoritesSection).not.toBeVisible()
  })
})
