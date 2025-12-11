import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logo from "@assets/generated_images/minimalist_geometric_fox_logo_for_budgetfox_app.png";

export default function AuthPage() {
  const { signup, login, isSigningUp, isLoggingIn, signupError, loginError } = useAuth();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [studentStatus, setStudentStatus] = useState("day_scholar");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email: loginEmail, password: loginPassword },
      {
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message || "Invalid credentials",
          });
        },
      }
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup(
      {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        studentStatus,
      },
      {
        onSuccess: () => {
          toast({
            title: "Account created!",
            description: "Welcome to BudgetFox 🦊",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: error.message || "Could not create account",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-b from-orange-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 shadow-xl shadow-orange-500/10 rotate-3">
          <img src={logo} alt="BudgetFox Logo" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white font-display">BudgetFox</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Smart Money, Smarter You</p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your wallet.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@college.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    data-testid="input-login-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="input-login-password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium"
                  disabled={isLoggingIn}
                  data-testid="button-login"
                >
                  {isLoggingIn ? "Unlocking..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
            <form onSubmit={handleSignup}>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Start your financial journey today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    placeholder="Alex Johnson"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    data-testid="input-signup-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="alex@college.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    data-testid="input-signup-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    data-testid="input-signup-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    data-testid="select-student-status"
                  >
                    <option value="day_scholar">Day Scholar</option>
                    <option value="hosteler">Hosteler</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium"
                  disabled={isSigningUp}
                  data-testid="button-signup"
                >
                  {isSigningUp ? "Creating..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
