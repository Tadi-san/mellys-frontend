"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Loader2, Globe } from "lucide-react";
import { api } from "@/utils/index.api";
import { getUser, isAuthenticated } from "@/utils/auth";
import { toast } from "@/components/ui/use-toast";

interface TelebirrPaymentProps {
  amount: number;
  title: string;
  orderId?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const TelebirrPayment: React.FC<TelebirrPaymentProps> = ({
  amount,
  title,
  orderId,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const user = getUser();

  const handlePayment = async () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with payment",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus("");

    try {
      const paymentPayload = {
        amount: amount.toString(),
        title: title,
        currency: "ETB",
        userId: user?.id,
        orderId: orderId
      };

      // Call the backend API
      const response = await api.initiateTelebirrH5(paymentPayload);

      console.log("Payment response:", response);

      // Check if the response has the expected structure
      if (response.success && response.data && response.data.paymentUrl) {
        setPaymentData(response.data);
        setPaymentStatus("INITIATED");

        // Show success message
        toast({
          title: "Payment Initiated",
          description: "Redirecting to Telebirr payment page...",
        });

        // Redirect to Telebirr payment page
        window.location.href = response.data.paymentUrl;
        
        onSuccess?.(response.data);
      } else {
        throw new Error("Invalid response format from server");
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStatus("FAILED");
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to initiate payment";
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img 
            src="/telebirr-logo.png" 
            alt="Telebirr" 
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          Telebirr Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Amount Display */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ETB {amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Complete your payment using Telebirr&apos;s secure web payment system.
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Badge variant="secondary">Web</Badge>
            <Badge variant="outline">Mobile</Badge>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Badge 
                variant={paymentStatus === "INITIATED" ? "default" : "destructive"}
              >
                {paymentStatus}
              </Badge>
              {paymentStatus === "INITIATED" && (
                <div className="text-sm text-green-600">
                  Payment initiated successfully
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button 
          onClick={handlePayment} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              <span className="ml-2">
                Pay with Telebirr
              </span>
            </>
          )}
        </Button>

        {/* Payment Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Secure payment powered by Telebirr</div>
          <div>• Supported by Ethiopian Telecommunication</div>
          <div>• Instant payment confirmation</div>
        </div>

        {/* Payment Data Display (for debugging) */}
        {process.env.NODE_ENV === "development" && paymentData && (
          <details className="text-xs">
            <summary className="cursor-pointer">Payment Data</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(paymentData, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default TelebirrPayment; 