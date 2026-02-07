/**
 * Shadcn-style HTML Component Library for AI Generation
 * 
 * These are pure HTML/Tailwind snippets that follow shadcn/ui patterns.
 * The AI should compose pages using these building blocks instead of
 * generating everything from scratch — drastically reducing token usage.
 * 
 * Color convention: all colors use .c-* custom classes defined in the
 * <style> block of [data-generated-ui]. Layout and spacing use Tailwind.
 */

// ─── Atomic Components ────────────────────────────────────────────

const button = {
    primary: `<button class="c-primary-bg c-primary-fg inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-90">{{text}}</button>`,
    secondary: `<button class="c-secondary-bg c-secondary-fg inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-90">{{text}}</button>`,
    outline: `<button class="c-bg c-fg border c-border inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-90">{{text}}</button>`,
    ghost: `<button class="c-fg inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-80">{{text}}</button>`,
    destructive: `<button class="bg-red-500 text-white inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-90">{{text}}</button>`,
    icon: `<button class="c-fg inline-flex items-center justify-center rounded-md w-9 h-9 transition hover:opacity-80">{{icon}}</button>`,
}

const badge = {
    default: `<span class="c-primary-bg c-primary-fg inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
    secondary: `<span class="c-secondary-bg c-secondary-fg inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
    outline: `<span class="c-fg border c-border inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
    success: `<span class="bg-green-100 text-green-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
    warning: `<span class="bg-yellow-100 text-yellow-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
    destructive: `<span class="bg-red-100 text-red-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{{text}}</span>`,
}

const input = {
    text: `<input type="text" placeholder="{{placeholder}}" class="c-bg c-fg border c-border rounded-md h-9 w-full px-3 py-1 text-sm shadow-sm transition outline-none focus:ring-2 c-ring" />`,
    search: `<div class="relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 c-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input type="search" placeholder="{{placeholder}}" class="c-bg c-fg border c-border rounded-md h-9 w-full pl-9 pr-3 py-1 text-sm shadow-sm transition outline-none focus:ring-2 c-ring" /></div>`,
    textarea: `<textarea placeholder="{{placeholder}}" rows="4" class="c-bg c-fg border c-border rounded-md w-full px-3 py-2 text-sm shadow-sm transition outline-none focus:ring-2 c-ring resize-none"></textarea>`,
    select: `<select class="c-bg c-fg border c-border rounded-md h-9 w-full px-3 py-1 text-sm shadow-sm transition outline-none focus:ring-2 c-ring">{{options}}</select>`,
    checkbox: `<label class="flex items-center gap-2 text-sm c-fg"><input type="checkbox" class="rounded border c-border w-4 h-4 c-primary-bg" />{{label}}</label>`,
    toggle: `<button role="switch" class="relative inline-flex h-5 w-9 items-center rounded-full c-muted-bg transition"><span class="inline-block h-4 w-4 rounded-full c-bg shadow transform transition translate-x-0.5"></span></button>`,
}

const card = {
    basic: `<div id="{{id}}" class="c-card-bg c-card-fg rounded-xl border c-border shadow-sm">
  <div class="px-6 py-4"><h3 class="font-semibold leading-none">{{title}}</h3><p class="text-sm c-muted-fg mt-1">{{description}}</p></div>
  <div class="px-6 pb-6">{{content}}</div>
</div>`,
    stat: `<div id="{{id}}" class="c-card-bg c-card-fg rounded-xl border c-border shadow-sm p-6">
  <div class="flex items-center justify-between mb-2"><span class="text-sm font-medium c-muted-fg">{{label}}</span>{{icon}}</div>
  <div class="text-3xl font-bold">{{value}}</div>
  <p class="text-xs c-muted-fg mt-1">{{change}}</p>
</div>`,
    image: `<div id="{{id}}" class="c-card-bg c-card-fg rounded-xl border c-border shadow-sm overflow-hidden">
  <div class="aspect-video c-muted-bg">{{image}}</div>
  <div class="p-6"><h3 class="font-semibold">{{title}}</h3><p class="text-sm c-muted-fg mt-2">{{description}}</p></div>
</div>`,
    pricing: `<div id="{{id}}" class="c-card-bg c-card-fg rounded-xl border c-border shadow-sm p-8 text-center">
  <h3 class="text-lg font-semibold">{{planName}}</h3>
  <div class="mt-4"><span class="text-4xl font-bold">{{price}}</span><span class="text-sm c-muted-fg">/month</span></div>
  <ul class="mt-6 space-y-3 text-sm text-left">{{features}}</ul>
  <button class="c-primary-bg c-primary-fg w-full mt-8 rounded-md px-6 py-3 text-sm font-medium transition hover:opacity-90">{{cta}}</button>
</div>`,
    profile: `<div id="{{id}}" class="c-card-bg c-card-fg rounded-xl border c-border shadow-sm p-6 flex items-center gap-4">
  <div class="w-12 h-12 rounded-full c-muted-bg flex items-center justify-center font-semibold c-muted-fg text-lg">{{initials}}</div>
  <div><h4 class="font-semibold">{{name}}</h4><p class="text-sm c-muted-fg">{{role}}</p></div>
</div>`,
}

const table = {
    basic: `<div class="c-card-bg rounded-xl border c-border overflow-hidden">
  <div class="overflow-x-auto">
    <table class="w-full caption-bottom text-sm">
      <thead><tr class="border-b c-border">{{headers}}</tr></thead>
      <tbody>{{rows}}</tbody>
    </table>
  </div>
</div>`,
    headerCell: `<th class="c-fg h-10 px-4 text-left align-middle font-medium whitespace-nowrap">{{text}}</th>`,
    row: `<tr class="border-b c-border transition hover:c-muted-bg">{{cells}}</tr>`,
    cell: `<td class="c-fg px-4 py-3 align-middle">{{content}}</td>`,
}

const navigation = {
    topbar: `<nav id="main-nav" class="c-bg border-b c-border">
  <div class="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
    <div class="flex items-center gap-8">
      <a class="text-xl font-bold c-fg">{{logo}}</a>
      <div class="hidden md:flex items-center gap-6">{{links}}</div>
    </div>
    <div class="flex items-center gap-4">{{actions}}</div>
  </div>
</nav>`,
    navLink: `<a class="text-sm font-medium c-muted-fg hover:c-fg transition">{{text}}</a>`,
    navLinkActive: `<a class="text-sm font-medium c-fg">{{text}}</a>`,
    sidebar: `<aside id="main-sidebar" class="w-64 border-r c-border c-bg h-full flex flex-col">
  <div class="p-6"><a class="text-xl font-bold c-fg">{{logo}}</a></div>
  <nav class="flex-1 px-3 space-y-1">{{items}}</nav>
  <div class="p-4 border-t c-border">{{footer}}</div>
</aside>`,
    sidebarItem: `<a class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm c-muted-fg hover:c-fg hover:c-muted-bg transition">{{icon}}<span>{{text}}</span></a>`,
    sidebarItemActive: `<a class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm c-fg c-muted-bg font-medium">{{icon}}<span>{{text}}</span></a>`,
}

const section = {
    hero: `<section id="hero-section" class="c-bg py-24 px-6">
  <div class="max-w-7xl mx-auto text-center space-y-6">
    <h1 class="text-4xl md:text-5xl font-bold c-fg leading-tight">{{headline}}</h1>
    <p class="text-lg c-muted-fg max-w-2xl mx-auto">{{subheadline}}</p>
    <div class="flex items-center justify-center gap-4 pt-4">{{ctas}}</div>
  </div>
</section>`,
    heroWithImage: `<section id="hero-section" class="c-bg py-24 px-6">
  <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
    <div class="space-y-6">
      <h1 class="text-4xl md:text-5xl font-bold c-fg leading-tight">{{headline}}</h1>
      <p class="text-lg c-muted-fg">{{subheadline}}</p>
      <div class="flex items-center gap-4">{{ctas}}</div>
    </div>
    <div class="aspect-video rounded-xl overflow-hidden c-muted-bg">{{image}}</div>
  </div>
</section>`,
    features: `<section id="features-section" class="c-bg py-24 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16 space-y-4">
      <h2 class="text-3xl md:text-4xl font-semibold c-fg">{{title}}</h2>
      <p class="text-lg c-muted-fg max-w-2xl mx-auto">{{subtitle}}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">{{cards}}</div>
  </div>
</section>`,
    cta: `<section id="cta-section" class="c-primary-bg py-24 px-6">
  <div class="max-w-3xl mx-auto text-center space-y-6">
    <h2 class="text-3xl md:text-4xl font-semibold c-primary-fg">{{title}}</h2>
    <p class="text-lg c-primary-fg opacity-80">{{description}}</p>
    <div class="flex items-center justify-center gap-4 pt-4">{{ctas}}</div>
  </div>
</section>`,
    testimonials: `<section id="testimonials-section" class="c-bg py-24 px-6">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-3xl font-semibold c-fg text-center mb-16">{{title}}</h2>
    <div class="grid md:grid-cols-3 gap-8">{{testimonials}}</div>
  </div>
</section>`,
}

const layout = {
    pageWithSidebar: `<div class="flex h-screen c-bg">
  {{sidebar}}
  <div class="flex-1 flex flex-col overflow-hidden">
    {{header}}
    <main class="flex-1 overflow-y-auto p-6">{{content}}</main>
  </div>
</div>`,
    pageSimple: `<div class="min-h-screen c-bg">
  {{navbar}}
  <main>{{content}}</main>
  {{footer}}
</div>`,
    dashboardHeader: `<header class="c-bg border-b c-border px-6 h-16 flex items-center justify-between shrink-0">
  <div><h1 class="text-xl font-semibold c-fg">{{title}}</h1></div>
  <div class="flex items-center gap-4">{{actions}}</div>
</header>`,
    pageHeader: `<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
  <div><h1 class="text-2xl font-bold c-fg">{{title}}</h1><p class="text-sm c-muted-fg mt-1">{{description}}</p></div>
  <div class="flex items-center gap-3">{{actions}}</div>
</div>`,
}

const feedback = {
    alert: `<div class="c-card-bg border c-border rounded-lg p-4 flex items-start gap-3">
  {{icon}}<div><h4 class="text-sm font-medium c-fg">{{title}}</h4><p class="text-sm c-muted-fg mt-1">{{description}}</p></div>
</div>`,
    emptyState: `<div class="text-center py-16">
  <div class="w-16 h-16 mx-auto mb-4 rounded-full c-muted-bg flex items-center justify-center">{{icon}}</div>
  <h3 class="text-lg font-medium c-fg mb-2">{{title}}</h3>
  <p class="text-sm c-muted-fg max-w-sm mx-auto mb-6">{{description}}</p>
  {{action}}
</div>`,
    progress: `<div class="w-full"><div class="flex items-center justify-between mb-1"><span class="text-sm font-medium c-fg">{{label}}</span><span class="text-sm c-muted-fg">{{value}}%</span></div><div class="w-full h-2 rounded-full c-muted-bg overflow-hidden"><div class="h-full rounded-full c-primary-bg transition-all" style="width:{{value}}%"></div></div></div>`,
}

const list = {
    item: `<div class="flex items-center justify-between py-4 border-b c-border">
  <div class="flex items-center gap-4">{{left}}</div>
  <div class="flex items-center gap-2">{{right}}</div>
</div>`,
    avatar: `<div class="w-10 h-10 rounded-full c-muted-bg flex items-center justify-center font-medium c-muted-fg text-sm">{{initials}}</div>`,
}

const footer = {
    simple: `<footer id="footer-section" class="c-bg border-t c-border py-16 px-6">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    <div class="flex items-center gap-2"><span class="text-lg font-bold c-fg">{{logo}}</span></div>
    <div class="flex items-center gap-6">{{links}}</div>
    <p class="text-sm c-muted-fg">{{copyright}}</p>
  </div>
</footer>`,
    multiColumn: `<footer id="footer-section" class="c-bg border-t c-border py-16 px-6">
  <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">{{columns}}</div>
  <div class="max-w-7xl mx-auto mt-12 pt-8 border-t c-border flex items-center justify-between">
    <p class="text-sm c-muted-fg">{{copyright}}</p>
    <div class="flex items-center gap-4">{{socials}}</div>
  </div>
</footer>`,
    footerColumn: `<div><h4 class="font-semibold c-fg mb-4">{{title}}</h4><ul class="space-y-2">{{links}}</ul></div>`,
}

const tabs = {
    basic: `<div>
  <div class="c-muted-bg rounded-lg p-1 inline-flex gap-1 mb-6">{{triggers}}</div>
  {{content}}
</div>`,
    trigger: `<button class="rounded-md px-3 py-1.5 text-sm font-medium c-muted-fg transition hover:c-fg">{{text}}</button>`,
    triggerActive: `<button class="rounded-md px-3 py-1.5 text-sm font-medium c-fg c-bg shadow-sm">{{text}}</button>`,
}

const dialog = {
    overlay: `<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">`,
    content: `<div class="c-bg rounded-xl border c-border shadow-lg w-full max-w-lg">
  <div class="px-6 py-4 border-b c-border flex items-center justify-between">
    <h2 class="text-lg font-semibold c-fg">{{title}}</h2>
    <button class="c-muted-fg hover:c-fg w-6 h-6 flex items-center justify-center rounded-md transition">&times;</button>
  </div>
  <div class="px-6 py-6">{{body}}</div>
  <div class="px-6 py-4 border-t c-border flex items-center justify-end gap-3">{{actions}}</div>
</div>`,
}

const chart = {
    barPlaceholder: `<div class="c-card-bg rounded-xl border c-border p-6">
  <h3 class="font-semibold c-fg mb-6">{{title}}</h3>
  <div class="flex items-end gap-2 h-48">{{bars}}</div>
  <div class="flex items-center justify-between mt-4 text-xs c-muted-fg">{{labels}}</div>
</div>`,
    bar: `<div class="flex-1 c-primary-bg rounded-t-sm transition-all" style="height:{{percent}}%"></div>`,
    donutPlaceholder: `<div class="c-card-bg rounded-xl border c-border p-6 flex flex-col items-center">
  <h3 class="font-semibold c-fg mb-6 self-start">{{title}}</h3>
  <div class="w-32 h-32 rounded-full border-8 c-primary-bg/20 border-t-8 c-border relative flex items-center justify-center">
    <span class="text-2xl font-bold c-fg">{{value}}</span>
  </div>
  <div class="mt-4 flex items-center gap-4">{{legend}}</div>
</div>`,
}

// ─── Export as reference text for the AI ───────────────────────────

export const componentLibrary = {
    button, badge, input, card, table, navigation,
    section, layout, feedback, list, footer, tabs,
    dialog, chart
}

/**
 * Generates a compact text reference of all components for AI context.
 * This is injected into the system prompt so the AI knows what's available.
 */
export function getComponentReference(): string {
    return `
## COMPONENT LIBRARY (use these as building blocks — DO NOT generate from scratch)

### Buttons
- PRIMARY: <button class="c-primary-bg c-primary-fg rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">Text</button>
- SECONDARY: <button class="c-secondary-bg c-secondary-fg rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">Text</button>
- OUTLINE: <button class="c-bg c-fg border c-border rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">Text</button>
- GHOST: <button class="c-fg rounded-md px-6 py-3 text-sm font-medium hover:opacity-80">Text</button>
- DESTRUCTIVE: <button class="bg-red-500 text-white rounded-md px-6 py-3 text-sm font-medium hover:opacity-90">Text</button>

### Badges
- DEFAULT: <span class="c-primary-bg c-primary-fg rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>
- SECONDARY: <span class="c-secondary-bg c-secondary-fg rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>
- OUTLINE: <span class="c-fg border c-border rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>
- SUCCESS: <span class="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>
- WARNING: <span class="bg-yellow-100 text-yellow-800 rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>
- DESTRUCTIVE: <span class="bg-red-100 text-red-800 rounded-full px-2.5 py-0.5 text-xs font-medium">Text</span>

### Inputs
- TEXT: <input type="text" placeholder="..." class="c-bg c-fg border c-border rounded-md h-9 w-full px-3 text-sm" />
- SEARCH: wrap input with svg search icon, pl-9
- TEXTAREA: <textarea rows="4" class="c-bg c-fg border c-border rounded-md w-full px-3 py-2 text-sm resize-none"></textarea>
- SELECT: <select class="c-bg c-fg border c-border rounded-md h-9 w-full px-3 text-sm"><option>...</option></select>
- CHECKBOX: <label class="flex items-center gap-2 text-sm c-fg"><input type="checkbox" class="rounded border w-4 h-4" />Label</label>

### Cards
- STAT CARD: rounded-xl border shadow-sm p-6 → label (sm muted) + value (3xl bold) + change (xs muted)
- IMAGE CARD: rounded-xl border overflow-hidden → aspect-video image + p-6 title/desc
- PRICING CARD: rounded-xl border p-8 text-center → plan + price + features list + cta button
- PROFILE CARD: rounded-xl border p-6 flex → avatar circle + name/role

### Table
- WRAPPER: rounded-xl border overflow-hidden → overflow-x-auto → <table class="w-full text-sm">
- HEADER: <thead><tr class="border-b"><th class="h-10 px-4 text-left font-medium">...</th></tr></thead>
- ROW: <tr class="border-b hover:c-muted-bg"><td class="px-4 py-3">...</td></tr>

### Navigation
- TOPBAR: <nav class="c-bg border-b h-16"> → max-w-7xl flex between → logo + links + actions
- SIDEBAR: <aside class="w-64 border-r h-full flex flex-col"> → logo + nav items + footer
- NAV LINK: text-sm font-medium c-muted-fg hover:c-fg
- SIDEBAR ITEM: flex items-center gap-3 rounded-lg px-3 py-2 text-sm (active: c-fg c-muted-bg)

### Sections
- HERO: py-24 px-6 → max-w-7xl text-center → h1 4xl/5xl bold + p lg muted + cta buttons
- HERO+IMAGE: py-24 px-6 → grid md:grid-cols-2 gap-16 → text side + image side
- FEATURES: py-24 px-6 → centered title/subtitle + grid md:grid-cols-3 gap-8 cards
- CTA SECTION: c-primary-bg py-24 → centered title + desc + buttons
- TESTIMONIALS: py-24 → title + grid md:grid-cols-3 gap-8 testimonial cards

### Layouts
- PAGE+SIDEBAR: flex h-screen → sidebar + flex-1 column (header + main overflow-y-auto p-6)
- SIMPLE PAGE: min-h-screen → navbar + main + footer
- DASHBOARD HEADER: border-b h-16 flex between → title + actions
- PAGE HEADER: flex between → title+desc + action buttons, mb-8

### Feedback
- ALERT: border rounded-lg p-4 flex gap-3 → icon + title + desc
- EMPTY STATE: text-center py-16 → icon circle + title + desc + action
- PROGRESS BAR: label + muted bar with colored fill

### Footer
- SIMPLE: border-t py-16 → flex between logo + links + copyright
- MULTI-COLUMN: grid 2/4 cols → column groups + bottom copyright row

### Tabs
- TAB LIST: muted-bg rounded-lg p-1 inline-flex → triggers (active: bg shadow-sm)

### Chart Placeholders
- BAR CHART: card p-6 → title + flex items-end gap-2 h-48 → colored bars + labels
- DONUT: card p-6 → title + circular indicator + legend
`
}

