# Battleship AI

This project is a web-based 3D implementation of the classic game Battleship, where players can compete against an AI opponent. The application is built with Nuxt.js and features a dynamic and interactive 3D game board rendered with TresJS.

## Key Features

- **3D Gameplay:** Interactive 3D game board and environment.
- **AI Opponents:** Play against AI powered by various large language models (LLMs) like OpenAI, Google Gemini, and Anthropic Claude.
- **Modern Frontend:** Built with the latest web technologies including Nuxt.js 3, Vue.js 3, and Tailwind CSS.
- **Component-Based:** Structured with a component-based architecture for easy maintenance and scalability.
- **Comprehensive Testing:** Includes unit tests with Vitest and end-to-end tests with Playwright.

## Tech Stack

- **Framework:** [Nuxt.js](https://nuxt.com/)
- **3D Rendering:** [TresJS](https://tresjs.org/) (a Vue.js renderer for Three.js)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI SDKs:**
  - [OpenAI](https://www.npmjs.com/package/openai)
  - [Google Gemini](https://www.npmjs.com/package/@google/genai)
  - [Anthropic Claude](https://www.npmjs.com/package/@anthropic-ai/sdk)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Unit Testing:** [Vitest](https://vitest.dev/)
- **E2E Testing:** [Playwright](https://playwright.dev/)
- **Linting & Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## Getting Started

### Prerequisites

- Node.js (version specified in `package.json`)
- pnpm (version specified in `package.json`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sapryniukt/battleship-ai.git
   cd battleship-ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Development Server

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Testing

- **Unit Tests:**

  ```bash
  pnpm test:unit
  ```

- **End-to-End Tests:**

  ```bash
  pnpm test:e2e
  ```

- **All Tests:**
  ```bash
  pnpm test
  ```

## License

This project is licensed under the [MIT License](LICENSE).
