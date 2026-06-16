import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function CompanyLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation("/company/dashboard");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">CareerLinks</h1>
          <p className="text-gray-500 mt-1 text-sm">Company Portal</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Company Login</h2>
            <p className="text-gray-500 text-sm mb-6">Hire verified candidates from our platform</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  data-testid="input-email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  data-testid="input-password"
                  required
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
                Demo mode: any credentials will log you in as a company.
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 h-auto rounded-xl font-semibold"
                disabled={loading}
                data-testid="button-login"
              >
                {loading ? "Logging in..." : "Login as Company"}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              Not registered?{" "}
              <Link href="/company/register" className="text-blue-600 hover:underline">
                Register your company
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
