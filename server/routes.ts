import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertTransactionSchema, insertEmiPlanSchema, insertSubscriptionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

// Extend Express Request to include session
interface AuthRequest extends Request {
  session: {
    userId?: number;
    destroy: (callback: () => void) => void;
  };
}

// Middleware to check authentication
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  if (!authReq.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ========== AUTHENTICATION ROUTES ==========
  
  // Signup
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        passwordHash,
      });

      // Create default wallets
      const wallets = [
        { userId: user.id, walletType: "cash", balance: "0", unit: "INR", limit: null },
        { userId: user.id, walletType: "e-atm", balance: "5000", unit: "INR", limit: null },
        { userId: user.id, walletType: "paylater", balance: "5000", unit: "INR", limit: "5000" },
        { userId: user.id, walletType: "rewards", balance: "0", unit: "pts", limit: null },
      ];

      for (const wallet of wallets) {
        const createdWallet = await storage.createWallet(wallet);
        
        // Create virtual card for e-atm wallet
        if (wallet.walletType === "e-atm") {
          const cardNumber = `4${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
          const cvvHash = await bcrypt.hash("123", 10);
          const expiryDate = "12/28";
          
          await storage.createVirtualCard({
            userId: user.id,
            walletId: createdWallet.id,
            cardNumber,
            expiryDate,
            cvvHash,
            status: "active",
            dailyLimit: "10000",
            monthlyLimit: "50000",
          });
        }

        // Create PayLater account for paylater wallet
        if (wallet.walletType === "paylater") {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(5);
          
          await storage.createPaylaterAccount({
            userId: user.id,
            walletId: createdWallet.id,
            creditLimit: "5000",
            used: "0",
            dueDate: nextMonth,
            status: "active",
          });
        }
      }

      // Set session
      authReq.session.userId = user.id;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          college: user.college,
          year: user.year,
          studentStatus: user.studentStatus,
          creditScore: user.creditScore,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      authReq.session.userId = user.id;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          college: user.college,
          year: user.year,
          studentStatus: user.studentStatus,
          creditScore: user.creditScore,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    authReq.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = await storage.getUser(authReq.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        year: user.year,
        studentStatus: user.studentStatus,
        creditScore: user.creditScore,
        avatar: user.avatar,
      },
    });
  });

  // ========== WALLET ROUTES ==========
  
  app.get("/api/wallets", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const wallets = await storage.getWallets(authReq.session.userId!);
      res.json({ wallets });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/wallets/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const wallet = await storage.getWallet(parseInt(req.params.id));
      if (!wallet || wallet.userId !== authReq.session.userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json({ wallet });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== VIRTUAL CARD ROUTES ==========
  
  app.get("/api/card", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const card = await storage.getVirtualCard(authReq.session.userId!);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      // Mask sensitive data
      res.json({
        card: {
          ...card,
          cardNumber: `•••• •••• •••• ${card.cardNumber.slice(-4)}`,
          cvvHash: undefined, // Never send CVV
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/card/status", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { status } = req.body;
      const card = await storage.getVirtualCard(authReq.session.userId!);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      await storage.updateCardStatus(card.id, status);
      res.json({ message: "Card status updated" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== TRANSACTION ROUTES ==========
  
  app.get("/api/transactions", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getTransactions(authReq.session.userId!, limit);
      res.json({ transactions });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/transactions", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const txData = insertTransactionSchema.parse({
        ...req.body,
        userId: authReq.session.userId,
      });

      // Update wallet balance
      const wallet = await storage.getWallet(txData.walletId);
      if (!wallet || wallet.userId !== authReq.session.userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const currentBalance = parseFloat(wallet.balance);
      const amount = parseFloat(txData.amount);
      const newBalance = txData.type === "debit" ? currentBalance - amount : currentBalance + amount;

      if (newBalance < 0) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      await storage.updateWalletBalance(wallet.id, newBalance.toString());
      const transaction = await storage.createTransaction(txData);

      res.json({ transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== PAYLATER ROUTES ==========
  
  app.get("/api/paylater", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const account = await storage.getPaylaterAccount(authReq.session.userId!);
      if (!account) {
        return res.status(404).json({ message: "PayLater account not found" });
      }
      res.json({ account });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== EMI ROUTES ==========
  
  app.get("/api/emi", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const plans = await storage.getEmiPlans(authReq.session.userId!);
      res.json({ plans });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/emi/convert", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const emiData = insertEmiPlanSchema.parse({
        ...req.body,
        userId: authReq.session.userId,
      });

      // Calculate EMI
      const principal = parseFloat(emiData.totalAmount);
      const rate = parseFloat(emiData.interestRate) / 100 / 12; // Monthly rate
      const tenure = emiData.tenure;
      
      // EMI formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
      const monthlyEmi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);

      const nextDue = new Date();
      nextDue.setMonth(nextDue.getMonth() + 1);

      const plan = await storage.createEmiPlan({
        ...emiData,
        monthlyEmi: monthlyEmi.toFixed(2),
        nextDueDate: nextDue,
      });

      res.json({ plan });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== SUBSCRIPTION ROUTES ==========
  
  app.get("/api/subscriptions", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const subscriptions = await storage.getSubscriptions(authReq.session.userId!);
      res.json({ subscriptions });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/subscriptions", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const subData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: authReq.session.userId,
      });

      const subscription = await storage.createSubscription(subData);
      res.json({ subscription });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/subscriptions/:id/cancel", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.updateSubscriptionStatus(parseInt(req.params.id), "cancelled");
      res.json({ message: "Subscription cancelled" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== CHAT ROUTES ==========
  
  app.get("/api/chat/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const messages = await storage.getChatMessages(authReq.session.userId!);
      res.json({ messages });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/chat/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId: authReq.session.userId,
      });

      const message = await storage.createChatMessage(messageData);

      // Simple AI response simulation
      if (messageData.sender === "user") {
        const responses = [
          "That's a great question! Based on your spending, you have good budget control.",
          "I noticed you've been managing your expenses well this month. Keep it up!",
          "Your PayLater bill is due soon. Want me to set a reminder?",
          "You're doing great! Your credit score is looking healthy.",
          "Be mindful of your weekend spending. It tends to be higher.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(async () => {
          await storage.createChatMessage({
            userId: authReq.session.userId || 0,
            message: randomResponse,
            sender: "bot",
          });
        }, 1000);
      }

      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}
