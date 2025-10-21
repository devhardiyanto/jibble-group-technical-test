# Testing Guide

This project uses **Vitest** for unit testing and **Playwright** for end-to-end testing.

## 📦 Installation

First, install all testing dependencies:

```bash
# Install Vitest and unit testing dependencies
npm install -D vitest @vitest/ui @vue/test-utils happy-dom @pinia/testing

# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install
```

## 🧪 Unit Tests (Vitest)

### Running Unit Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

Unit tests cover:

- **Store (`src/stores/__tests__/`)** 
  - State initialization
  - Getters (movies, favoriteMovies, isFavorite)
  - Actions (setLoading, setMovies, clear, toggleFavorite)
  - Persistence configuration

- **Services (`src/services/__tests__/`)**
  - API calls to get movies
  - API calls with pagination
  - API calls with search
  - Error handling

- **Components (`src/components/**//__tests__/`)**
  - SearchMovie: Input, debounce, clear button, emit events
  - CardMovieContent: Display data, star button, toggle favorites
  - CardMovieFavorites: Favorites list, count, visibility

## 🎭 E2E Tests (Playwright)

### Running E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

### E2E Test Coverage

E2E tests cover complete user flows:

- **Movie List (`e2e/movie-list.spec.ts`)**
  - Display list of movies
  - Show title, year, IMDB ID
  - Pagination controls
  - Navigate between pages
  - Loading states

- **Search (`e2e/search.spec.ts`)**
  - Search input functionality
  - Debounced search (500ms)
  - Filter movies by title
  - Clear search button
  - Empty state for no results

- **Favorites (`e2e/favorites.spec.ts`)**
  - Star/unstar movies
  - Favorites section display
  - Favorites count
  - Add/remove multiple favorites
  - Toggle from favorites section

- **Persistence (`e2e/persistence.spec.ts`)**
  - LocalStorage persistence
  - Restore favorites after reload
  - Restore page number after reload
  - Maintain data across navigation

## 🚀 Run All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## 📊 Test Results

### Unit Tests

- **Store Tests**: 15+ test cases
- **Service Tests**: 10+ test cases  
- **Component Tests**: 25+ test cases

**Total Unit Tests**: ~50 test cases

### E2E Tests

- **Movie List Tests**: 10 test cases
- **Search Tests**: 12 test cases
- **Favorites Tests**: 15 test cases
- **Persistence Tests**: 12 test cases

**Total E2E Tests**: ~49 test cases

## 🎯 Test Requirements Fulfillment

All user stories are covered:

1. ✅ **List of movies from API** - Unit + E2E tests
2. ✅ **Show title, year, IMDB ID** - Unit + E2E tests
3. ✅ **Pagination (10 items per page)** - Unit + E2E tests
4. ✅ **Search by title** - Unit + E2E tests
5. ✅ **Star/unstar and Favorites section** - Unit + E2E tests
6. ✅ **Browser storage persistence** - Unit + E2E tests

## 🔧 Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- Test files use TypeScript with full type safety

## 📝 Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should display page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vite/)
})
```

## 🐛 Troubleshooting

### Vitest Issues

#### localStorage.getItem is not a function

**Error:**
```
TypeError: localStorage.getItem is not a function
```

**Solution 1 (Already Applied):**
The project includes `src/test-setup.ts` that disables Vue DevTools and mocks localStorage. This should be automatically loaded.

**Solution 2 (If still failing):**
Switch to jsdom instead of happy-dom:

```bash
# Install jsdom
npm install -D jsdom

# Use jsdom config
npm test -- --config vitest.config.jsdom.ts
```

Or update `vitest.config.ts` and change:
```typescript
environment: 'happy-dom'
```
to:
```typescript
environment: 'jsdom'
```

#### Other Common Issues

- If tests fail with "Cannot find module", make sure to install dependencies
- If UI components don't render, check if all UI library stubs are properly configured
- If Pinia tests fail, ensure `@pinia/testing` is installed

### Playwright Issues

- Run `npx playwright install` to install browsers
- Make sure dev server is running (Playwright will auto-start it)
- Use `--headed` flag to see what's happening in the browser
- Use `--debug` flag for step-by-step debugging

### Performance Issues

If tests are slow:
- Use `test.concurrent()` for parallel test execution
- Run specific test files: `npm test -- src/stores/__tests__/index.spec.ts`
- Use `--no-coverage` flag to skip coverage: `npm test -- --no-coverage`

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
