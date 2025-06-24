
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Bell, Shield, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setEmail(data.email || user?.email || '');
      } else if (user) {
        // Create profile if doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;

        setProfile(createdProfile);
        setFullName(createdProfile.full_name || '');
        setEmail(createdProfile.email || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user data first
      await supabase.from('leads').delete().eq('user_id', user?.id);
      await supabase.from('search_history').delete().eq('user_id', user?.id);
      await supabase.from('profiles').delete().eq('id', user?.id);

      toast({
        title: "Account deleted",
        description: "Your account and all data have been deleted.",
      });

      await signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error deleting account",
        description: error.message,
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading settings</h3>
          <p className="text-gray-600 font-light">Preparing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-xl text-gray-600 font-light">Manage your account and preferences.</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-light text-gray-900">
                    Profile Information
                  </CardTitle>
                  <p className="text-gray-500 font-light">Update your personal details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-900 font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-50/50 border-gray-200 text-gray-900"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50/50 border-gray-200 text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 font-light"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Account Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-light text-gray-900">
                    Notifications
                  </CardTitle>
                  <p className="text-gray-500 font-light">Control your notification preferences</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500 font-light">Receive notifications about new leads and updates</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                  <p className="text-sm text-gray-500 font-light">Receive tips, updates, and promotional content</p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-light text-gray-900">
                    Account Security
                  </CardTitle>
                  <p className="text-gray-500 font-light">Manage your account security and data</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sign Out</h4>
                  <p className="text-sm text-gray-500 font-light">Sign out of your account on this device</p>
                </div>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="border-gray-200 hover:bg-gray-50 font-light"
                >
                  Sign Out
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-600 font-light">Permanently delete your account and all data</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 font-light"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
