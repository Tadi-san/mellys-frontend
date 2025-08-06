"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, Home, ShoppingBag } from "lucide-react";

const PaymentFailureContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment details from URL parameters
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const error = searchParams.get('error');

    if (orderId || amount || status || error) {
      setPaymentDetails({
        orderId: orderId || 'N/A',
        amount: amount || 'N/A',
        status: status || 'failed',
        error: error || 'Payment failed',
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    router.push('/CheckoutPage');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We&apos;re sorry, but your payment could not be processed.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">ETB {paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-red-600 capitalize">{paymentDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{paymentDetails.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Payment could not be completed</span>
            </div>
            <p className="text-sm text-gray-600">
              This could be due to insufficient funds, network issues, or other technical problems. 
              Please try again or contact our support team if the problem persists.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleContinueShopping}
                className="w-full"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Need help? Contact our support team</p>
            <p>Email: support@mellysfashion.com</p>
            <p>Phone: +251 911 123 456</p>
            <p className="mt-2 text-xs">
              Common issues: insufficient funds, network connectivity, 
              or temporary service unavailability
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentFailurePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
};

export default PaymentFailurePage; 