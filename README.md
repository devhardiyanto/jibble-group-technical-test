# Movie Browser App

A modern movie browsing application built with Vue 3, TypeScript, and Vite. Features movie search, pagination, and favorites with persistent storage.

## ✨ Features

- 📋 Browse movies from API with pagination (10 items per page)
- 🔍 Search movies by title with debounced input
- ⭐ Star/unstar movies and manage favorites
- 💾 Persistent favorites using localStorage
- 🎨 Modern UI with Tailwind CSS and shadcn-vue
- 🌓 Dark mode support
- ♿ Accessible components
- ✅ Comprehensive test coverage

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

This project includes comprehensive unit tests (Vitest) and E2E tests (Playwright).

### Run All Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests with UI
npm run test:ui

# E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

For detailed testing documentation, see [TESTING.md](./TESTING.md).

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-vue (Radix UI for Vue)
- **State Management**: Pinia with persistence
- **HTTP Client**: Axios
- **Icons**: Lucide Vue
- **Testing**: Vitest + Playwright

## 📦 Project Structure

```
├── src/
│   ├── components/
│   │   ├── movie/          # Movie-related components
│   │   └── ui/             # UI components
│   ├── services/           # API services
│   ├── stores/             # Pinia stores
│   ├── types/              # TypeScript types
│   └── views/              # Page views
├── e2e/                    # E2E tests
├── vitest.config.ts        # Vitest configuration
└── playwright.config.ts    # Playwright configuration
```

## 🎯 User Stories Implemented

1. ✅ Display list of movies from API
2. ✅ Show movie title, year, and IMDB ID
3. ✅ Browse with pagination (10 items per page)
4. ✅ Search movies by title
5. ✅ Star/unstar movies with Favorites section
6. ✅ Persist data in browser storage
7. ✅ Automated unit and E2E tests

## 📄 License

MIT

## 🔗 Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
