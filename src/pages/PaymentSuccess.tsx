
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { completeOrder } from "@/services/paymentService";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("order");

  useEffect(() => {
    const handleOrderCompletion = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // In a real app, this would be triggered by a webhook from Stripe
        // For this demo, we'll complete the order directly
        await completeOrder(orderId);
        setLoading(false);
        toast.success("Payment completed successfully!");
      } catch (error) {
        console.error("Error completing payment:", error);
        toast.error("There was an issue processing your payment");
        setLoading(false);
      }
    };

    handleOrderCompletion();
  }, [orderId]);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            {loading ? (
              <div className="py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <h2 className="text-2xl font-bold mt-4">Processing Payment</h2>
                <p className="text-gray-500 mt-2">Please wait while we complete your order...</p>
              </div>
            ) : (
              <div className="py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                <p className="text-gray-500 mt-2">
                  Thank you for your purchase. Your order has been processed successfully.
                </p>
                <div className="mt-8 space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
