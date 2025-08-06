"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, CreditCard } from "lucide-react";
import { api } from "@/utils/index.api";
import LoginModal from "@/components/auth/LoginModal";
import { getUser, isAuthenticated } from "@/utils/auth";
import TelebirrPayment from "@/components/TelebirrPayment";
import { toast } from "@/components/ui/use-toast";

const CheckoutPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<any>(getUser());
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee] = useState(100); // Fixed shipping fee of 100 birr
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (!isAuthenticated()) {
      setShowLoginModal(true);
    } else {
      fetchCartData();
    }
  }, []);

  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      const user = getUser();
      const cartResponse = await api.getCart(user?.id || null);
      const items = cartResponse.cart || [];
      setCartItems(items);
      
      // Calculate total amount
      const total = items.reduce((sum: number, item: any) => {
        return sum + (Number(item.product.price) * item.quantity);
      }, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setUser(getUser());
    fetchCartData();
  };

  const handlePaymentSuccess = (data: any) => {
    toast({
      title: "Payment Successful",
      description: "Your order has been placed successfully!",
    });
    // Here you can redirect to order confirmation page or clear cart
    console.log("Payment successful:", data);
  };

  const handlePaymentError = (error: any) => {
    toast({
      title: "Payment Failed",
      description: "There was an issue with your payment. Please try again.",
      variant: "destructive"
    });
    console.error("Payment error:", error);
  };

  // Show login modal if user is not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
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
            <p>Please log in to proceed with checkout.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading your cart...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Empty Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your cart is empty. Please add some items before proceeding to checkout.</p>
            <Button 
              onClick={() => window.history.back()} 
              className="mt-4"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item: any, index: number) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {/* Product Image */}
                  {item.product.images && item.product.images.length > 0 && (
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.product.images[0].image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Quantity: {item.quantity}</div>
                      <div>Size: {item.size}</div>
                      <div>Color: {item.color}</div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <div className="font-medium">
                      ETB {(Number(item.product.price) * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      ETB {Number(item.product.price).toLocaleString()} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>ETB {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Fee:</span>
                <span>ETB {shippingFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>ETB {(totalAmount + shippingFee).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your order
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                Secure Payment
              </Badge>
              <p className="text-sm text-gray-600">
                Complete your purchase using Telebirr - Ethiopia&apos;s trusted mobile money service.
              </p>
            </div>
            
            <TelebirrPayment
              amount={totalAmount + shippingFee}
              title="Order Payment"
              orderId={`ORDER_${Date.now()}`}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;