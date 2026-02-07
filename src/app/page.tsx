"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Code, CheckCircle2, Palette, Download, Workflow, MessageCircle, Layers, Wand2, FileCode, Image as ImageIcon, Github, Twitter, Linkedin } from "lucide-react"
import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/auth/sign-up")
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
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground hover:text-muted-foreground transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
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
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </Link>
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
              <div className="w-full h-full bg-linear-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
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
      <section id="features" className="py-24 px-6 bg-linear-to-b from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 border-primary/20 px-4 py-1.5 text-sm text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Design Faster
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that streamline your design workflow and help you create stunning interfaces effortlessly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Lightning Fast Generation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate complete UI designs in seconds. No more hours of manual work—just sketch your wireframe and watch AI transform it into production-ready code instantly.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Production-Ready Code</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get clean, semantic HTML with shadcn/ui components. Copy-paste ready code that follows best practices, accessibility standards, and modern design patterns.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Style Guide Generator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload inspiration images and generate comprehensive style guides. AI automatically extracts colors, typography, and design tokens to maintain brand consistency.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Smart AI Redesign</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with AI to redesign your UI in real-time. Change colors, layouts, content, and styling with simple text commands. No coding required.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Workflow className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Workflow Page Generation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate complete workflow pages—dashboards, settings, profiles, data tables—that perfectly complement your main design with consistent styling.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Export & Deploy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export your designs as high-quality PNG images or copy the HTML code. Ready to use in your projects immediately with zero additional setup.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Infinite Canvas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Draw wireframes on an infinite canvas with powerful tools. Create frames, shapes, arrows, and text with precision. Pan, zoom, and organize your designs effortlessly.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Interactive Design Chat</h3>
              <p className="text-muted-foreground leading-relaxed">
                Have a conversation with AI about your designs. Ask for changes, improvements, or new variations. AI understands context and maintains design consistency.
              </p>
            </div>
            <div className="group rounded-xl border bg-card/50 backdrop-blur-sm p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">shadcn/ui Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on shadcn/ui components and pre-built templates. Reduce AI costs while maintaining high-quality, consistent designs that follow modern UI patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-linear-to-b from-background to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 border-primary/20 px-4 py-1.5 text-sm text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into beautiful designs in three simple steps. No design experience required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative text-center space-y-6">
              <div className="absolute -left-4 top-8 hidden md:block">
                <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                1
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Create Your Style Guide</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload inspiration images to your mood board. Our AI analyzes the visual style and automatically generates a comprehensive style guide with color palettes, typography scales, and design tokens that match your aesthetic.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
                <span>Upload Images</span>
                <span>→</span>
                <Palette className="w-4 h-4" />
                <span>Get Style Guide</span>
              </div>
            </div>
            <div className="relative text-center space-y-6">
              <div className="absolute -left-4 top-8 hidden md:block">
                <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                2
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Sketch Your Wireframe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use our infinite canvas to draw your wireframe. Create frames, add shapes, arrows, and text. Then click &quot;Generate Design&quot; and watch as AI transforms your sketch into a beautiful, production-ready UI that follows your style guide.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Layers className="w-4 h-4" />
                <span>Draw Wireframe</span>
                <span>→</span>
                <Wand2 className="w-4 h-4" />
                <span>AI Generates UI</span>
              </div>
            </div>
            <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                3
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Refine & Export</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chat with AI to refine your design, generate workflow pages, or make changes. When you&apos;re happy, export as PNG or copy the HTML code. Your design is ready to use in your project immediately.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Refine Design</span>
                <span>→</span>
                <Download className="w-4 h-4" />
                <span>Export & Deploy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-24 px-6  relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-transparent opacity-50" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border bg-blue-foreground/10 border-blue-foreground/20 px-4 py-1.5 text-sm text-white mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Start Creating Today</span>
        </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Design Workflow?
          </h2>
          <p className="text-lg text-blue-foreground/90 max-w-2xl mx-auto">
            Join thousands of designers and developers creating beautiful UIs faster than ever. No credit card required to get started.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-8 py-4 text-sm font-medium text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-blue-foreground/30 px-6 py-3 text-sm font-medium text-blue-foreground hover:bg-primary-foreground/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-linear-to-b from-background to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 border-primary/20 px-4 py-1.5 text-sm text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you're ready. All plans include access to all features.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div className="rounded-xl border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-8 shadow-xl">
                <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-primary to-primary/60 rounded-full mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-3">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Standard Plan</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-foreground">$9.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    10 credits per month • Perfect for freelancers and creators
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">10 Monthly Credits</p>
                      <p className="text-xs text-muted-foreground">One credit = one AI task</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">AI Design Generation</p>
                      <p className="text-xs text-muted-foreground">Transform wireframes into production-ready UIs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Style Guide Generator</p>
                      <p className="text-xs text-muted-foreground">Auto-extract colors and typography from images</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Workflow Page Generation</p>
                      <p className="text-xs text-muted-foreground">Create dashboards, settings, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Export & Deploy</p>
                      <p className="text-xs text-muted-foreground">PNG export and HTML code ready to use</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleGetStarted}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-center text-muted-foreground">
                    Cancel anytime • No setup fees • Instant access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Mochi</h3>
              <p className="text-sm text-muted-foreground">
                Transform wireframes into beautiful UIs with AI-powered design generation.
              </p>
              <div className="flex items-center gap-4">
                <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <div className="flex flex-col gap-2">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <div className="flex flex-col gap-2">
                <Link href="/auth/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Sign In
                </Link>
                <Link href="/auth/sign-up" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Sign Up
                </Link>
                {isAuthenticated && (
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <div className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Mochi. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using Next.js, Convex, and AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
