
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Sparkles, Target, Brain, Zap, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

const LeadSearch = () => {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [leadCount, setLeadCount] = useState<number>(10);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { subscription, canGenerateLeads, canSavePackage, creditsRemaining, refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  // Allow access without subscription; credit enforcement handled via canGenerateLeads flag


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerateLeads) {
      toast({
        variant: "destructive",
        title: "Out of credits",
        description: "You've run out of credits. Purchase a new credit pack to continue generating leads.",
      });
      return;
    }
    
    // Validate requested lead count
    if (leadCount < 1 || leadCount > 100) {
      toast({
        variant: "destructive",
        title: "Invalid lead count",
        description: "Please choose between 1 and 100 leads per generation.",
      });
      return;
    }

    if (leadCount > creditsRemaining) {
      toast({
        variant: "destructive",
        title: "Not enough credits",
        description: `You only have ${creditsRemaining} credits left but requested ${leadCount} leads.`,
      });
      return;
    }
    
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Search query required",
        description: "Please enter a search query to find leads.",
      });
      return;
    }
    
    setIsSearching(true);
    setResults([]);
    setSelectedLeads(new Set());
    
    try {
      console.log('Starting lead search with query:', query);
      
      // Call the edge function for lead scraping
      const { data, error } = await supabase.functions.invoke('scrape-leads', {
        body: {
          query: query.trim(),
          industry,
          location,
          companySize,
          leadCount,
        }
      });
      
      console.log('Lead search response:', { data, error });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      const leads = data?.leads || [];
      setResults(leads);

      // Deduct used credits
      if (subscription) {
        const used = leads.length;
        await supabase
          .from('subscriptions')
          .update({ current_month_leads: subscription.current_month_leads + used })
          .eq('id', subscription.id);
        refreshSubscription();
      }
      
      // Save search to history
      try {
        if (user) {
          await supabase.from('search_history').insert({
            user_id: user.id,
            query: query.trim(),
            results_count: leads.length
          });
        }
      } catch (historyError) {
        console.error('Error saving search history:', historyError);
        // Don't fail the whole operation if history saving fails
      }
      
      toast({
        title: "🎉 Search completed!",
        description: `Found ${leads.length} high-quality leads for you.`,
      });
      
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: error.message || "Failed to search for leads. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleLeadSelection = (index: number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLeads(newSelected);
  };

  const saveAsPackage = async (leadsToSave: any[], packageName: string) => {
    if (!canSavePackage) {
      toast({
        variant: "destructive",
        title: "Storage limit reached",
        description: "You've reached your package storage limit. Upgrade your plan for more storage.",
      });
      return;
    }

    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to save leads.",
        });
        return;
      }

      // Create the lead package first
      const { data: packageData, error: packageError } = await supabase
        .from('lead_packages')
        .insert({
          user_id: user.id,
          package_name: packageName,
          search_query: query.trim(),
          lead_count: leadsToSave.length
        })
        .select()
        .single();

      if (packageError) throw packageError;

      // Then save the leads with the package_id
      const leadsWithPackageId = leadsToSave.map(lead => ({
        user_id: user.id,
        package_id: packageData.id,
        company_name: lead.company_name,
        contact_name: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        industry: lead.industry,
        score: lead.score || Math.floor(Math.random() * 30) + 70,
        status: 'new'
      }));
      
      const { error: leadsError } = await supabase
        .from('leads')
        .insert(leadsWithPackageId);
      
      if (leadsError) throw leadsError;
      
      toast({
        title: "✨ Package saved successfully!",
        description: `Created "${packageName}" with ${leadsToSave.length} leads.`,
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Save package error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message,
      });
      return false;
    }
  };

  const saveSelectedLeads = async () => {
    if (selectedLeads.size === 0) {
      toast({
        variant: "destructive",
        title: "No leads selected",
        description: "Please select at least one lead to save.",
      });
      return;
    }
    
    const leadsToSave = Array.from(selectedLeads).map(index => results[index]);
    const packageName = `${query.slice(0, 30)}... (${selectedLeads.size} leads)`;
    
    const success = await saveAsPackage(leadsToSave, packageName);
    if (success) {
      setSelectedLeads(new Set());
    }
  };

  const saveAllLeads = async () => {
    if (results.length === 0) return;
    
    const packageName = `${query.slice(0, 30)}... (${results.length} leads)`;
    
    const success = await saveAsPackage(results, packageName);
    if (success) {
      setResults([]);
      setSelectedLeads(new Set());
    }
  };

  const exampleQueries = [
    "SaaS startups in San Francisco with 10-50 employees",
    "E-commerce companies in New York looking for marketing automation",
    "Healthcare technology companies in California"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Pure minimalist header */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl font-light text-gray-900 mb-6 tracking-tight">
            Find. Connect. <span className="font-medium">Grow.</span>
          </h1>
          <p className="text-2xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            The most elegant way to discover your next customers
          </p>
          {subscription && (
            <div className="mt-8 flex justify-center gap-4 text-sm text-gray-600">
              <span className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                {creditsRemaining} credits left
              </span>
              <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {subscription.max_storage_packages - subscription.used_storage_packages} packages available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating search card */}
      <div className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.08)] border border-gray-100 p-12 backdrop-blur-xl">
            <form onSubmit={handleSearch} className="space-y-10">
              <div className="space-y-4">
                <Label htmlFor="query" className="text-lg font-medium text-gray-900 block">
                  Describe your ideal customer
                </Label>
                <Textarea
                  id="query"
                  placeholder="Companies that would benefit from our solution..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 text-lg border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-gray-900 focus:ring-0 resize-none placeholder:text-gray-400 font-light"
                  required
                />
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="text-sm text-gray-400 font-medium">Quick examples:</span>
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setQuery(example)}
                      className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="font-medium text-gray-900">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-gray-900 h-12">
                      <SelectValue placeholder="Any industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium text-gray-900">Location</Label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-gray-900 h-12 placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-medium text-gray-900">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-gray-900 h-12">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <Label className="font-medium text-gray-900">Number of Leads (1-100)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={leadCount}
                  onChange={(e) => setLeadCount(Number(e.target.value))}
                  className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-gray-900 h-12 placeholder:text-gray-400"
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg py-6 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isSearching || !canGenerateLeads}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Discovering prospects...
                    </>
                  ) : !canGenerateLeads ? (
                    <>
                      <Search className="mr-3 h-5 w-5" />
                      Out of Credits
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5" />
                      Find Prospects
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results section */}
      {results.length > 0 && (
        <div className="px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
              <div className="p-12 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">
                      Found {results.length} prospects
                    </h2>
                    <p className="text-gray-500 font-light">Ready for your outreach</p>
                  </div>
                  <div className="flex gap-3">
                    {selectedLeads.size > 0 && (
                      <Button 
                        onClick={saveSelectedLeads} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                        disabled={!canSavePackage}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Package ({selectedLeads.size})
                      </Button>
                    )}
                    <Button 
                      onClick={saveAllLeads} 
                      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-300"
                      disabled={!canSavePackage}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Save All as Package
                    </Button>
                  </div>
                </div>
                {!canSavePackage && (
                  <p className="text-amber-600 text-sm mt-2">
                    Package storage limit reached. Upgrade for more storage.
                  </p>
                )}
              </div>
              
              <div className="p-12 space-y-8">
                {results.map((lead, index) => (
                  <div 
                    key={index} 
                    className={`border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      selectedLeads.has(index) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50/30'
                    }`}
                    onClick={() => toggleLeadSelection(index)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(index)}
                          onChange={() => toggleLeadSelection(index)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <h3 className="text-2xl font-medium text-gray-900 mb-2">{lead.company_name}</h3>
                          {lead.industry && (
                            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full font-medium">
                              {lead.industry}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium text-lg">
                          {lead.score || Math.floor(Math.random() * 30) + 70}%
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Match score</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                      {lead.contact_name && (
                        <div>
                          <span className="font-medium text-gray-900">Contact: </span>
                          {lead.contact_name}
                        </div>
                      )}
                      {lead.email && (
                        <div>
                          <span className="font-medium text-gray-900">Email: </span>
                          <a href={`mailto:${lead.email}`} className="text-gray-900 hover:underline">
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {lead.phone && (
                        <div>
                          <span className="font-medium text-gray-900">Phone: </span>
                          <a href={`tel:${lead.phone}`} className="text-gray-900 hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                      {lead.website && (
                        <div>
                          <span className="font-medium text-gray-900">Website: </span>
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                            {lead.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {lead.description && (
                      <div className="mt-6 p-6 bg-white rounded-xl">
                        <p className="text-gray-700 font-light leading-relaxed">{lead.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadSearch;
