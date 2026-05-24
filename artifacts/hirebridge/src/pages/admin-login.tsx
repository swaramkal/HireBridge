import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation("/admin/dashboard");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">HireBridge Admin</h1>
          <p className="text-gray-400 mt-1 text-sm">Restricted access — authorised personnel only</p>
        </div>

        <Card className="shadow-2xl border-0 bg-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Admin Login</h2>
            <p className="text-gray-400 text-sm mb-6">Manage platform approvals and subscriptions</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hirebridge.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                  data-testid="input-email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                  data-testid="input-password"
                  required
                />
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-xs text-gray-300">
                Demo mode: any credentials will log you in as admin.
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto rounded-xl font-semibold"
                disabled={loading}
                data-testid="button-login"
              >
                {loading ? "Verifying..." : "Login as Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
