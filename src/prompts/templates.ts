/**
 * Pre-built Page Templates for AI Generation
 * 
 * Instead of generating full pages from scratch, the AI picks a template
 * and customises content/colors. This cuts output tokens by 50–70%.
 * 
 * Each template uses {{slot}} placeholders that the AI fills in.
 * Colors use .c-* classes defined in the [data-generated-ui] <style> block.
 */

// ─── Landing Page Template ────────────────────────────────────────

export const landingPage = `<div data-generated-ui>
<style>
[data-generated-ui] .c-bg { background-color: {{bg}}; }
[data-generated-ui] .c-fg { color: {{fg}}; }
[data-generated-ui] .c-card-bg { background-color: {{cardBg}}; }
[data-generated-ui] .c-card-fg { color: {{cardFg}}; }
[data-generated-ui] .c-primary-bg { background-color: {{primaryBg}}; }
[data-generated-ui] .c-primary-fg { color: {{primaryFg}}; }
[data-generated-ui] .c-secondary-bg { background-color: {{secondaryBg}}; }
[data-generated-ui] .c-secondary-fg { color: {{secondaryFg}}; }
[data-generated-ui] .c-accent-bg { background-color: {{accentBg}}; }
[data-generated-ui] .c-accent-fg { color: {{accentFg}}; }
[data-generated-ui] .c-muted-bg { background-color: {{mutedBg}}; }
[data-generated-ui] .c-muted-fg { color: {{mutedFg}}; }
[data-generated-ui] .c-border { border-color: {{border}}; }
[data-generated-ui] .c-ring { box-shadow: 0 0 0 3px {{ring}}40; }
</style>

<div class="min-h-screen c-bg">
  <!-- Navigation -->
  <nav id="main-nav" class="c-bg border-b c-border">
    <div class="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
      <div class="flex items-center gap-8">
        <a class="text-xl font-bold c-fg">{{brandName}}</a>
        <div class="hidden md:flex items-center gap-6">
          {{navLinks}}
        </div>
      </div>
      <div class="flex items-center gap-4">
        {{navActions}}
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero-section" class="c-bg py-24 px-6">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div class="space-y-6">
        <h1 class="text-4xl md:text-5xl font-bold c-fg leading-tight">{{heroTitle}}</h1>
        <p class="text-lg c-muted-fg">{{heroSubtitle}}</p>
        <div class="flex items-center gap-4">
          {{heroCtas}}
        </div>
      </div>
      <div class="aspect-video rounded-xl overflow-hidden c-muted-bg">{{heroImage}}</div>
    </div>
  </section>

  <!-- Features -->
  <section id="features-section" class="c-bg py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 space-y-4">
        <h2 class="text-3xl md:text-4xl font-semibold c-fg">{{featuresTitle}}</h2>
        <p class="text-lg c-muted-fg max-w-2xl mx-auto">{{featuresSubtitle}}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        {{featureCards}}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="cta-section" class="c-primary-bg py-24 px-6">
    <div class="max-w-3xl mx-auto text-center space-y-6">
      <h2 class="text-3xl md:text-4xl font-semibold c-primary-fg">{{ctaTitle}}</h2>
      <p class="text-lg c-primary-fg opacity-80">{{ctaDescription}}</p>
      <div class="flex items-center justify-center gap-4 pt-4">
        {{ctaButtons}}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="footer-section" class="c-bg border-t c-border py-16 px-6">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <span class="text-lg font-bold c-fg">{{brandName}}</span>
      <div class="flex items-center gap-6">{{footerLinks}}</div>
      <p class="text-sm c-muted-fg">{{copyright}}</p>
    </div>
  </footer>
</div>
</div>`

// ─── Dashboard Template ───────────────────────────────────────────

export const dashboardPage = `<div data-generated-ui>
<style>
[data-generated-ui] .c-bg { background-color: {{bg}}; }
[data-generated-ui] .c-fg { color: {{fg}}; }
[data-generated-ui] .c-card-bg { background-color: {{cardBg}}; }
[data-generated-ui] .c-card-fg { color: {{cardFg}}; }
[data-generated-ui] .c-primary-bg { background-color: {{primaryBg}}; }
[data-generated-ui] .c-primary-fg { color: {{primaryFg}}; }
[data-generated-ui] .c-secondary-bg { background-color: {{secondaryBg}}; }
[data-generated-ui] .c-secondary-fg { color: {{secondaryFg}}; }
[data-generated-ui] .c-accent-bg { background-color: {{accentBg}}; }
[data-generated-ui] .c-accent-fg { color: {{accentFg}}; }
[data-generated-ui] .c-muted-bg { background-color: {{mutedBg}}; }
[data-generated-ui] .c-muted-fg { color: {{mutedFg}}; }
[data-generated-ui] .c-border { border-color: {{border}}; }
[data-generated-ui] .c-ring { box-shadow: 0 0 0 3px {{ring}}40; }
</style>

<div class="flex h-full c-bg">
  <!-- Sidebar -->
  <aside id="main-sidebar" class="w-64 border-r c-border c-bg flex flex-col shrink-0">
    <div class="p-6"><span class="text-xl font-bold c-fg">{{brandName}}</span></div>
    <nav class="flex-1 px-3 space-y-1">
      {{sidebarItems}}
    </nav>
    <div class="p-4 border-t c-border">
      {{sidebarFooter}}
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="c-bg border-b c-border px-6 h-16 flex items-center justify-between shrink-0">
      <h1 class="text-xl font-semibold c-fg">{{pageTitle}}</h1>
      <div class="flex items-center gap-4">{{headerActions}}</div>
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto p-6">
      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {{statCards}}
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          {{mainContent}}
        </div>
        <div class="space-y-6">
          {{sideContent}}
        </div>
      </div>
    </main>
  </div>
</div>
</div>`

// ─── Settings Page Template ───────────────────────────────────────

export const settingsPage = `<div data-generated-ui>
<style>
[data-generated-ui] .c-bg { background-color: {{bg}}; }
[data-generated-ui] .c-fg { color: {{fg}}; }
[data-generated-ui] .c-card-bg { background-color: {{cardBg}}; }
[data-generated-ui] .c-card-fg { color: {{cardFg}}; }
[data-generated-ui] .c-primary-bg { background-color: {{primaryBg}}; }
[data-generated-ui] .c-primary-fg { color: {{primaryFg}}; }
[data-generated-ui] .c-secondary-bg { background-color: {{secondaryBg}}; }
[data-generated-ui] .c-secondary-fg { color: {{secondaryFg}}; }
[data-generated-ui] .c-accent-bg { background-color: {{accentBg}}; }
[data-generated-ui] .c-accent-fg { color: {{accentFg}}; }
[data-generated-ui] .c-muted-bg { background-color: {{mutedBg}}; }
[data-generated-ui] .c-muted-fg { color: {{mutedFg}}; }
[data-generated-ui] .c-border { border-color: {{border}}; }
[data-generated-ui] .c-ring { box-shadow: 0 0 0 3px {{ring}}40; }
</style>

<div class="flex h-full c-bg">
  <!-- Sidebar -->
  <aside id="main-sidebar" class="w-64 border-r c-border c-bg flex flex-col shrink-0">
    <div class="p-6"><span class="text-xl font-bold c-fg">{{brandName}}</span></div>
    <nav class="flex-1 px-3 space-y-1">{{sidebarItems}}</nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="c-bg border-b c-border px-6 h-16 flex items-center shrink-0">
      <h1 class="text-xl font-semibold c-fg">Settings</h1>
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      <div class="max-w-3xl mx-auto space-y-8">
        {{settingSections}}
      </div>
    </main>
  </div>
</div>
</div>`

// ─── Profile Page Template ────────────────────────────────────────

export const profilePage = `<div data-generated-ui>
<style>
[data-generated-ui] .c-bg { background-color: {{bg}}; }
[data-generated-ui] .c-fg { color: {{fg}}; }
[data-generated-ui] .c-card-bg { background-color: {{cardBg}}; }
[data-generated-ui] .c-card-fg { color: {{cardFg}}; }
[data-generated-ui] .c-primary-bg { background-color: {{primaryBg}}; }
[data-generated-ui] .c-primary-fg { color: {{primaryFg}}; }
[data-generated-ui] .c-secondary-bg { background-color: {{secondaryBg}}; }
[data-generated-ui] .c-secondary-fg { color: {{secondaryFg}}; }
[data-generated-ui] .c-accent-bg { background-color: {{accentBg}}; }
[data-generated-ui] .c-accent-fg { color: {{accentFg}}; }
[data-generated-ui] .c-muted-bg { background-color: {{mutedBg}}; }
[data-generated-ui] .c-muted-fg { color: {{mutedFg}}; }
[data-generated-ui] .c-border { border-color: {{border}}; }
[data-generated-ui] .c-ring { box-shadow: 0 0 0 3px {{ring}}40; }
</style>

<div class="flex h-full c-bg">
  <!-- Sidebar -->
  <aside id="main-sidebar" class="w-64 border-r c-border c-bg flex flex-col shrink-0">
    <div class="p-6"><span class="text-xl font-bold c-fg">{{brandName}}</span></div>
    <nav class="flex-1 px-3 space-y-1">{{sidebarItems}}</nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="c-bg border-b c-border px-6 h-16 flex items-center shrink-0">
      <h1 class="text-xl font-semibold c-fg">Profile</h1>
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Profile Header -->
        <div id="profile-header" class="c-card-bg c-card-fg rounded-xl border c-border p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div class="w-20 h-20 rounded-full c-muted-bg flex items-center justify-center text-2xl font-bold c-muted-fg">{{avatar}}</div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold">{{userName}}</h2>
            <p class="c-muted-fg mt-1">{{userBio}}</p>
          </div>
          <button class="c-primary-bg c-primary-fg rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">Edit Profile</button>
        </div>

        <!-- Profile Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">{{mainContent}}</div>
          <div class="space-y-6">{{sideContent}}</div>
        </div>
      </div>
    </main>
  </div>
</div>
</div>`

// ─── Data Listing Template ────────────────────────────────────────

export const dataListingPage = `<div data-generated-ui>
<style>
[data-generated-ui] .c-bg { background-color: {{bg}}; }
[data-generated-ui] .c-fg { color: {{fg}}; }
[data-generated-ui] .c-card-bg { background-color: {{cardBg}}; }
[data-generated-ui] .c-card-fg { color: {{cardFg}}; }
[data-generated-ui] .c-primary-bg { background-color: {{primaryBg}}; }
[data-generated-ui] .c-primary-fg { color: {{primaryFg}}; }
[data-generated-ui] .c-secondary-bg { background-color: {{secondaryBg}}; }
[data-generated-ui] .c-secondary-fg { color: {{secondaryFg}}; }
[data-generated-ui] .c-accent-bg { background-color: {{accentBg}}; }
[data-generated-ui] .c-accent-fg { color: {{accentFg}}; }
[data-generated-ui] .c-muted-bg { background-color: {{mutedBg}}; }
[data-generated-ui] .c-muted-fg { color: {{mutedFg}}; }
[data-generated-ui] .c-border { border-color: {{border}}; }
[data-generated-ui] .c-ring { box-shadow: 0 0 0 3px {{ring}}40; }
</style>

<div class="flex h-full c-bg">
  <!-- Sidebar -->
  <aside id="main-sidebar" class="w-64 border-r c-border c-bg flex flex-col shrink-0">
    <div class="p-6"><span class="text-xl font-bold c-fg">{{brandName}}</span></div>
    <nav class="flex-1 px-3 space-y-1">{{sidebarItems}}</nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="c-bg border-b c-border px-6 h-16 flex items-center justify-between shrink-0">
      <h1 class="text-xl font-semibold c-fg">{{pageTitle}}</h1>
      <button class="c-primary-bg c-primary-fg rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">{{addButtonText}}</button>
    </header>

    <main class="flex-1 overflow-y-auto p-6">
      <!-- Filters & Search -->
      <div id="filters-bar" class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div class="relative w-full md:w-80">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 c-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="search" placeholder="Search..." class="c-bg c-fg border c-border rounded-md h-9 w-full pl-9 pr-3 text-sm" />
        </div>
        <div class="flex items-center gap-3">{{filterButtons}}</div>
      </div>

      <!-- Data Table -->
      <div id="data-table" class="c-card-bg rounded-xl border c-border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="border-b c-border">{{tableHeaders}}</tr></thead>
            <tbody>{{tableRows}}</tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div id="pagination" class="flex items-center justify-between mt-6">
        <p class="text-sm c-muted-fg">{{paginationInfo}}</p>
        <div class="flex items-center gap-2">{{paginationButtons}}</div>
      </div>
    </main>
  </div>
</div>
</div>`

// ─── Helper to get template names + descriptions for AI ───────────

export function getTemplateReference(): string {
    return `
## PAGE TEMPLATES (pick the closest match and CUSTOMIZE — do not build from scratch)

### TEMPLATE: Landing Page
Best for: Marketing pages, product pages, portfolios, agency sites
Structure: Navbar → Hero (text + image) → Features (3-col grid) → CTA section → Footer
Use when wireframe shows: top nav + hero area + feature cards + footer

### TEMPLATE: Dashboard
Best for: Admin panels, analytics, SaaS dashboards, monitoring
Structure: Sidebar (nav) + Header → Stats row (4 cards) → 2/3 + 1/3 content grid
Use when wireframe shows: sidebar + top metrics + charts/tables

### TEMPLATE: Settings Page
Best for: Configuration, preferences, account management
Structure: Sidebar + Header → Single-column form sections (max-w-3xl centered)
Use when wireframe shows: sidebar + form groups / toggles

### TEMPLATE: Profile Page
Best for: User profiles, team member pages, account overview
Structure: Sidebar + Header → Profile card (avatar + info) → 2/3 + 1/3 content grid
Use when wireframe shows: sidebar + avatar area + info cards

### TEMPLATE: Data Listing
Best for: Tables, lists, inventories, order management
Structure: Sidebar + Header (title + add button) → Search/filters → Table → Pagination
Use when wireframe shows: sidebar + search bar + table/list + pagination

### INSTRUCTION:
1. Select the template that best matches the wireframe structure
2. Replace ALL {{placeholder}} values with real content from style guide
3. Fill the <style> block with actual hex colors from the style guide
4. Add/remove sections as needed but KEEP the base structure
5. Keep all id attributes for programmatic selection
`
}

