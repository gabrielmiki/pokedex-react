# Pokedex

A mobile Pokedex app built with React Native and Expo, powered by the [PokeAPI](https://pokeapi.co/).

## Features

- Browse the first 250 Pokemon across 5 pages (50 per page)
- Grid layout with type-colored cards and animated bobbing sprites (front and back)
- Search by Pokemon name or type
- Tap any card to view a detail screen with stats, height, weight, and a stat bar chart
- Runs on Android, iOS, and web

## Screenshots

| Pokedex Grid | Type Search | Name Search | Pokemon Details |
|---|---|---|---|
| ![Home screen with search and pagination](images/home_screen.png) | ![Type Searching](images/type_search.png) | ![Name Searching](images/name_search.png) | ![Detail view with base stats](images/detail_screen.png) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npx expo start
```

Then open the app in one of:

- [Expo Go](https://expo.dev/go) (scan the QR code)
- Android emulator (`npx expo start --android`)
- iOS simulator (`npx expo start --ios`)
- Browser (`npx expo start --web`)

## Project Structure

```
app/
  _layout.tsx   # Stack navigator with Pokedex and Pokemon Details screens
  index.tsx     # Home screen — grid list, search, pagination
  details.tsx   # Detail screen — stats, height, weight
```

## Tech Stack

| Library | Purpose |
|---|---|
| React Native | Core UI framework |
| Expo | Build tooling and native APIs |
| Expo Router | File-based navigation |
| PokeAPI | Pokemon data source |

## API

Data is fetched from the public [PokeAPI](https://pokeapi.co/) — no API key required.

- `GET /api/v2/pokemon?limit=50&offset=N` — paginated list
- `GET /api/v2/pokemon/{id}` — individual Pokemon details
