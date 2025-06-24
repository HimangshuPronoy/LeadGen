
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: " one-time",
      description: "Perfect for small businesses getting started",
      features: [
        "500 lead generations per month",
        "Save up to 15 lead packages",
        "AI-powered search",
        "Email export",
        "Basic support"
      ],
      popular: false,
      planType: "basic"
    },
    {
      name: "Premium", 
      price: "$49",
      period: " one-time",
      description: "For growing businesses that need more leads",
      features: [
        "Unlimited lead generations per month",
        "Save up to 30 lead packages", 
        "Advanced AI targeting",
        "Multiple export formats",
        "Priority support",
        "Analytics dashboard"
      ],
      popular: true,
      planType: "premium"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <section className="section-padding text-center">
        <div className="container-max">
          <h1 className="text-display font-light text-gray-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto font-light">
            Choose the plan that fits your business. One-time payment, lifetime access.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative feature-card ${plan.popular ? 'ring-2 ring-gray-900 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl font-medium text-gray-900 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-light text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 font-light">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 font-light">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-gray-900 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <Button 
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        plan.popular 
                          ? 'accent-gradient text-white shadow-lg hover:shadow-xl' 
                          : 'btn-minimal'
                      }`}
                    >
                      Get started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Upgrade Notice (Subtle) */}
      <section className="pb-20">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-gray-500 font-light">
              Need more storage? Additional packages available when needed.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-headline font-light text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: "How does lead generation work?",
                answer: "Our AI analyzes millions of data points to find prospects that match your criteria. Basic plan includes 500 generations per month, Premium includes unlimited."
              },
              {
                question: "What are lead packages?",
                answer: "Save your search results as organized packages for easy access later. Basic plan can save 15 packages, Premium can save 30 packages."
              },
              {
                question: "Is this a one-time payment?",
                answer: "Yes! Pay once and get lifetime access to your chosen plan. No recurring fees or subscriptions."
              },
              {
                question: "What if I need more storage?",
                answer: "If you reach your package limit, you can purchase additional storage for $14.99 (200 packages) or delete old packages to make room."
              }
            ].map((faq, index) => (
              <Card key={index} className="feature-card">
                <CardContent className="p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{faq.question}</h3>
                  <p className="text-gray-700 font-light leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-max text-center">
          <h2 className="text-headline font-light text-gray-900 mb-6">
            Ready to start finding prospects?
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light">
            Join thousands of companies already growing with AI-powered lead generation.
          </p>
          <Link to="/auth">
            <Button className="accent-gradient text-white text-lg px-12 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              Start your free trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
