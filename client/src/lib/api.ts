// API utility functions for BudgetFox

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchAPI(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Important for session cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }));
    throw new APIError(response.status, errorData.message || "Request failed");
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; college?: string; year?: string; studentStatus?: string }) =>
    fetchAPI("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchAPI("/api/auth/logout", {
      method: "POST",
    }),

  me: () => fetchAPI("/api/auth/me"),
};

// Wallet APIs
export const walletAPI = {
  getAll: () => fetchAPI("/api/wallets"),
  getOne: (id: number) => fetchAPI(`/api/wallets/${id}`),
};

// Virtual Card APIs
export const cardAPI = {
  get: () => fetchAPI("/api/card"),
  updateStatus: (status: string) =>
    fetchAPI("/api/card/status", {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (limit?: number) => fetchAPI(`/api/transactions${limit ? `?limit=${limit}` : ""}`),
  create: (data: {
    walletId: number;
    amount: string;
    merchant: string;
    category: string;
    type: string;
    description?: string;
    date?: Date;
  }) =>
    fetchAPI("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// PayLater APIs
export const paylaterAPI = {
  get: () => fetchAPI("/api/paylater"),
};

// EMI APIs
export const emiAPI = {
  getAll: () => fetchAPI("/api/emi"),
  convert: (data: {
    transactionId?: number;
    totalAmount: string;
    interestRate: string;
    tenure: number;
  }) =>
    fetchAPI("/api/emi/convert", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Subscription APIs
export const subscriptionAPI = {
  getAll: () => fetchAPI("/api/subscriptions"),
  create: (data: {
    name: string;
    amount: string;
    cycle: string;
    nextDue: Date;
    logo?: string;
  }) =>
    fetchAPI("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancel: (id: number) =>
    fetchAPI(`/api/subscriptions/${id}/cancel`, {
      method: "PATCH",
    }),
};

// Chat APIs
export const chatAPI = {
  getMessages: () => fetchAPI("/api/chat/messages"),
  sendMessage: (data: { message: string; sender: string }) =>
    fetchAPI("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
