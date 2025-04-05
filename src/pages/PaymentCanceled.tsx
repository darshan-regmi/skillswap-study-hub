
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold mt-4">Payment Canceled</h2>
              <p className="text-gray-500 mt-2">
                Your payment was canceled. No charges were made to your account.
              </p>
              <div className="mt-8 space-y-4">
                <Button
                  className="w-full"
                  onClick={() => navigate(-1)}
                >
                  Try Again
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentCanceled;
