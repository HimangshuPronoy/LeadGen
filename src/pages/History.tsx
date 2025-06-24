
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, TrendingUp, Filter, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SearchHistoryItem {
  id: string;
  query: string;
  results_count: number;
  created_at: string;
}

const History = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
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
      fetchSearchHistory();
    }
  }, [user]);

  useEffect(() => {
    // Filter search history based on search input
    if (searchFilter.trim() === '') {
      setFilteredHistory(searchHistory);
    } else {
      const filtered = searchHistory.filter(item =>
        item.query.toLowerCase().includes(searchFilter.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchHistory, searchFilter]);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSearchHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching search history:', error);
      toast({
        variant: "destructive",
        title: "Error loading history",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultsColor = (count: number) => {
    if (count === 0) return 'bg-red-50 text-red-700 border-red-200';
    if (count < 5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (count < 20) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const runSearchAgain = (query: string) => {
    navigate('/dashboard/search', { state: { prefillQuery: query } });
  };

  const totalSearches = searchHistory.length;
  const totalResults = searchHistory.reduce((sum, item) => sum + item.results_count, 0);
  const avgResults = totalSearches > 0 ? Math.round(totalResults / totalSearches) : 0;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading history</h3>
          <p className="text-gray-600 font-light">Preparing your search data...</p>
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
            Search History
          </h1>
          <p className="text-xl text-gray-600 font-light">Track your lead discovery journey and insights.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Total Searches</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">{totalSearches}</p>
                  <p className="text-sm text-green-600 font-medium">All time</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Total Results</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">{totalResults}</p>
                  <p className="text-sm text-green-600 font-medium">Leads found</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Avg per Search</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">{avgResults}</p>
                  <p className="text-sm text-green-600 font-medium">Quality results</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
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
                  placeholder="Search your history..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search History */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-gray-900">
              Recent Searches
            </CardTitle>
            <p className="text-gray-500 font-light">Your search queries and results</p>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-4">
                  {searchHistory.length === 0 ? "No search history yet" : "No matches found"}
                </h3>
                <p className="text-gray-500 mb-8 font-light max-w-md mx-auto">
                  {searchHistory.length === 0 
                    ? "Start searching for leads to see your history here"
                    : "Try adjusting your search filter"
                  }
                </p>
                {searchHistory.length === 0 && (
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
                {filteredHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="font-light text-gray-900 text-lg max-w-2xl">
                          "{item.query}"
                        </h4>
                        <Badge className={`${getResultsColor(item.results_count)} border font-light`}>
                          {item.results_count} results
                        </Badge>
                      </div>
                      <p className="text-gray-500 font-light text-sm">
                        {format(new Date(item.created_at), 'PPpp')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50 font-light"
                      onClick={() => runSearchAgain(item.query)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Again
                    </Button>
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

export default History;
