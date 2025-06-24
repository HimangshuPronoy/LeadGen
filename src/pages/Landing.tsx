
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Star, Users, Zap, Target, Search, Database, Download, ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      title: "AI-Powered Discovery",
      description: "Advanced algorithms find your perfect prospects with precision and speed.",
      icon: Search
    },
    {
      title: "Instant Results",
      description: "Generate hundreds of qualified leads in seconds, not hours or days.",
      icon: Zap
    },
    {
      title: "Rich Data Insights",
      description: "Complete prospect profiles with contact information and lead scoring.",
      icon: Database
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Define Your Criteria",
      description: "Tell our AI exactly what type of customers you're looking for"
    },
    {
      step: "02", 
      title: "AI Searches & Analyzes",
      description: "Our algorithms scan millions of data points to find perfect matches"
    },
    {
      step: "03",
      title: "Export & Connect",
      description: "Download qualified leads and start converting prospects into customers"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      content: "The most elegant lead generation tool I've ever used. It just works.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Sales Director, Growth Co",
      content: "Tripled our conversion rate in the first month. Incredible precision.",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Marketing Lead, Scale Inc",
      content: "Beautiful interface, powerful results. This is the future of sales.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How accurate are the leads generated?",
      answer: "Our AI maintains a 95% accuracy rate by cross-referencing multiple data sources and continuously learning from feedback."
    },
    {
      question: "What types of businesses can I find?",
      answer: "From startups to enterprises across all industries. Our database covers millions of companies worldwide with detailed filtering options."
    },
    {
      question: "How quickly can I get results?",
      answer: "Most searches complete within seconds. You can generate and download hundreds of qualified leads in under a minute."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial with no credit card required. Cancel anytime if you're not satisfied."
    },
    {
      question: "How does pricing work?",
      answer: "We offer simple monthly plans based on your lead generation needs. No hidden fees, no setup costs, just transparent pricing."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy customers" },
    { value: "2.5M+", label: "Leads generated" },
    { value: "95%", label: "Accuracy rate" },
    { value: "10x", label: "Faster results" }
  ];

  const brands = [
    "TechStart", "Growth Co", "Scale Inc", "Venture Labs", "Digital Corp", "Sales Pro"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container-max section-padding text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full text-sm mb-12 border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-gray-700 font-medium">Trusted by 10,000+ companies worldwide</span>
            </div>
            
            <h1 className="text-hero font-light text-gray-900 mb-8 tracking-tight max-w-5xl mx-auto">
              Find customers who
              <span className="block font-medium text-shimmer">actually want your product</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              The most sophisticated lead generation platform ever built. 
              <span className="font-medium"> AI that understands your business</span> and finds prospects that convert.
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="text-3xl md:text-4xl font-light text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/auth" className="flex-1">
                <Button className="w-full accent-gradient text-white text-lg py-6 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Start finding leads
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing" className="flex-1">
                <Button variant="outline" className="w-full btn-minimal text-lg py-6 rounded-2xl">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-16 bg-gray-50">
        <div className="container-max">
          <p className="text-center text-gray-500 mb-12 font-light">Trusted by leading companies</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {brands.map((brand, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-display font-light text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Three simple steps to transform your lead generation process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-6xl font-light text-gray-200 mb-6">{step.step}</div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-12 -right-6 h-6 w-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-display font-light text-gray-900 mb-6">
              Everything you need to find and convert leads
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Designed for modern sales teams who value quality over quantity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="text-display font-light text-gray-900 mb-6">
              Loved by teams at leading companies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              See what industry leaders are saying about our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-900 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed font-light text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-medium mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="text-display font-light text-gray-900 mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Everything you need to know about our platform
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full py-6 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="pb-6 text-gray-600 font-light leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-max text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-display font-light text-gray-900 mb-6">
              Ready to transform your sales process?
            </h2>
            <p className="text-xl text-gray-600 mb-12 font-light max-w-2xl mx-auto">
              Join thousands of companies already using AI to find their next customers. 
              Start your journey today.
            </p>
            <Link to="/auth">
              <Button className="accent-gradient text-white text-xl py-6 px-12 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                Get started for free
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-6 font-light">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container-max py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-6">LeadGenAI</h3>
              <p className="text-gray-400 font-light mb-6">
                AI-powered lead generation for modern sales teams.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-light">
              © 2024 LeadGenAI. All rights reserved.
            </p>
            <p className="text-gray-400 font-light mt-4 md:mt-0">
              Made with ❤️ for sales teams everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
