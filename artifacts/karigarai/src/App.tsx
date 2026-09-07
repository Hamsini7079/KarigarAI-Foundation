import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Bell, BookOpen, Check, ChevronRight, CircleAlert, Compass, Factory, Hand, HeartHandshake, Home as HomeIcon, Languages, Leaf, MapPin, Menu, Package, Palette, Search, ShieldCheck, Sparkles, Store, Users, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useRoute } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { useGetDemoOverview, useGetFoundationStatus, useHealthCheck, useListCategories, useListMarketplaceProducts } from '@workspace/api-client-react';
import type { Category, MarketplaceProduct } from '@workspace/api-client-react';

const queryClient = new QueryClient();

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className="brand" data-testid="brand-karigarai">
      <span className="brand-mark" aria-hidden="true">K</span>
      <span className={dark ? 'brand-name' : 'brand-name'}>KarigarAI</span>
    </span>
  );
}

function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="topbar">
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Link href="/" className="brand" data-testid="link-home-brand" onClick={() => setMenuOpen(false)}>
          <Brand />
        </Link>
        <nav className={`topnav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <Link href="/about" aria-current={location === '/about' ? 'page' : undefined} data-testid="link-about">Our mission</Link>
          <Link href="/buyer/marketplace" aria-current={location === '/buyer/marketplace' || location === '/marketplace' ? 'page' : undefined} data-testid="link-marketplace">Marketplace</Link>
          <Link href="/login" aria-current={location === '/login' ? 'page' : undefined} data-testid="link-login-mobile">Sign in</Link>
        </nav>
        <div className="topbar-actions">
          <Link href="/login" className="button button-quiet button-small" data-testid="link-login">Sign in</Link>
          <Link href="/signup" className="button button-primary button-small" data-testid="link-signup">Join KarigarAI</Link>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} data-testid="button-menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function HealthNote() {
  const health = useHealthCheck();
  if (health.isLoading) return <span className="hero-note"><span className="skeleton" style={{ width: 120, height: 14 }} /></span>;
  return (
    <span className="hero-note" data-testid="status-health">
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: health.isError ? 'hsl(var(--accent))' : 'hsl(147 45% 42%)' }} aria-hidden="true" />
      <span><strong>{health.isError ? 'Taking a short pause' : 'Foundation is ready'}</strong> · built for real workshop days</span>
    </span>
  );
}

function PublicFooter() {
  return (
    <footer className="footer">
      <div className="container-wide footer-inner">
        <span>KarigarAI · a steady companion for independent artisans</span>
        <span><Link href="/about" data-testid="link-footer-about">Built with respect for the maker</Link></span>
      </div>
    </footer>
  );
}

function PublicShell({ children }: { children: ReactNode }) {
  return <div className="site-shell"><PublicNav />{children}<PublicFooter /></div>;
}

function Home() {
  return (
    <PublicShell>
      <main>
        <section className="hero">
          <div className="container-wide hero-grid">
            <div>
              <span className="eyebrow">A business companion for makers</span>
              <h1 className="display text-balance">Your craft.<br /><span style={{ color: 'hsl(var(--accent))' }}>Your terms.</span></h1>
              <p className="hero-copy">KarigarAI helps independent Indian artisans keep their work visible, their orders clear, and their next step within reach.</p>
              <div className="hero-actions">
                <Link href="/demo" className="button button-gold" data-testid="link-try-demo">Explore the demo <ArrowRight size={16} /></Link>
                <Link href="/buyer/marketplace" className="button button-quiet" data-testid="link-discover-work">Discover artisan work</Link>
              </div>
              <HealthNote />
            </div>
            <div className="loom-card" aria-label="A woven arch illustration made from indigo, turmeric, and terracotta shapes">
              <span className="loom-copy">Made by hand ·<br />kept in your hands</span>
              <span className="loom-sun" aria-hidden="true" />
              <span className="loom-arch" aria-hidden="true" />
              <span className="loom-caption">Small workshops deserve serious tools.</span>
            </div>
          </div>
        </section>
        <div className="marquee" aria-hidden="true"><div className="marquee-track">LISTEN FIRST <span>·</span> MAKE VISIBLE <span>·</span> SELL WITH DIGNITY <span>·</span> LISTEN FIRST <span>·</span> MAKE VISIBLE <span>·</span> SELL WITH DIGNITY <span>·</span></div></div>
        <section className="section">
          <div className="container-wide">
            <div className="section-head">
              <div><span className="eyebrow">Why it exists</span><h2 className="display">The work is skilled. The tools should be too.</h2></div>
              <p>KarigarAI keeps the language simple and the important things close: your work, your people, your money, your choice.</p>
            </div>
            <div className="trust-grid">
              <div className="trust-panel tall"><span className="eyebrow">Made for the whole journey</span><div className="trust-number">01—04</div><p>From a first profile to a buyer’s first conversation, each step is designed around how artisans actually work.</p></div>
              <div className="trust-panel"><span className="eyebrow">Human first</span><div className="trust-number">01</div><p>Clear words. Familiar patterns. No business jargon standing between you and your work.</p></div>
              <div className="trust-panel"><span className="eyebrow">Buyer ready</span><div className="trust-number">02</div><p>A credible discovery space where serious buyers can meet the person behind the piece.</p></div>
            </div>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 18 }}>
          <div className="container-wide">
            <div className="section-head"><div><span className="eyebrow">A calmer way to grow</span><h2 className="display">Less sorting.<br />More making.</h2></div></div>
            <div className="feature-row">
              <div className="feature-card"><div className="feature-icon"><Hand size={20} /></div><h3>Your voice stays yours</h3><p>We start with your words and your way of working. Technology supports the story; it never replaces it.</p></div>
              <div className="feature-card"><div className="feature-icon"><ShieldCheck size={20} /></div><h3>Trust is part of the design</h3><p>Private foundations, clear status, and buyer context make every handoff easier to understand.</p></div>
              <div className="feature-card"><div className="feature-icon"><HeartHandshake size={20} /></div><h3>Progress without pressure</h3><p>Small, useful steps for busy workshop days. Pick up where you left off when the time feels right.</p></div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container-wide">
            <div className="callout"><div><h2 className="display">See the foundation before you decide.</h2><p>Step into a deterministic demo made for a textile artisan in Kutch.</p></div><Link href="/demo" className="button button-gold" data-testid="link-callout-demo">Open demo <ArrowRight size={16} /></Link></div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function About() {
  const status = useGetFoundationStatus();
  return (
    <PublicShell>
      <main>
        <section className="page-intro"><div className="container-wide"><span className="eyebrow">The reason behind the tool</span><h1 className="display">Good work should not need a loud voice.</h1><p>KarigarAI is being built alongside artisan communities, for the practical space between making something beautiful and making a living from it.</p></div></section>
        <section className="section"><div className="container-wide about-grid">
          <aside className="about-sticky"><span className="eyebrow">Our north star</span><h2 className="display">Technology that knows when to get out of the way.</h2><div className="pill-list"><span className="pill"><Languages size={14} /> Local language ready</span><span className="pill"><Users size={14} /> Artisan-led</span></div></aside>
          <div className="story">
            <div className="story-block"><span className="eyebrow">01 / dignity</span><h3>The maker is not a data point.</h3><p>Many artisans carry deep skill and thin margins at the same time. We design for the person who knows their craft by touch, not for an abstract “user”. Every surface uses plain language, generous touch targets, and room to pause.</p></div>
            <div className="story-block"><span className="eyebrow">02 / connection</span><h3>A clearer bridge to serious buyers.</h3><p>Buyers need context, not clutter: what was made, where it came from, who made it, and whether it can be made again. Our marketplace foundation makes that context easy to trust.</p></div>
            <div className="story-block"><span className="eyebrow">03 / the foundation</span><h3>Built in small, honest phases.</h3><p>Phase 1 is deliberately foundational. It establishes identity, discovery, and a dependable home for the future tools that will help artisans photograph, describe, price, and share their work.</p>
              {status.isLoading ? <div className="skeleton" style={{ height: 49, marginTop: 18 }} /> : status.isError ? <div className="error-box" style={{ marginTop: 18 }}><CircleAlert size={18} /><p>We could not load the foundation details.</p><button className="button button-quiet button-small" onClick={() => status.refetch()} data-testid="button-retry-status">Try again</button></div> : <div className="pill-list">{status.data?.supportedLanguages?.map((language) => <span className="pill" key={language} data-testid={`pill-language-${language}`}>{language}</span>)}</div>}
            </div>
          </div>
        </div></section>
      </main>
    </PublicShell>
  );
}

function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [, setLocation] = useLocation();
  const isLogin = mode === 'login';
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return (
    <div className="site-shell">
      <header className="topbar"><div className="container-wide" style={{ width: '100%' }}><Link href="/" data-testid="link-auth-brand"><Brand /></Link><Link href="/about" className="text-link" style={{ float: 'right', marginTop: 10 }} data-testid="link-auth-about">Why KarigarAI?</Link></div></header>
      <main className="auth-layout">
        <aside className="auth-aside"><span className="eyebrow" style={{ color: 'hsl(var(--secondary))' }}>A steady place to begin</span><h1 className="display">{isLogin ? 'Welcome back to your work.' : 'Bring your work into view.'}</h1><p>{isLogin ? 'Your workshop, your people, and your next small step are waiting.' : 'Create a simple home for the work you already know how to do.'}</p></aside>
        <section className="auth-main"><div className="auth-card">
          <span className="eyebrow">{isLogin ? 'Sign in' : 'Create your foundation'}</span><h2 className="display">{isLogin ? 'Come on in.' : 'Start with your name.'}</h2><p>{isLogin ? 'Use your phone number or email to continue.' : 'You can keep this simple. We will build from here, together.'}</p>
          {submitted ? <div className="empty-box" data-testid="status-auth-submitted"><Check size={28} color="hsl(var(--accent))" style={{ margin: '0 auto' }} /><p><strong>{isLogin ? 'Demo sign-in is ready.' : 'Your foundation is ready.'}</strong><br />For this phase, continue into the deterministic demo.</p><button className="button button-primary" onClick={() => setLocation('/demo')} data-testid="button-continue-demo">Continue to demo <ArrowRight size={16} /></button></div> :
            <form className="auth-form" onSubmit={submit}>
              {!isLogin && <div className="field"><label htmlFor="artisan-name">Your name</label><input id="artisan-name" name="name" placeholder="For example, Asha Ben" required data-testid="input-name" /></div>}
              <div className="field"><label htmlFor="contact">{isLogin ? 'Phone or email' : 'Phone number'}</label><input id="contact" name="contact" type={isLogin ? 'text' : 'tel'} placeholder={isLogin ? 'you@example.com' : '+91 98 0000 0000'} required data-testid="input-contact" /></div>
              <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" placeholder="At least 6 characters" minLength={6} required data-testid="input-password" /></div>
              {isLogin && <div className="form-row"><label className="check"><input type="checkbox" name="remember" data-testid="input-remember" /> Keep me signed in</label><a href="#help" className="text-link" onClick={(event) => event.preventDefault()} data-testid="link-forgot-password">Forgot password?</a></div>}
              <button className="button button-primary" type="submit" data-testid="button-submit-auth">{isLogin ? 'Sign in' : 'Create artisan account'} <ArrowRight size={16} /></button>
            </form>}
          {!submitted && <><div className="auth-divider">or take a look first</div><div className="demo-entry"><p><strong>Try deterministic demo mode</strong>No account, no setup, no pressure.</p><button className="button button-gold button-small" onClick={() => setLocation('/demo')} data-testid="button-demo-entry">Open demo</button></div></>}
          <p style={{ marginTop: 23, textAlign: 'center', fontSize: '.8rem' }}>{isLogin ? 'New to KarigarAI?' : 'Already have a foundation?'} <Link href={isLogin ? '/signup' : '/login'} className="text-link" data-testid="link-switch-auth">{isLogin ? 'Create an account' : 'Sign in instead'}</Link></p>
        </div></section>
      </main>
    </div>
  );
}

function Demo() {
  const overview = useGetDemoOverview();
  const status = useGetFoundationStatus();
  const artisan = overview.data?.artisan;
  return (
    <PublicShell>
      <main>
        <section className="page-intro"><div className="container-wide"><span className="eyebrow">Deterministic demo mode</span><h1 className="display">A small workshop.<br /><span style={{ color: 'hsl(var(--accent))' }}>A clearer day.</span></h1><p>Meet the foundation as if you were Savitri, a handloom artisan from Telangana. Nothing here changes or asks for an account.</p></div></section>
        <section className="section" style={{ paddingTop: 59 }}><div className="container-wide">
          {overview.isLoading ? <DemoSkeleton /> : overview.isError ? <ErrorState message="The demo overview is taking a moment to arrive." retry={overview.refetch} /> : <><div className="welcome-banner"><div><span className="eyebrow">Welcome to the demo</span><h2 className="display">{artisan?.name ?? 'Savitri'}’s workshop, at a glance.</h2><p>{artisan?.craft} · {artisan?.region} · {artisan?.experienceYears} years of making</p></div><Link className="button button-gold" href="/artisan" data-testid="link-enter-artisan">Enter artisan view <ArrowRight size={16} /></Link></div>
          <div className="metric-grid" style={{ marginTop: 14 }}><Metric label="Published pieces" value={overview.data?.publishedProducts ?? 0} note="Visible to buyers" icon={<Store size={16} />} /><Metric label="Work in progress" value={overview.data?.draftCount ?? 0} note="A place to return to" icon={<Palette size={16} />} /><Metric label="Unread updates" value={overview.data?.unreadNotifications ?? 0} note="Nothing gets lost" icon={<Bell size={16} />} /></div>
          <div className="dashboard-grid" style={{ marginTop: 14 }}><div className="panel"><h3>What comes next</h3><div className="phase"><div className="phase-icon"><Sparkles size={17} /></div><div className="phase-text"><strong>{overview.data?.nextPhase ?? 'Your next chapter'}</strong><span>Phase 2 will help you bring more of the making process online.</span></div><ChevronRight size={17} className="muted" /></div><div className="phase"><div className="phase-icon"><BookOpen size={17} /></div><div className="phase-text"><strong>Keep the story close</strong><span>Your craft and your context remain yours.</span></div></div></div><div className="panel"><h3>Foundation status</h3>{status.isLoading ? <div className="skeleton" style={{ height: 80 }} /> : status.isError ? <p className="muted">Status is temporarily unavailable.</p> : <div><p className="muted" style={{ fontSize: '.81rem', lineHeight: 1.5, marginTop: 0 }}>{status.data?.tagline}</p><div className="pill-list"><span className="pill">{status.data?.phase ?? 'Foundation'}</span><span className="pill">{status.data?.aiMode ?? 'Guided'}</span></div></div>}</div></div></>}
        </div></section>
      </main>
    </PublicShell>
  );
}

function DemoSkeleton() {
  return <><div className="skeleton" style={{ height: 148 }} /><div className="metric-grid" style={{ marginTop: 14 }}>{[1, 2, 3].map((i) => <div className="skeleton" style={{ height: 115 }} key={i} />)}</div></>;
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className="error-box" data-testid="state-error"><CircleAlert size={25} color="hsl(var(--accent))" style={{ margin: '0 auto' }} /><p>{message}</p><button className="button button-quiet button-small" onClick={retry} data-testid="button-retry">Try again</button></div>;
}

function Metric({ label, value, note, icon }: { label: string; value: number; note: string; icon: ReactNode }) {
  return <div className="metric" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="metric-label">{label}</span><span className="muted">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-foot"><Check size={12} />{note}</div></div>;
}

function WorkspaceNav() {
  const [location] = useLocation();
  const links = [{ href: '/artisan', label: 'Overview', icon: HomeIcon }, { href: '/buyer/marketplace', label: 'Marketplace', icon: Compass }, { href: '/about', label: 'About KarigarAI', icon: HeartHandshake }];
  return <nav className="workspace-nav" aria-label="Workspace navigation">{links.map(({ href, label, icon: Icon }) => <Link href={href} key={href} aria-current={location === href ? 'page' : undefined} data-testid={`link-workspace-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} />{label}</Link>)}</nav>;
}

function Artisan() {
  const overview = useGetDemoOverview();
  const status = useGetFoundationStatus();
  const artisan = overview.data?.artisan;
  return <div className="workspace"><aside className="workspace-sidebar"><Link href="/artisan" data-testid="link-artisan-brand"><Brand dark /></Link><WorkspaceNav />{artisan && <div className="workspace-user"><div className="avatar">{artisan.initials}</div><div className="user-detail"><strong>{artisan.name}</strong><span>{artisan.craft}</span></div></div>}</aside><div className="workspace-main"><header className="workspace-topbar"><div><h1>Good morning, {artisan?.name?.split(' ')[0] ?? 'maker'}</h1><p>Your workshop at a glance</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><span className="pill" data-testid="status-demo-mode"><span style={{ width: 7, height: 7, background: 'hsl(147 45% 42%)', borderRadius: '50%' }} /> Demo mode</span><Link href="/buyer/marketplace" className="button button-primary button-small" data-testid="link-view-marketplace"><Store size={15} /> View marketplace</Link></div></header><main className="workspace-content">{overview.isLoading ? <DemoSkeleton /> : overview.isError ? <ErrorState message="We could not load your workshop view." retry={overview.refetch} /> : <><div className="welcome-banner"><div><span className="eyebrow">Your foundation dashboard</span><h2 className="display">{artisan?.craft} from {artisan?.region}</h2><p>{artisan?.experienceYears} years of patient making, now easier to share.</p></div><Link href="/about" className="button button-gold" data-testid="link-dashboard-about">How this works <ArrowRight size={16} /></Link></div><section className="workspace-section"><div className="workspace-section-head"><h2>Your work, in one calm place</h2><span className="muted" style={{ fontSize: '.75rem' }}>Phase 1 foundation</span></div><div className="metric-grid"><Metric label="Published pieces" value={overview.data?.publishedProducts ?? 0} note="Visible to buyers" icon={<Package size={16} />} /><Metric label="Work in progress" value={overview.data?.draftCount ?? 0} note="Ready when you are" icon={<Palette size={16} />} /><Metric label="Unread updates" value={overview.data?.unreadNotifications ?? 0} note="You are up to date" icon={<Bell size={16} />} /></div></section><section className="workspace-section dashboard-grid"><div className="panel"><h3>The next useful step</h3><div className="phase"><div className="phase-icon"><Sparkles size={17} /></div><div className="phase-text"><strong>{overview.data?.nextPhase}</strong><span>Coming in the next phase of KarigarAI.</span></div><ChevronRight size={17} className="muted" /></div><div className="phase"><div className="phase-icon"><Hand size={17} /></div><div className="phase-text"><strong>Your craft is the starting point</strong><span>No catalog work is needed in this foundation view.</span></div></div></div><div className="panel"><h3>System notes</h3>{status.isLoading ? <div className="skeleton" style={{ height: 76 }} /> : status.isError ? <p className="muted">System notes could not load.</p> : <><p className="muted" style={{ fontSize: '.81rem', lineHeight: 1.55, marginTop: 0 }}>{status.data?.tagline}</p><span className="pill"><Check size={13} /> {status.data?.authProvider ?? 'Safe access'}</span></>}</div></section></>}</main></div></div>;
}

function categoryIcon(category: Category) {
  const value = `${category.icon} ${category.name}`.toLowerCase();
  if (value.includes('text') || value.includes('weav')) return <Hand size={15} />;
  if (value.includes('metal') || value.includes('bell')) return <Sparkles size={15} />;
  if (value.includes('wood')) return <Leaf size={15} />;
  return <Palette size={15} />;
}

function ProductVisual({ product }: { product: MarketplaceProduct }) {
  const [failed, setFailed] = useState(false);
  return <div className="product-image">{product.status && <span className="status-tag">{product.status}</span>}{product.imageUrl && !failed ? <img src={product.imageUrl} alt={product.imageAlt ?? product.title} onError={() => setFailed(true)} data-testid={`img-product-${product.id}`} /> : <div className="product-fallback" aria-label={product.imageAlt ?? `${product.title} craft image`}><Factory size={42} strokeWidth={1.4} /></div>}</div>;
}

function Marketplace() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = useListCategories();
  const products = useListMarketplaceProducts({ search: search || undefined, category: selectedCategory || undefined, limit: 50 });
  const productList = products.data ?? [];
  return <div className="marketplace"><PublicNav /><main><section className="market-head"><div className="container-wide"><div className="market-head-row"><div><span className="eyebrow">Buyer discovery</span><h1 className="display">Made with a point of view.</h1><p>Find thoughtful work from independent Indian artisans, with the context to make a confident first conversation.</p></div><span className="market-note"><ShieldCheck size={16} /> Context-first discovery</span></div><div className="market-tools"><div className="search-wrap"><Search size={18} /><label className="visually-hidden" htmlFor="market-search">Search artisan work</label><input id="market-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search craft, place, or maker" data-testid="input-market-search" /></div><label className="visually-hidden" htmlFor="market-category">Filter by category</label><select id="market-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} data-testid="select-market-category"><option value="">All categories</option>{categories.data?.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></div><div className="category-strip" aria-label="Craft categories"><button className={`category-chip ${selectedCategory === '' ? 'selected' : ''}`} onClick={() => setSelectedCategory('')} data-testid="button-category-all"><Palette size={15} /> All work</button>{categories.isLoading ? [1, 2, 3].map((item) => <span className="skeleton" style={{ width: 100, height: 37, borderRadius: 999 }} key={item} />) : categories.data?.map((category) => <button className={`category-chip ${selectedCategory === category.id ? 'selected' : ''}`} key={category.id} onClick={() => setSelectedCategory(category.id)} data-testid={`button-category-${category.id}`}>{categoryIcon(category)} {category.name}<span style={{ opacity: .7 }}>{category.productCount}</span></button>)}</div></div></section><section className="market-results"><div className="container-wide"><div className="result-meta"><span><strong>{products.isLoading ? 'Finding' : productList.length}</strong> pieces to explore</span><span>Published artisan work</span></div>{products.isLoading ? <div className="product-grid">{[1, 2, 3].map((item) => <div className="product-card" key={item}><div className="skeleton" style={{ height: 220, borderRadius: 0 }} /><div style={{ padding: 17 }}><div className="skeleton" style={{ height: 22, width: '65%' }} /><div className="skeleton" style={{ height: 13, width: '42%', marginTop: 12 }} /></div></div>)}</div> : products.isError ? <ErrorState message="The marketplace is taking a short pause. Please try again." retry={products.refetch} /> : productList.length === 0 ? <div className="empty-box" data-testid="state-marketplace-empty"><Store size={29} color="hsl(var(--accent))" style={{ margin: '0 auto' }} /><p><strong>No work matches that search yet.</strong><br />Try another place, craft, or category.</p><button className="button button-quiet button-small" onClick={() => { setSearch(''); setSelectedCategory(''); }} data-testid="button-clear-filters">Clear filters</button></div> : <div className="product-grid">{productList.map((product) => <article className="product-card" key={product.id} data-testid={`card-product-${product.id}`}><ProductVisual product={product} /><div className="product-body"><h2 className="product-title">{product.title}</h2><p className="product-hindi">{product.titleHindi}</p><div className="product-info"><span className="product-maker">{product.artisanName}</span><span className="product-price">₹{product.price.toLocaleString('en-IN')}</span></div><div className="product-region"><MapPin size={13} /> {product.region} · {product.quantity} available</div></div></article>)}</div>}</div></section></main><PublicFooter /></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/login"><AuthPage mode="login" /></Route><Route path="/signup"><AuthPage mode="signup" /></Route><Route path="/demo" component={Demo} /><Route path="/artisan" component={Artisan} /><Route path="/buyer/marketplace" component={Marketplace} /><Route path="/marketplace" component={Marketplace} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;