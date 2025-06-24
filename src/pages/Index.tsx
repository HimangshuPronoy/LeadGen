
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Search, 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Discovery",
      description: "Advanced algorithms find prospects that match your ideal customer profile with 95% accuracy."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get qualified leads in seconds, not hours. Our platform processes millions of data points instantly."
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "All data sourcing and processing meets strict privacy regulations and compliance standards."
    }
  ];

  const stats = [
    { value: "10M+", label: "Verified Contacts" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "2.3x", label: "More Conversions" },
    { value: "50+", label: "Industries" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-8 bg-gray-100 text-gray-700 border-0 px-6 py-2 text-sm font-medium">
            <Star className="h-4 w-4 mr-2" />
            Trusted by 1000+ sales teams
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
            Find your next
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              customer
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            AI-powered lead generation that finds high-quality prospects in seconds. 
            Stop wasting time on cold outreach that doesn't convert.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Finding Leads
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-2xl font-medium">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Why teams choose LeadGenAI
            </h2>
            <p className="text-xl text-gray-600 font-light">
              The most advanced lead generation platform built for modern sales teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-light text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Ready to 10x your pipeline?
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Join thousands of sales teams already using LeadGenAI to close more deals.
          </p>
          
          <Link to="/auth">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Free 14-day trial
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white"></div>
                <div className="relative z-10">
                  <Brain className="h-5 w-5 text-gray-900" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-light">LeadGenAI</span>
            </div>
            
            <div className="flex space-x-8 text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LeadGenAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
