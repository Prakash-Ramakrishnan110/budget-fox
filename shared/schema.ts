import { sql } from "drizzle-orm";
import { pgTable, text, integer, serial, timestamp, boolean, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  college: text("college"),
  year: text("year"),
  studentStatus: text("student_status"), // 'day_scholar' or 'hosteler'
  creditScore: integer("credit_score").default(500),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
}).extend({
  password: z.string().min(4),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Wallets table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletType: text("wallet_type").notNull(), // 'cash', 'e-atm', 'paylater', 'rewards'
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  limit: decimal("limit", { precision: 10, scale: 2 }),
  unit: text("unit").default("INR"), // 'INR' or 'pts' for rewards
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

// Virtual Cards table
export const virtualCards = pgTable("virtual_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  cardNumber: text("card_number").notNull(),
  expiryDate: text("expiry_date").notNull(),
  cvvHash: text("cvv_hash").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'frozen', 'blocked'
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }),
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVirtualCardSchema = createInsertSchema(virtualCards).omit({
  id: true,
  createdAt: true,
});

export type InsertVirtualCard = z.infer<typeof insertVirtualCardSchema>;
export type VirtualCard = typeof virtualCards.$inferSelect;

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  merchant: text("merchant").notNull(),
  category: text("category").notNull(), // 'food', 'transport', 'shopping', 'bills', 'education', 'entertainment'
  type: text("type").notNull(), // 'debit' or 'credit'
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// PayLater Accounts table
export const paylaterAccounts = pgTable("paylater_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).notNull(),
  used: decimal("used", { precision: 10, scale: 2 }).notNull().default("0"),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("active"), // 'active', 'suspended'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaylaterAccountSchema = createInsertSchema(paylaterAccounts).omit({
  id: true,
  createdAt: true,
});

export type InsertPaylaterAccount = z.infer<typeof insertPaylaterAccountSchema>;
export type PaylaterAccount = typeof paylaterAccounts.$inferSelect;

// EMI Plans table
export const emiPlans = pgTable("emi_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  transactionId: integer("transaction_id").references(() => transactions.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull().default("15.00"),
  tenure: integer("tenure").notNull(), // in months
  monthlyEmi: decimal("monthly_emi", { precision: 10, scale: 2 }).notNull(),
  paidInstallments: integer("paid_installments").notNull().default(0),
  nextDueDate: timestamp("next_due_date"),
  status: text("status").notNull().default("active"), // 'active', 'completed', 'defaulted'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmiPlanSchema = createInsertSchema(emiPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertEmiPlan = z.infer<typeof insertEmiPlanSchema>;
export type EmiPlan = typeof emiPlans.$inferSelect;

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  cycle: text("cycle").notNull(), // 'monthly', 'yearly'
  nextDue: timestamp("next_due").notNull(),
  logo: text("logo"),
  status: text("status").notNull().default("active"), // 'active', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
