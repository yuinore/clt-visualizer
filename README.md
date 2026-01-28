# Visualization of Central Limit Theorem for Impulse Responses

A web application for visualizing the Central Limit Theorem (CLT) through the convolution of probability distributions and impulse responses.

## Features

- **Multiple Distribution Types**: Support for various probability distributions and filter impulse responses
  - Probability distributions: Coin, Dice, Loaded Dice, Binomial, Normal, Uniform, Bernoulli, Poisson, Zeta, Degenerate, Lattice
  - Filter impulse responses: FIR Low-pass, IIR Low-pass, Difference Filter, Central Difference Filter, Custom FIR
- **Interactive Visualization**:
  - Adjustable convolution count (1-10 times)
  - Real-time updates of probability distributions and amplitude characteristics
  - Cumulative Distribution Function (CDF) visualization
  - CDF amplitude characteristics
- **Customizable Display**:
  - Bar chart / Line chart toggle
  - dB view for amplitude characteristics
  - Adjustable display range
  - Fixed range mode
- **Internationalization**: Support for English and Japanese
- **Gallery View**: Quick access to pre-configured distribution examples

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Chart.js with react-chartjs-2
- **Internationalization**: i18next

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code with Prettier
- `npm run prettier:check` - Check code formatting

## Project Structure

```
src/
├── components/          # React components
├── distributions/      # Distribution definitions
├── i18n/               # Internationalization files
│   └── locales/
│       ├── en.json
│       └── ja.json
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── probability.ts
│   └── zTransform.ts
└── App.tsx             # Main application component
```

## How It Works

The application demonstrates the Central Limit Theorem by:

1. **Convolution**: Repeatedly convolving a probability distribution or impulse response with itself
2. **Z-Transform**: Computing the Z-transform to analyze frequency characteristics
3. **Visualization**: Displaying how the distribution approaches a normal distribution as convolution count increases

The mathematical property used is that the Z-transform of n convolutions equals the n-th power of the original Z-transform:

- `|Z[f * f * ... * f]| = |Z[f]^n| = |Z[f]|^n`

This allows efficient computation without explicitly performing all convolutions.

## License

MIT License. See [LICENSE](LICENSE) file for details.

## Author

Directed & Built by [yuinore](https://github.com/yuinore)
