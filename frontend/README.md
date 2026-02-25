# MetaboLens Frontend

Professional Next.js application for the MetaboLens metabolic health platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

**Note:** The backend must be running on port 8000 for the API to work.

## Features

- 🎨 **Professional Healthcare UI** - Modern, clean design following healthcare UX best practices
- 📊 **Interactive Health Map** - D3.js visualization of patient position in metabolic health space
- 📈 **Risk Assessment Dashboard** - Clear risk scores with confidence intervals
- 🔬 **SHAP Analysis** - Explainable AI showing top contributing biomarkers
- 💡 **Personalized Recommendations** - AI-generated intervention suggestions
- 📄 **PDF Reports** - Export clinician-ready assessment reports
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: D3.js, Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Header, Footer
│   ├── dashboard/      # Dashboard-specific components
│   └── charts/         # Data visualizations
├── lib/                # Utilities and API client
└── types/              # TypeScript type definitions
```

## Design Principles

1. **Trust & Credibility** - Clean, professional aesthetics appropriate for healthcare
2. **Clarity** - Clear visual hierarchy and information organization
3. **Accessibility** - WCAG-compliant color contrast and keyboard navigation
4. **Performance** - Optimized rendering and data loading
5. **Responsiveness** - Adaptive layouts for all screen sizes

## Color Palette

- **Primary**: Blue (#0ea5e9) - Trust, professionalism
- **Success**: Green (#10b981) - Healthy states
- **Warning**: Amber (#f59e0b) - Moderate risk
- **Danger**: Red (#ef4444) - High risk
- **Healthcare**: Slate tones - Neutral, professional

## Development

```bash
# Type checking
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```
