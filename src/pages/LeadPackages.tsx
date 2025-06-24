
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Download, Trash2, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LeadPackage {
  id: string;
  package_name: string;
  search_query: string;
  lead_count: number;
  created_at: string;
}

const LeadPackages = () => {
  const [packages, setPackages] = useState<LeadPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<LeadPackage[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    if (user) {
      fetchPackages();
    }
  }, [user]);

  useEffect(() => {
    // Filter packages based on search input
    if (searchFilter.trim() === '') {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg =>
        pkg.package_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        pkg.search_query.toLowerCase().includes(searchFilter.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [packages, searchFilter]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lead_packages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPackages(data || []);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast({
        variant: "destructive",
        title: "Error loading packages",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePackage = async (packageId: string) => {
    try {
      const { error } = await supabase
        .from('lead_packages')
        .delete()
        .eq('id', packageId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Package deleted",
        description: "Lead package has been successfully deleted.",
      });

      fetchPackages();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast({
        variant: "destructive",
        title: "Error deleting package",
        description: error.message,
      });
    }
  };

  const downloadPackage = async (packageId: string, packageName: string) => {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('package_id', packageId)
        .eq('user_id', user?.id);

      if (error) throw error;

      if (!leads || leads.length === 0) {
        toast({
          variant: "destructive",
          title: "No leads found",
          description: "This package doesn't contain any leads.",
        });
        return;
      }

      // Convert to CSV
      const headers = ['Company Name', 'Contact Name', 'Email', 'Phone', 'Website', 'Industry', 'Score'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          lead.company_name,
          lead.contact_name || '',
          lead.email || '',
          lead.phone || '',
          lead.website || '',
          lead.industry || '',
          lead.score || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packageName}_leads.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${leads.length} leads downloaded successfully.`,
      });
    } catch (error: any) {
      console.error('Error downloading package:', error);
      toast({
        variant: "destructive",
        title: "Error downloading package",
        description: error.message,
      });
    }
  };

  const getPackageColor = (count: number) => {
    if (count === 0) return 'bg-red-50 text-red-700 border-red-200';
    if (count < 5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (count < 20) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading packages</h3>
          <p className="text-gray-600 font-light">Preparing your lead packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Lead Packages
          </h1>
          <p className="text-xl text-gray-600 font-light">Manage and download your saved lead collections.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Total Packages</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">{packages.length}</p>
                  <p className="text-sm text-green-600 font-medium">Saved collections</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Total Leads</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">
                    {packages.reduce((sum, pkg) => sum + pkg.lead_count, 0)}
                  </p>
                  <p className="text-sm text-green-600 font-medium">In all packages</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Avg per Package</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">
                    {packages.length > 0 ? Math.round(packages.reduce((sum, pkg) => sum + pkg.lead_count, 0) / packages.length) : 0}
                  </p>
                  <p className="text-sm text-green-600 font-medium">Quality leads</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Filter */}
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => navigate('/dashboard/search')}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Packages List */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-gray-900">
              Your Lead Packages
            </CardTitle>
            <p className="text-gray-500 font-light">Manage your saved lead collections</p>
          </CardHeader>
          <CardContent>
            {filteredPackages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-4">
                  {packages.length === 0 ? "No lead packages yet" : "No matches found"}
                </h3>
                <p className="text-gray-500 mb-8 font-light max-w-md mx-auto">
                  {packages.length === 0 
                    ? "Start searching for leads to create your first package"
                    : "Try adjusting your search filter"
                  }
                </p>
                {packages.length === 0 && (
                  <Button 
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 font-light transition-all duration-300" 
                    onClick={() => navigate('/dashboard/search')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Start Searching
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="font-medium text-gray-900 text-lg">
                          {pkg.package_name}
                        </h4>
                        <Badge className={`${getPackageColor(pkg.lead_count)} border font-light`}>
                          {pkg.lead_count} leads
                        </Badge>
                      </div>
                      <p className="text-gray-600 font-light mb-2">
                        Search: "{pkg.search_query}"
                      </p>
                      <p className="text-gray-500 font-light text-sm">
                        Created {format(new Date(pkg.created_at), 'PPp')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPackage(pkg.id, pkg.package_name)}
                        className="border-gray-200 hover:bg-gray-50 font-light"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePackage(pkg.id)}
                        className="border-red-200 hover:bg-red-50 text-red-600 font-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadPackages;
