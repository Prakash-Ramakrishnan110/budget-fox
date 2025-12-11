import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI, APIError } from "@/lib/api";
import { useLocation } from "wouter";

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.me,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setLocation("/dashboard");
    },
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setLocation("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

  return {
    user: user?.user,
    isLoading,
    isAuthenticated: !!user?.user,
    signup: signupMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isSigningUp: signupMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    signupError: signupMutation.error as APIError | null,
    loginError: loginMutation.error as APIError | null,
  };
}
