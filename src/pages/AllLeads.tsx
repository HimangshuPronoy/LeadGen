
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Mail, Phone, Globe, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  score: number | null;
  status: string | null;
  created_at: string;
}

const AllLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAllLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, industryFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const fetchAllLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        variant: "destructive",
        title: "Error fetching leads",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.contact_name && lead.contact_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.industry && lead.industry.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter(lead => lead.industry === industryFilter);
    }

    setFilteredLeads(filtered);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'converted': return 'bg-green-50 text-green-700 border-green-200';
      case 'qualified': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'new': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const uniqueIndustries = [...new Set(leads.map(lead => lead.industry).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <h3 className="text-xl font-light text-black mb-2">Loading leads</h3>
          <p className="text-gray-500 font-light">Fetching your prospects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-black mb-4 tracking-tight">
            All Leads
          </h1>
          <p className="text-xl text-gray-500 font-light">
            Manage and track all your prospects
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies, contacts, or industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-black"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 border-gray-200 focus:border-black">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full md:w-48 border-gray-200 focus:border-black">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {uniqueIndustries.map(industry => (
                    <SelectItem key={industry} value={industry!}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Leads</p>
                  <p className="text-2xl font-light text-black">{leads.length}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">New</p>
                  <p className="text-2xl font-light text-black">
                    {leads.filter(lead => lead.status === 'new').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contacted</p>
                  <p className="text-2xl font-light text-black">
                    {leads.filter(lead => lead.status === 'contacted').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Converted</p>
                  <p className="text-2xl font-light text-black">
                    {leads.filter(lead => lead.status === 'converted').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-black">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-light text-black mb-2">No leads found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || statusFilter !== "all" || industryFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Start by finding some prospects"}
                </p>
                {!searchQuery && statusFilter === "all" && industryFilter === "all" && (
                  <Button 
                    onClick={() => navigate('/dashboard/search')}
                    className="bg-black hover:bg-gray-800 text-white font-light px-6 py-2"
                  >
                    Find Prospects
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-light text-black group-hover:text-gray-600 transition-colors">
                            {lead.company_name}
                          </h3>
                          {lead.industry && (
                            <Badge className="bg-gray-100 text-gray-700 border-0 font-light">
                              {lead.industry}
                            </Badge>
                          )}
                          <Badge className={`border font-light ${getStatusColor(lead.status)}`}>
                            {lead.status || 'new'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          {lead.contact_name && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {lead.contact_name}
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${lead.email}`} className="hover:text-black transition-colors">
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${lead.phone}`} className="hover:text-black transition-colors">
                                {lead.phone}
                              </a>
                            </div>
                          )}
                          {lead.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <a 
                                href={lead.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-black transition-colors"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-light text-black">
                            {lead.score || 87}%
                          </div>
                          <p className="text-xs text-gray-500">Match</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                      </div>
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

export default AllLeads;
