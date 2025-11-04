'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './landing/landing.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to app if user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: '🎨',
      title: 'AI-Powered Generation',
      description: 'Create stunning images using Google\'s Gemini 2.5 Flash model with natural language prompts'
    },
    {
      icon: '👔',
      title: 'Virtual Try-On',
      description: 'Revolutionary try-on technology for realistic clothing visualization'
    },
    {
      icon: '🔢',
      title: 'Batch Processing',
      description: 'Generate up to 4 high-quality images simultaneously to save time'
    },
    {
      icon: '🎭',
      title: 'Style Presets',
      description: '6 professional style options from realistic to artistic rendering'
    },
    {
      icon: '📏',
      title: 'Flexible Ratios',
      description: 'Choose from 6 aspect ratios perfect for any platform or use case'
    },
    {
      icon: '💾',
      title: 'Smart History',
      description: 'Automatic saving, searching, and organizing of all your generations'
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '0',
      period: 'Forever Free',
      features: ['50 images/month', 'Basic styles', 'Standard quality', 'Email support'],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '29',
      period: 'per month',
      features: ['Unlimited images', 'All style presets', 'HD quality', 'Virtual Try-On', 'Batch generation', 'Priority support'],
      cta: 'Start Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'per month',
      features: ['Everything in Pro', 'API access', 'Custom models', 'Dedicated support', 'SLA guarantee', 'White-label option'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo">
              <span className="logo-icon">🎨</span>
              <span className="logo-text">AI Image Gen Pro</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="nav-menu">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#about" className="nav-link">About</a>
              <Link href="/login" className="nav-button-outline">
                Sign In
              </Link>
              <Link href="/signup" className="nav-button-filled">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <a href="#features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</a>
              <Link href="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/signup" className="mobile-button">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                NEW: Virtual Try-On Technology
              </div>
              <h1 className="hero-title">
                Generate Stunning Images with
                <span className="hero-gradient"> AI Magic</span>
              </h1>
              <p className="hero-subtitle">
                Transform your ideas into professional-quality images using state-of-the-art
                Gemini AI. No design skills required.
              </p>
              <div className="hero-cta">
                <Link href="/signup" className="cta-primary">
                  Start Creating Free
                  <span className="cta-arrow">→</span>
                </Link>
                <a href="#features" className="cta-secondary">
                  Explore Features
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Images Generated</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Style Presets</div>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="screenshot-frame">
                <div className="screenshot-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="screenshot-body">
            <Image src="https://picsum.photos/id/1069/1200/800"
                    alt="AI Generated Artwork"
                    width={1200}
                    height={800}
                    className="screenshot-img"
                    priority
                  />
                </div>
              </div>
              <div className="hero-float-cards">
                <div className="float-card">
                  <span>⚡ Fast Generation</span>
                </div>
                <div className="float-card">
                  <span>🧠 Smart Presets</span>
                </div>
                <div className="float-card">
                  <span>👔 Virtual Try-On</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trustbar-section">
        <div className="trustbar-container">
          <p className="trustbar-title">Trusted by creators and teams at</p>
          <div className="trustbar-logos">
            <img src="https://dummyimage.com/120x32/000/fff&text=ACME" alt="ACME" />
            <img src="https://dummyimage.com/120x32/000/fff&text=NOVA" alt="NOVA" />
            <img src="https://dummyimage.com/120x32/000/fff&text=PIXEL" alt="PIXEL" />
            <img src="https://dummyimage.com/120x32/000/fff&text=OMEGA" alt="OMEGA" />
            <img src="https://dummyimage.com/120x32/000/fff&text=VIBE" alt="VIBE" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to create professional AI-generated imagery
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
          {/* Use Cases */}
          <div className="usecases">
            <div className="usecase-card">
              <Image src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=60" alt="Marketing visuals" width={900} height={600} />
              <div className="usecase-content">
                <h3>Marketing Visuals</h3>
                <p>Create campaign-ready visuals in minutes with brand-safe presets.</p>
              </div>
            </div>
            <div className="usecase-card">
              <Image src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=60" alt="Product shots" width={900} height={600} />
              <div className="usecase-content">
                <h3>Product Shots</h3>
                <p>Generate studio-quality scenes for ecommerce and ads.</p>
              </div>
            </div>
            <div className="usecase-card">
              <Image src="https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=60" alt="Concept art" width={900} height={600} />
              <div className="usecase-content">
                <h3>Concept Art</h3>
                <p>Explore styles and iterate faster with guided prompts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <div className="section-container">
          <div className="showcase-grid">
            <div className="showcase-content">
              <div className="showcase-badge">Image-to-Image</div>
              <h2 className="showcase-title">Transform Your Vision</h2>
              <p className="showcase-text">
                Upload reference images and let AI reimagine them in any style. Perfect for 
                creating variations, editing, or exploring creative possibilities.
              </p>
              <ul className="showcase-list">
                <li>🔤 High-fidelity text rendering</li>
                <li>💬 Natural language descriptions</li>
                <li>⛔ Negative prompt control</li>
                <li>📊 Real-time progress tracking</li>
              </ul>
              <Link href="/signup" className="showcase-cta">
                Try Image-to-Image
              </Link>
            </div>
            <div className="showcase-visual">
              <div className="showcase-card card-1">
                <div className="card-header">Original</div>
                <div className="card-placeholder" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <span className="placeholder-icon">🖼️</span>
                </div>
              </div>
              <div className="showcase-card card-2">
                <div className="card-header">AI Enhanced</div>
                <div className="card-placeholder" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <span className="placeholder-icon">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the plan that fits your creative needs
            </p>
          </div>
          <div className="pricing-grid">
            {pricing.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="pricing-header">
                  <h3 className="pricing-name">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{plan.price}</span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="pricing-feature">
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`pricing-cta ${plan.popular ? 'cta-popular' : ''}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Loved by Creators</h2>
            <p className="section-subtitle">What our users are saying</p>
          </div>
          <div className="testimonials-marquee">
            <div className="marquee-track">
              <div className="testimonial">
                <img src="https://i.pravatar.cc/56?img=12" alt="avatar" />
                <p>“The fastest way we produce ad creatives now. Quality is insane.”</p>
                <span>— Maya, Growth Marketer</span>
              </div>
              <div className="testimonial">
                <img src="https://i.pravatar.cc/56?img=22" alt="avatar" />
                <p>“Our design iteration time dropped from days to hours.”</p>
                <span>— Liam, Product Designer</span>
              </div>
              <div className="testimonial">
                <img src="https://i.pravatar.cc/56?img=32" alt="avatar" />
                <p>“Virtual Try-On is a game changer for our store.”</p>
                <span>— Aisha, Ecommerce Lead</span>
              </div>
              <div className="testimonial">
                <img src="https://i.pravatar.cc/56?img=42" alt="avatar" />
                <p>“Looks like a full studio shoot without the cost.”</p>
                <span>— Ben, Content Creator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section">
        <div className="section-container">
          <div className="gallery-grid">
            <Image src="https://images.unsplash.com/photo-1517817748493-49ec54a32465?auto=format&fit=crop&w=800&q=60" alt="Gallery 1" width={800} height={1000} />
            <Image src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60" alt="Gallery 2" width={800} height={1000} />
            <Image src="https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=800&q=60" alt="Gallery 3" width={800} height={1000} />
            <Image src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=800&q=60" alt="Gallery 4" width={800} height={1000} />
            <Image src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=800&q=60" alt="Gallery 5" width={800} height={1000} />
            <Image src="https://picsum.photos/id/1025/800/1000" alt="Gallery 6" width={800} height={1000} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item" open>
              <summary>Is there a free plan?</summary>
              <p>Yes, our Starter plan includes 50 images/month. No credit card required.</p>
            </details>
            <details className="faq-item">
              <summary>Can I use the images commercially?</summary>
              <p>Yes, you have full commercial rights to images you generate.</p>
            </details>
            <details className="faq-item">
              <summary>Do you support team accounts?</summary>
              <p>Our Enterprise plan includes team management and SSO options.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Amazing Images?</h2>
            <p className="cta-text">
              Join thousands of creators using AI Image Gen Pro to bring their ideas to life
            </p>
            <div className="cta-buttons">
              <Link href="/signup" className="cta-button-primary">
                Get Started Free
              </Link>
              <a href="#pricing" className="cta-button-secondary">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🎨</span>
                <span className="logo-text">AI Image Gen Pro</span>
              </div>
              <p className="footer-tagline">
                Professional AI image generation powered by Google Gemini
              </p>
            </div>
            <div className="footer-links">
              <h4 className="footer-heading">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#pricing" className="footer-link">Pricing</a>
              <Link href="/signup" className="footer-link">Sign Up</Link>
            </div>
            <div className="footer-links">
              <h4 className="footer-heading">Resources</h4>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API</a>
              <a href="#" className="footer-link">Blog</a>
            </div>
            <div className="footer-links">
              <h4 className="footer-heading">Company</h4>
              <a href="#about" className="footer-link">About</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Privacy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 AI Image Gen Pro. Built with ❤️ using Next.js and Google Gemini
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
