'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import './landing.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <ThemeToggle />
              <Link href="/" className="nav-button-outline">
                Try Demo
              </Link>
              <Link href="/" className="nav-button-filled">
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
              <Link href="/" className="mobile-button">
                Try Demo
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
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
            <Link href="/" className="cta-primary">
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
              <Link href="/" className="showcase-cta">
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
                <Link href="/" className={`pricing-cta ${plan.popular ? 'cta-popular' : ''}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
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
              <Link href="/" className="cta-button-primary">
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
              <Link href="/" className="footer-link">Demo</Link>
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
