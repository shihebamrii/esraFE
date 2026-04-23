"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Hash,
  Shield,
  Sparkles,
  ArrowLeft,
  Camera,
  LogOut,
  Phone,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Calendar,
  Heart,
  ShoppingBag,
  Download,
  ImageIcon,
  Upload,
  FileImage,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/media";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [stats, setStats] = useState({
    favorites: 0,
    orders: 0,
    downloads: 0,
    uploads: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    locale: "",
    password: "",
    newPassword: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        locale: user.locale || "",
        password: "",
        newPassword: ""
      });
      fetchStats();
    }
  }, [isAuthenticated, user, router, isEditing]);

  const fetchStats = async () => {
    try {
      const [favRes, ordersRes, downloadsRes] = await Promise.all([
        api.get('/favorites'),
        api.get('/orders/my-orders'),
        api.get('/downloads/my-downloads'),
      ]);
      setStats({
        favorites: favRes.data?.data?.favorites?.length || 0,
        orders: ordersRes.data?.data?.orders?.length || 0,
        downloads: downloadsRes.data?.data?.downloads?.length || 0,
        uploads: 0, // TODO: fetch user uploads when endpoint available
      });
    } catch (e) {
      // Silently fail, stats are not critical
    }
  };

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post('/auth/me/picture', formData);

      if (response.data.status === 'success') {
        toast.success('Profile picture updated!');
        // Update user in store with new picture
        updateUser({
          profilePictureFileId: response.data.data.profilePictureFileId,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getProfilePictureUrl = () => {
    if (user?.profilePictureFileId) {
      return `/api/media/${user.profilePictureFileId}`;
    }
    return null;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const payload: any = {};
      if (formData.name !== user.name) payload.name = formData.name;
      if (formData.email !== user.email) payload.email = formData.email;
      if (formData.phone !== user.phone) payload.phone = formData.phone;
      if (formData.locale !== user.locale) payload.locale = formData.locale;
      
      if (formData.password && formData.newPassword) {
        payload.password = formData.password;
        payload.newPassword = formData.newPassword;
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const response = await api.put("/auth/me", payload);
      
      if (response.data.status === "success") {
        toast.success("Profile updated successfully!");
        updateUser(response.data.data.user);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: "", newPassword: "" }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      setIsLoading(true);
      try {
        const response = await api.delete("/auth/me");
        if (response.data.status === "success") {
          toast.success("Account deleted successfully!");
          logout();
          router.push("/");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete account");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Background */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

        {/* Back Button */}
        <div className="absolute top-20 left-4 sm:left-8 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 max-w-2xl -mt-20 relative z-10 pb-16">
        {/* Avatar Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            {/* Hidden file input for profile picture */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />

            {/* Profile Picture */}
            <div
              className="h-32 w-32 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-violet-500/30 ring-4 ring-background cursor-pointer transition-transform group-hover:scale-105"
              onClick={handleProfilePictureClick}
            >
              {getProfilePictureUrl() ? (
                <img
                  src={getProfilePictureUrl()!}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}

              {/* Upload overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploadingPicture ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </div>

            {/* Upload button */}
            <button
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-violet-600 text-white shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors border-2 border-white"
              onClick={handleProfilePictureClick}
              disabled={isUploadingPicture}
            >
              {isUploadingPicture ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>

          <h1
            className="text-2xl font-bold mt-5"
            style={{
              animation: "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {user.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          <div
            className="flex items-center gap-1.5 mt-2"
            style={{
              animation: "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              animationDelay: "100ms",
              opacity: 0,
            }}
          >
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20">
              <Sparkles className="h-3 w-3" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Member
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div
          className="space-y-4"
          style={{
            animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "200ms",
            opacity: 0,
          }}
        >
          {/* Personal Information */}
          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-muted/30 flex justify-between items-center">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400">
                  <User className="h-3.5 w-3.5" />
                </span>
                Personal Information
              </h2>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  Full Name
                </label>
                <Input
                  name="name"
                  value={isEditing ? formData.name : user.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded-xl border-border/50 h-11 font-medium disabled:opacity-80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  value={isEditing ? formData.email : user.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded-xl border-border/50 h-11 font-medium disabled:opacity-80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  Phone Number
                </label>
                <Input
                  name="phone"
                  placeholder="Not provided"
                  value={isEditing ? formData.phone : user.phone || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded-xl border-border/50 h-11 font-medium disabled:opacity-80"
                />
              </div>

              {isEditing && (
                <>
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Change Password (Optional)</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="h-3 w-3" />
                          Current Password
                        </label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Your current password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="rounded-xl border-border/50 h-11 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="h-3 w-3" />
                          New Password
                        </label>
                        <Input
                          name="newPassword"
                          type="password"
                          placeholder="New password (min 8 chars)"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="rounded-xl border-border/50 h-11 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                Account Details
              </h2>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="h-3 w-3" />
                  Account ID
                </label>
                <Input
                  value={user.id}
                  disabled
                  className="rounded-xl bg-muted/30 border-border/50 h-11 font-mono text-xs disabled:opacity-80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  Role
                </label>
                <Input
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  disabled
                  className="rounded-xl bg-muted/30 border-border/50 h-11 font-medium disabled:opacity-80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border border-red-500/30 shadow-sm overflow-hidden bg-red-500/5">
            <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/10">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </h2>
            </div>
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Delete Account</h3>
                <p className="text-xs text-muted-foreground mt-1">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full sm:w-auto gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row gap-3 pt-2"
            style={{
              animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              animationDelay: "300ms",
              opacity: 0,
            }}
          >
            {isEditing ? (
              <>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 h-11 gap-2"
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 rounded-xl h-11 gap-2"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to real user data
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      locale: user.locale || "",
                      password: "",
                      newPassword: ""
                    });
                  }}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 h-11"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 h-11 gap-2 sm:w-auto"
              onClick={handleLogout}
              disabled={isEditing || isLoading}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
