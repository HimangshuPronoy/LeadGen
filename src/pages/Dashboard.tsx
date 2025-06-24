
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Search, Users, TrendingUp, Plus, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalLeads: number;
  leadPackages: number;
  monthlySearches: number;
  avgLeadsPerPackage: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, createPayment, refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    leadPackages: 0,
    monthlySearches: 0,
    avgLeadsPerPackage: 0
  });
  const [loading, setLoading] = useState(true);

  // Check for payment success/failure in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const planType = urlParams.get('plan');

    if (paymentStatus === 'success' && planType) {
      toast({
        title: "Payment Successful!",
        description: `Your ${planType} plan has been activated.`,
      });
      refreshSubscription();
      window.history.replaceState({}, '', '/dashboard');
    } else if (paymentStatus === 'cancelled') {
      toast({
        variant: "destructive",
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
      });
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [toast, refreshSubscription]);

  // Fetch real dashboard stats
  useEffect(() => {
    if (user && subscription) {
      fetchDashboardStats();
    }
  }, [user, subscription]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Get total leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get lead packages count
      const { count: leadPackages } = await supabase
        .from('lead_packages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get monthly searches (current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlySearches } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .gte('created_at', startOfMonth.toISOString());

      // Calculate average leads per package
      const { data: packagesWithCounts } = await supabase
        .from('lead_packages')
        .select('lead_count')
        .eq('user_id', user?.id);

      const avgLeadsPerPackage = packagesWithCounts && packagesWithCounts.length > 0
        ? Math.round(packagesWithCounts.reduce((sum, pkg) => sum + (pkg.lead_count || 0), 0) / packagesWithCounts.length)
        : 0;

      setStats({
        totalLeads: totalLeads || 0,
        leadPackages: leadPackages || 0,
        monthlySearches: monthlySearches || 0,
        avgLeadsPerPackage
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSubscription = async () => {
    try {
      await createPayment('basic');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
      });
    }
  };

  const statsData = [
    {
      title: "Total Leads",
      value: loading ? "..." : stats.totalLeads.toString(),
      icon: Users,
      change: stats.totalLeads > 0 ? `${stats.totalLeads} leads generated` : "Start generating leads"
    },
    {
      title: "Lead Packages",
      value: loading ? "..." : `${stats.leadPackages}${subscription ? `/${subscription.max_storage_packages}` : ""}`,
      icon: Package,
      change: subscription ? `${subscription.max_storage_packages - stats.leadPackages} remaining` : "No subscription"
    },
    {
      title: "Monthly Searches",
      value: loading ? "..." : (subscription ? (subscription.leads_per_month === -1 ? "Unlimited" : `${stats.monthlySearches}/${subscription.leads_per_month}`) : "0"),
      icon: Search,
      change: subscription?.plan_type === 'premium' ? "Unlimited searches" : "Monthly limit"
    },
    {
      title: "Success Rate",
      value: loading ? "..." : stats.avgLeadsPerPackage > 0 ? `${Math.min(Math.round(stats.avgLeadsPerPackage * 2), 100)}%` : "0%",
      icon: TrendingUp,
      change: stats.avgLeadsPerPackage > 0 ? "Quality score" : "No packages yet"
    }
  ];

  // If no subscription, show upgrade prompt
  if (!subscription) {
    return (
      <div className="p-8 space-y-8">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Subscription Required
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You need an active subscription to access the dashboard and start generating leads.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleGetSubscription}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Get Basic Plan ($49)
            </Button>
            <Button 
              onClick={() => createPayment('premium')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Get Premium Plan ($69)
            </Button>
          </div>
          <div className="mt-8">
            <Link to="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
              View pricing details →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your lead generation today.
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">Active Subscription</h3>
              <p className="text-green-700 capitalize">{subscription.plan_type} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">
                {subscription.leads_per_month === -1 ? 'Unlimited' : subscription.leads_per_month} leads/month
              </p>
              <p className="text-sm text-green-600">
                {subscription.max_storage_packages} storage packages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-gray-600" />
              Find New Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 font-light">
              Search for potential customers using our AI-powered lead generation.
            </p>
            <Link to="/dashboard/search">
              <Button className="w-full btn-minimal">
                Start Search
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-600" />
              View Lead Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 font-light">
              Access your saved lead packages and download contact information.
            </p>
            <Link to="/dashboard/packages">
              <Button className="w-full btn-minimal">
                View Packages
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-600" />
              All Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 font-light">
              Browse all your generated leads and manage your contacts.
            </p>
            <Link to="/dashboard/leads">
              <Button className="w-full btn-minimal">
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
