"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { api } from "@/utils/index.api";
import LoginModal from "@/components/auth/LoginModal";
import { getUser, isAuthenticated } from "@/utils/auth";

// Stripe Publishable Key (replace with your own)
const stripePromise = loadStripe("4567"); //process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY! ||

// PayPal Client ID (replace with your own)
const paypalClientId = "2345"; // process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||;

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "cybersource">("stripe");
  const [cyberSourceForm, setCyberSourceForm] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<any>(getUser());
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (!isAuthenticated()) {
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    if (cyberSourceForm) {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = cyberSourceForm;

      // Extract the form and its data
      const form = tempDiv.querySelector("form");
      if (form) {
        // Submit the form programmatically
        document.body.appendChild(form);
        form.submit();
      }
    }
  }, [cyberSourceForm]);

  const handleLoginSuccess = () => {
    setUser(getUser());
  };

  const handleCyberSourcePayment = async () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await api.initiatePayment({
        amount: "100.00",
        currency: "USD",
        referenceNumber: "ORDER_12345"
      });
  
      const paymentUrl = response.data.trim().replace(/^"|"$/g, '');  // Remove quotes if needed
  
      console.log("Clean Payment URL:", paymentUrl);  // Check the URL
  
      // Redirect to the clean URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error initiating CyberSource payment:", error);
    }
  };
  

  const handleStripePayment = async () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    const stripe = await stripePromise;

    // Create a payment intent on your server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000 }), // Amount in cents
    });

    const { clientSecret } = await response.json();

    // Add your stripe payment confirmation logic here
  };

  const handlePayPalPayment = (data: any, actions: any) => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "10.00", // Replace with the actual amount
          },
        },
      ],
    });
  };

  const handlePayPalApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log("Payment succeeded:", details);
    });
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
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="block mb-2">Payment Method</Label>
            <div className="flex gap-2">
              <Button
                variant={paymentMethod === "stripe" ? "default" : "outline"}
                onClick={() => setPaymentMethod("stripe")}
              >
                Credit/Debit Card
              </Button>
              <Button
                variant={paymentMethod === "cybersource" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cybersource")}
              >
                CyberSource(Dashn)
              </Button>
            </div>
          </div>

          {/* Stripe Card Form */}
          {paymentMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleStripePayment} className="w-full">
                Pay with Stripe
              </Button>
            </div>
          )}

          {paymentMethod === "cybersource" && (
            <div className="space-y-4">
              <Button onClick={handleCyberSourcePayment} className="w-full">
                Pay with CyberSource
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;