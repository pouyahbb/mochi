<div align="center">

# 🎨 Mochi

**Transform Wireframes into Beautiful UIs in Seconds**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=for-the-badge)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

*AI-powered design generation platform that converts wireframes into production-ready UI designs*

</div>

---

## ✨ Features

### 🎯 Core Features

- **🤖 AI-Powered Design Generation** - Transform wireframes into production-ready UI designs using advanced AI models
- **🎨 Smart Style Guide** - Automatically generate comprehensive style guides from mood board images
- **📐 Infinite Canvas** - Draw wireframes with powerful tools (frames, shapes, arrows, text, freehand)
- **💬 Interactive Redesign Chat** - Chat with AI to modify designs in real-time
- **📄 Workflow Page Generation** - Generate complete workflow pages (dashboards, settings, profiles, data listings)
- **📦 Component Library Integration** - Leverage shadcn/ui components and pre-built templates
- **💾 Auto-save** - Projects are automatically saved to the cloud
- **🔄 Undo/Redo** - Full history support with keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **🎨 Adaptive Toolbar** - Toolbar colors adapt to background (light/dark)

### 🛠️ Technical Features

- **Real-time Collaboration** - Built with Convex for real-time data synchronization
- **Event-Driven Architecture** - Inngest for webhook processing and background jobs
- **Credit System** - Flexible credit-based billing with Polar integration
- **Secure Authentication** - Password-based authentication with Convex Auth
- **Modern Stack** - Next.js 15, React 19, TypeScript, Tailwind CSS v4

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Convex Account** - Sign up at [convex.dev](https://convex.dev)
- **Anthropic API Key** - Get your API key from [console.anthropic.com](https://console.anthropic.com)
- **Polar Account** (for billing) - Sign up at [polar.sh](https://polar.sh)
- **Inngest Account** (for webhooks) - Sign up at [inngest.com](https://inngest.com)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/mochi.git
cd mochi
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up Convex**

```bash
npx convex dev
```

This will:
- Create a new Convex project (or connect to existing)
- Generate the necessary configuration files
- Set up the database schema

4. **Configure environment variables**

Create a `.env.local` file in the root directory and add the following variables:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_SITE_URL=http://localhost:3000

# Anthropic AI API
ANTHROPIC_API_KEY=sk-ant-api03-your-api-key-here

# Polar Billing Configuration
POLAR_ACCESS_TOKEN=polar_oat_your-access-token
POLAR_WEBHOOK_SECRET=polar_whs_your-webhook-secret
POLAR_ENV=sandbox  # or "production" for production
POLAR_STANDARD_PLAN=your-product-id-here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production

# Inngest Configuration
INNGEST_SIGNING_KEY=signkey-prod-your-signing-key
INNGEST_EVENT_KEY=your-event-key
INNGEST_DEV=1  # Set to 0 for production
```

### Environment Variables Explained

#### Convex Variables
- `CONVEX_DEPLOYMENT` - Your Convex deployment identifier (format: `dev:deployment-name`)
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `CONVEX_SITE_URL` - Your application URL (for OAuth callbacks)

#### Anthropic AI
- `ANTHROPIC_API_KEY` - Your Anthropic API key for AI model access

#### Polar Billing
- `POLAR_ACCESS_TOKEN` - Your Polar API access token
- `POLAR_WEBHOOK_SECRET` - Secret for validating Polar webhooks
- `POLAR_ENV` - Environment: `sandbox` for testing, `production` for live
- `POLAR_STANDARD_PLAN` - Product ID for your standard subscription plan
- `NEXT_PUBLIC_APP_URL` - Your application's public URL (for webhook callbacks)

#### Inngest
- `INNGEST_SIGNING_KEY` - Signing key for Inngest functions
- `INNGEST_EVENT_KEY` - Event key for Inngest events
- `INNGEST_DEV` - Set to `1` for development, `0` for production

### Running the Development Server

1. **Start Convex development server** (in one terminal)

```bash
npx convex dev
```

2. **Start Inngest development server** (in another terminal)

```bash
npm run inngest:dev
```

3. **Start Next.js development server** (in a third terminal)

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

### 1. Create an Account

1. Navigate to the sign-up page
2. Enter your first name, last name, email, and password
3. Click "Sign Up" to create your account

### 2. Set Up Your First Project

1. After signing in, you'll be redirected to the dashboard
2. Click "New Project" to create a new design project
3. Give your project a name (optional)

### 3. Build Your Style Guide

1. Navigate to the **Style Guide** tab
2. Upload inspiration images to the **Mood Board**
3. Click "Generate Style Guide" to create a comprehensive style guide
4. The AI will extract:
   - Color palettes (primary, secondary, accent, etc.)
   - Typography scales (headings, body, buttons, etc.)
   - Design tokens

### 4. Draw Your Wireframe

1. Navigate to the **Canvas** tab
2. Use the toolbar to draw your wireframe:
   - **Frame Tool** - Create container frames
   - **Rectangle Tool** - Draw rectangles
   - **Ellipse Tool** - Draw circles and ellipses
   - **Arrow Tool** - Draw directional arrows
   - **Line Tool** - Draw straight lines
   - **Text Tool** - Add text labels
   - **Free Draw Tool** - Draw freehand sketches
   - **Eraser Tool** - Remove shapes
3. Use **Undo/Redo** (Ctrl+Z / Ctrl+Shift+Z) to manage your design history
4. **Zoom** and **Pan** to navigate the canvas

### 5. Generate UI Design

1. Draw a frame around your wireframe
2. Click "Generate Design" on the frame
3. Watch as AI transforms your wireframe into a production-ready UI
4. The generated design will appear next to your frame

### 6. Refine Your Design

1. Click "Design Chat" on the generated UI
2. Chat with AI to modify your design:
   - "Change the primary color to blue"
   - "Make the layout more compact"
   - "Add more spacing between cards"
   - "Update the button styles"
3. The AI will regenerate the design based on your requests

### 7. Generate Workflow Pages

1. Click "Generate Workflow" on a generated UI
2. Select the type of workflow page:
   - Dashboard/Analytics page
   - Settings/Configuration page
   - User Profile page
   - Data Listing/Table page
3. The AI will generate a complementary page that matches your design style

### 8. Export Your Design

1. Click "Export" on the generated UI
2. Choose to export as PNG or copy the HTML code
3. Use the exported design in your projects

---

## 🏗️ Project Structure

```
mochi/
├── convex/                 # Convex backend functions
│   ├── auth.ts            # Authentication configuration
│   ├── schema.ts          # Database schema
│   ├── projects.ts        # Project management
│   ├── subscription.ts    # Subscription & credits
│   ├── user.ts            # User management
│   └── ...
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── (protected)/   # Protected routes
│   │   │   ├── dashboard/ # Dashboard pages
│   │   │   └── billing/   # Billing pages
│   │   ├── api/           # API routes
│   │   │   ├── generate/  # AI generation endpoints
│   │   │   ├── billing/   # Billing webhooks
│   │   │   └── inngest/   # Inngest endpoints
│   │   ├── auth/          # Authentication pages
│   │   └── inngest/       # Inngest functions
│   ├── components/        # React components
│   │   ├── canvas/        # Canvas components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── redux/             # Redux store & slices
│   ├── prompts/           # AI prompts & templates
│   └── lib/               # Utility functions
└── ...
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Convex** - Backend-as-a-Service (database, auth, real-time)
- **Inngest** - Event-driven serverless functions
- **Polar** - Billing and subscription management

### AI & Services
- **Anthropic Claude** - AI model for design generation
- **AI SDK** - Vercel AI SDK for streaming responses

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundler

---

## 🔐 Authentication

Mochi uses **password-based authentication** via Convex Auth. Users can:

- Sign up with email and password
- Sign in with their credentials
- Manage their profile and account settings

---

## 💳 Billing & Credits

### Credit System

- Each user gets **10 credits per month** with the Standard Plan ($9.99/month)
- Credits are consumed for:
  - Style guide generation (1 credit)
  - UI design generation (1 credit)
  - Design redesign/chat (1 credit)
  - Workflow page generation (1 credit)
- Credits refresh monthly
- Credits rollover up to a limit (100 credits)

### Subscription Management

- Powered by **Polar** for secure payment processing
- Webhooks handled by **Inngest** for reliable event processing
- Automatic credit granting on subscription activation/renewal

---

## 🎨 AI Generation System

### Models Used

- **Claude Sonnet 4** - Primary model for UI generation (cost-effective)
- **Claude Opus 4** - Available for more complex tasks

### Prompt Engineering

The system uses sophisticated prompts that:

- Reference shadcn/ui component library
- Include pre-built page templates
- Enforce style guide consistency
- Maintain WCAG AA accessibility standards
- Generate semantic, production-ready HTML

### Component Library

Pre-built components and templates reduce AI generation costs by:

- Providing reusable component structures
- Offering full-page templates as starting points
- Ensuring design consistency
- Reducing token usage

---

## 📝 API Endpoints

### Generation Endpoints

- `POST /api/generate` - Generate UI from wireframe
- `POST /api/generate/style` - Generate style guide from mood board
- `POST /api/generate/redesign` - Redesign existing UI
- `POST /api/generate/workflow` - Generate workflow page
- `POST /api/generate/workflow-redesign` - Redesign workflow page

### Billing Endpoints

- `GET /api/billing/checkout` - Create checkout session
- `POST /api/billing/webhook` - Handle Polar webhooks

### Inngest Endpoints

- `POST /api/inngest` - Inngest function execution endpoint

---

## 🔄 State Management

### Redux Slices

- **shapes** - Canvas shapes and drawing state
- **viewport** - Canvas viewport (zoom, pan)
- **projects** - Project list and management
- **profile** - User profile data
- **chat** - AI chat messages for redesign

### History System

- Full undo/redo support
- History stored in Redux state
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Shift+Z` or `Ctrl+Y` (redo)
- History limit: 50 states

---

## 🎯 Key Features Explained

### Infinite Canvas

- Draw wireframes on an unlimited canvas
- Pan with spacebar + drag or shift + drag
- Zoom with mouse wheel or zoom controls
- Multiple drawing tools (shapes, arrows, text, freehand)
- Selection and manipulation of shapes

### Style Guide Generation

- Upload images to mood board
- AI analyzes visual style
- Generates comprehensive design system:
  - Color palettes (primary, secondary, accent, etc.)
  - Typography scales (headings, body, buttons)
  - Design tokens

### AI Design Generation

- Converts wireframes to production-ready HTML
- Uses style guide for consistency
- Leverages shadcn/ui components
- Generates semantic, accessible code
- Maintains design system tokens

### Interactive Redesign

- Chat interface for design modifications
- Real-time streaming responses
- Context-aware redesigns
- Maintains design consistency

---

## 🚀 Deployment

### Prerequisites

1. Set up production Convex deployment
2. Configure production environment variables
3. Set up Polar production account
4. Configure Inngest production environment

### Environment Variables for Production

Update your `.env.local` with production values:

```env
CONVEX_DEPLOYMENT=prod:your-production-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-production.convex.cloud
CONVEX_SITE_URL=https://your-domain.com
POLAR_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
INNGEST_DEV=0
```

### Build and Deploy

```bash
npm run build
npm start
```

For deployment on Vercel:

1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Convex](https://convex.dev) - Backend infrastructure
- [Anthropic](https://anthropic.com) - AI models
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Polar](https://polar.sh) - Billing platform
- [Inngest](https://inngest.com) - Event processing

---

## 📞 Support

For support, email support@mochi.app or open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ for designers and developers**

[Website](https://mochi.app) • [Documentation](https://docs.mochi.app) • [Twitter](https://twitter.com/mochi)

</div>
