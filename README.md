# ADN Futbolero Tweet Generator

A modern web application built with Next.js for generating football prediction tweets and downloadable images for ADN Futbolero.

## Features

- **Match Input**: Add multiple football matches with teams, competitions, and predictions
- **Flag Selection**: Choose competition flags from a searchable dropdown
- **Tweet Generation**: Automatically create formatted tweets with emojis and hashtags
- **Image Generation**: Generate high-quality PNG images of match predictions
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes (coming soon)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Generation**: html2canvas
- **UI Components**: React Select for dropdowns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alexyocruz1/TweetGenerator.git
cd TweetGenerator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Click "➕ Agregar Partido" to add a match
2. Fill in the match details:
   - Home and away teams
   - Competition flag
   - Competition name
   - Bet prediction
   - Odds
   - Description
3. Click "Generar Tweets e Imágenes" to create content
4. Copy tweets or download images

## Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Main application
│   └── globals.css   # Global styles
├── components/       # Reusable components (if any)
└── lib/             # Utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to ADN Futbolero.

## Contact

For questions or support, contact the development team.