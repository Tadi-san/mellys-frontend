"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { api } from "@/utils/index.api";
import { getUser, isAuthenticated } from "@/utils/auth";
import { toast } from "@/components/ui/use-toast";
import LoginModal from "@/components/auth/LoginModal";
import ProfileEditForm from "@/components/ProfileEditForm";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
    } else {
      const currentUser = getUser();
      setUser(currentUser);
      fetchUserData(currentUser?.id);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      const [profileData, ordersData] = await Promise.all([
        api.getUserProfile(userId),
        api.getUserOrders(userId)
      ]);
      
      setUserProfile(profileData);
      setUserOrders(ordersData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchUserData(currentUser?.id);
  };

  const handleLogout = () => {
    // Clear user data and redirect to home
    setUser(null);
    setUserProfile(null);
    setUserOrders([]);
    router.push("/");
  };

  const handleProfileSave = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    setIsEditing(false);
  };

  // Show login modal if user is not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading your profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getOrderStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-gray-600">Welcome back, {userProfile?.name || user?.name}!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Orders ({userOrders.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Wishlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {isEditing ? (
            <ProfileEditForm
              userProfile={userProfile}
              onSave={handleProfileSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userProfile?.name || "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {userProfile?.email || "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {userProfile?.phone_number || "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "Unknown"}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-4">Start shopping to see your order history here.</p>
                  <Button onClick={() => router.push("/")}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {order.orderItems?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0].image_url}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product?.name}</p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ETB {item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">ETB {(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">ETB {order.total_amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                My Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-4">Start adding items to your wishlist to see them here.</p>
                <Button onClick={() => router.push("/")}>
                  Browse Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
