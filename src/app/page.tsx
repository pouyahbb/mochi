"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, CheckCircle2, Palette, Download, Workflow, MessageCircle, Layout, Wand2, FileCode, Image as ImageIcon, Layers } from "lucide-react"
import { useAppSelector } from "@/redux/store"
import { combineSlug } from "@/lib/utils"

export default function Home() {
  const router = useRouter()
  const profile = useAppSelector(state => state.profile.user)
  const isAuthenticated = !!profile

  const handleDashboardClick = () => {
    if(profile?.name) {
      router.push(`/dashboard/${combineSlug(profile.name)}`)
    }
  }

  const handleUpgradeClick = () => {
    if(profile?.name) {
      router.push(`/billing/${combineSlug(profile.name)}`)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-background/95">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              Mochi
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleUpgradeClick}
                  className="text-sm font-medium text-foreground hover:text-muted-foreground transition"
                >
                  Upgrade
                </button>
                <button
                  onClick={handleDashboardClick}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="text-sm font-medium text-foreground hover:text-muted-foreground transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Design Generation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Transform Wireframes into
              <span className="text-primary"> Beautiful UIs</span> in Seconds
            </h1>
            <p className="text-lg text-muted-foreground">
              Create production-ready designs from simple sketches. Our AI understands your vision and generates pixel-perfect interfaces using shadcn components and modern design patterns.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={handleDashboardClick}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition"
              >
                Learn More
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div>
                <div className="font-semibold text-foreground">10K+</div>
                <div>Designs Created</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">5K+</div>
                <div>Active Users</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">99%</div>
                <div>Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden border bg-muted shadow-2xl">
              <div className="w-full h-full bg-linear-to-b from-primary/20 via-background to-secondary/20 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Design Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Everything You Need to Design Faster
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that streamline your design workflow and help you create stunning interfaces effortlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                Transform your wireframes into production-ready UI designs in seconds. Our advanced AI understands your style guide and generates pixel-perfect interfaces that match your brand.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Smart Style Guide</h3>
              <p className="text-muted-foreground">
                Upload images to your mood board and automatically generate comprehensive style guides with colors, typography, and design tokens extracted from your inspiration.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Production-Ready Code</h3>
              <p className="text-muted-foreground">
                Get clean, semantic HTML with shadcn/ui components. Copy-paste ready code that follows best practices and modern design patterns.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Workflow className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Workflow Pages</h3>
              <p className="text-muted-foreground">
                Generate complete workflow pages—dashboards, settings, profiles, and data listings—that perfectly complement your main design with consistent styling.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Interactive Redesign</h3>
              <p className="text-muted-foreground">
                Chat with AI to redesign your UI in real-time. Request color changes, layout adjustments, content updates, and more—all through natural conversation.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Export & Deploy</h3>
              <p className="text-muted-foreground">
                Export your designs as high-quality PNG images or copy the HTML code directly. Ready to use in your projects immediately.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Infinite Canvas</h3>
              <p className="text-muted-foreground">
                Draw wireframes on an infinite canvas with powerful tools. Create frames, shapes, arrows, and text with precision and ease.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Mood Board</h3>
              <p className="text-muted-foreground">
                Build your inspiration collection with an integrated mood board. Upload images that guide your style guide generation and design aesthetic.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Component Library</h3>
              <p className="text-muted-foreground">
                Leverage pre-built shadcn/ui components and templates to reduce AI costs while maintaining design consistency and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your ideas into beautiful, production-ready designs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-b from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Palette className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Build Your Style Guide</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Start by uploading inspiration images to your mood board. Our AI analyzes your visual style and automatically generates a comprehensive style guide with color palettes, typography scales, and design tokens that capture your aesthetic.
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload Images</span>
                </div>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-b from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Wand2 className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Sketch & Generate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Draw your wireframe on the infinite canvas using our intuitive drawing tools. Create frames, shapes, and annotations. Then, with a single click, watch as AI transforms your sketch into a fully functional, production-ready UI design that follows your style guide.
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                  <Layout className="w-4 h-4" />
                  <span>Draw Wireframe</span>
                </div>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-b from-primary/20 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Download className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Refine & Export</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use the interactive chat to refine your design—change colors, adjust layouts, update content, or generate workflow pages. When you&apos;re ready, export as PNG or copy the clean HTML code directly into your project.
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                  <FileCode className="w-4 h-4" />
                  <span>Export Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One plan. Unlimited creativity. No hidden fees.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div className="rounded-xl border bg-card p-8 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-primary to-primary/60 rounded-full mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">Standard Plan</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold text-foreground">$9.99</span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                  <p className="text-muted-foreground">
                    Get 10 credits every month to power your AI-assisted design workflow
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">10 Monthly Credits</p>
                      <p className="text-sm text-muted-foreground">Each credit = one AI task (generation, export, redesign)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">AI-Powered Design Generation</p>
                      <p className="text-sm text-muted-foreground">Transform wireframes into production-ready code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Premium Assets Export</p>
                      <p className="text-sm text-muted-foreground">High-quality PNG exports and HTML code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Interactive Redesign Chat</p>
                      <p className="text-sm text-muted-foreground">Real-time AI-powered design modifications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Workflow Page Generation</p>
                      <p className="text-sm text-muted-foreground">Create dashboards, settings, profiles, and more</p>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  {isAuthenticated ? (
                    <button
                      onClick={handleUpgradeClick}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                    >
                      Upgrade Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href="/auth/sign-up"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Cancel anytime • No setup fees • Instant access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-24 px-6 bg-linear-to-br from-primary via-primary/20 to-primary/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground">
            Ready to Transform Your Design Workflow?
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Join thousands of designers and developers creating beautiful UIs faster than ever.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <button
                onClick={handleDashboardClick}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-8 py-4 text-sm font-medium text-primary hover:opacity-90 transition"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-8 py-4 text-sm font-medium text-primary hover:opacity-90 transition"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/20 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Mochi</h3>
              <p className="text-sm text-muted-foreground">
                Transform your wireframes into beautiful, production-ready UI designs with AI-powered tools.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/sign-in" className="hover:text-foreground transition">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground transition">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="hover:text-foreground transition cursor-pointer">Privacy Policy</span>
                </li>
                <li>
                  <span className="hover:text-foreground transition cursor-pointer">Terms of Service</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Mochi. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for designers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
