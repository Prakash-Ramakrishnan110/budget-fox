import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Wallet,
  InsertWallet,
  VirtualCard,
  InsertVirtualCard,
  Transaction,
  InsertTransaction,
  PaylaterAccount,
  InsertPaylaterAccount,
  EmiPlan,
  InsertEmiPlan,
  Subscription,
  InsertSubscription,
  ChatMessage,
  InsertChatMessage,
} from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  updateCreditScore(userId: number, score: number): Promise<void>;

  // Wallet operations
  getWallets(userId: number): Promise<Wallet[]>;
  getWallet(walletId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(walletId: number, newBalance: string): Promise<void>;

  // Virtual Card operations
  getVirtualCard(userId: number): Promise<VirtualCard | undefined>;
  createVirtualCard(card: InsertVirtualCard): Promise<VirtualCard>;
  updateCardStatus(cardId: number, status: string): Promise<void>;

  // Transaction operations
  getTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | undefined>;

  // PayLater operations
  getPaylaterAccount(userId: number): Promise<PaylaterAccount | undefined>;
  createPaylaterAccount(account: InsertPaylaterAccount): Promise<PaylaterAccount>;
  updatePaylaterUsed(accountId: number, used: string): Promise<void>;

  // EMI operations
  getEmiPlans(userId: number): Promise<EmiPlan[]>;
  createEmiPlan(plan: InsertEmiPlan): Promise<EmiPlan>;
  updateEmiInstallment(planId: number, paidInstallments: number, nextDueDate: Date): Promise<void>;

  // Subscription operations
  getSubscriptions(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(id: number, status: string): Promise<void>;

  // Chat operations
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser & { passwordHash: string }): Promise<User> {
    const { password, ...userData } = user as any;
    const result = await db.insert(schema.users).values(userData).returning();
    return result[0];
  }

  async updateCreditScore(userId: number, score: number): Promise<void> {
    await db.update(schema.users).set({ creditScore: score }).where(eq(schema.users.id, userId));
  }

  // Wallet operations
  async getWallets(userId: number): Promise<Wallet[]> {
    return await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId));
  }

  async getWallet(walletId: number): Promise<Wallet | undefined> {
    const result = await db.select().from(schema.wallets).where(eq(schema.wallets.id, walletId)).limit(1);
    return result[0];
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const result = await db.insert(schema.wallets).values(wallet).returning();
    return result[0];
  }

  async updateWalletBalance(walletId: number, newBalance: string): Promise<void> {
    await db.update(schema.wallets).set({ balance: newBalance }).where(eq(schema.wallets.id, walletId));
  }

  // Virtual Card operations
  async getVirtualCard(userId: number): Promise<VirtualCard | undefined> {
    const result = await db.select().from(schema.virtualCards).where(eq(schema.virtualCards.userId, userId)).limit(1);
    return result[0];
  }

  async createVirtualCard(card: InsertVirtualCard): Promise<VirtualCard> {
    const result = await db.insert(schema.virtualCards).values(card).returning();
    return result[0];
  }

  async updateCardStatus(cardId: number, status: string): Promise<void> {
    await db.update(schema.virtualCards).set({ status }).where(eq(schema.virtualCards.id, cardId));
  }

  // Transaction operations
  async getTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.userId, userId))
      .orderBy(desc(schema.transactions.date))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(schema.transactions).values(transaction).returning();
    return result[0];
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const result = await db.select().from(schema.transactions).where(eq(schema.transactions.id, id)).limit(1);
    return result[0];
  }

  // PayLater operations
  async getPaylaterAccount(userId: number): Promise<PaylaterAccount | undefined> {
    const result = await db.select().from(schema.paylaterAccounts).where(eq(schema.paylaterAccounts.userId, userId)).limit(1);
    return result[0];
  }

  async createPaylaterAccount(account: InsertPaylaterAccount): Promise<PaylaterAccount> {
    const result = await db.insert(schema.paylaterAccounts).values(account).returning();
    return result[0];
  }

  async updatePaylaterUsed(accountId: number, used: string): Promise<void> {
    await db.update(schema.paylaterAccounts).set({ used }).where(eq(schema.paylaterAccounts.id, accountId));
  }

  // EMI operations
  async getEmiPlans(userId: number): Promise<EmiPlan[]> {
    return await db
      .select()
      .from(schema.emiPlans)
      .where(eq(schema.emiPlans.userId, userId))
      .orderBy(desc(schema.emiPlans.createdAt));
  }

  async createEmiPlan(plan: InsertEmiPlan): Promise<EmiPlan> {
    const result = await db.insert(schema.emiPlans).values(plan).returning();
    return result[0];
  }

  async updateEmiInstallment(planId: number, paidInstallments: number, nextDueDate: Date): Promise<void> {
    await db
      .update(schema.emiPlans)
      .set({ paidInstallments, nextDueDate })
      .where(eq(schema.emiPlans.id, planId));
  }

  // Subscription operations
  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return await db
      .select()
      .from(schema.subscriptions)
      .where(and(eq(schema.subscriptions.userId, userId), eq(schema.subscriptions.status, "active")))
      .orderBy(schema.subscriptions.nextDue);
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(schema.subscriptions).values(subscription).returning();
    return result[0];
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<void> {
    await db.update(schema.subscriptions).set({ status }).where(eq(schema.subscriptions.id, id));
  }

  // Chat operations
  async getChatMessages(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(schema.chatMessages)
      .where(eq(schema.chatMessages.userId, userId))
      .orderBy(schema.chatMessages.timestamp)
      .limit(limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(schema.chatMessages).values(message).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
