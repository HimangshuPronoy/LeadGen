
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Sparkles, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Welcome back",
          description: "You've been successfully signed in.",
        });
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "You must accept both Terms of Service and Privacy Policy to create an account.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      
      {/* Subtle animated elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gray-900/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gray-900/5 rounded-full animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-8">
          {/* Upgraded Logo */}
          <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div className="relative z-10">
              <Brain className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </div>
          
          <CardTitle className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
            {isSignUp ? 'Join LeadGenAI' : 'Welcome Back'}
          </CardTitle>
          <p className="text-gray-600 text-lg font-light">
            {isSignUp ? 'Start generating leads with precision' : 'Continue your growth journey'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-900 font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 text-gray-900 text-lg py-3 focus:border-gray-900 transition-colors"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50/50 border-gray-200 text-gray-900 text-lg py-3 focus:border-gray-900 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 text-gray-900 text-lg py-3 pr-12 focus:border-gray-900 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700">
                    I accept the{' '}
                    <a href="/terms" className="text-gray-900 hover:underline font-medium">
                      Terms of Service
                    </a>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptedPrivacy}
                    onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="privacy" className="text-sm text-gray-700">
                    I accept the{' '}
                    <a href="/privacy" className="text-gray-900 hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gray-900 text-white text-lg py-4 hover:bg-gray-800 transition-all shadow-lg rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <Brain className="mr-3 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Join now"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
