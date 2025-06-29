//backend/src/scripts/importTransaction.js

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Transaction_1 = require("../models/Transaction");
dotenv_1.default.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopr_db';
const filePath = path_1.default.join(__dirname, '../data/transactions.json');
const rawData = fs_1.default.readFileSync(filePath, 'utf-8');
const transactions = JSON.parse(rawData);
const seedTransactions = async () => {
  try {
    await mongoose_1.default.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Transaction_1.Transaction.deleteMany();
    console.log('🗑️ Old transactions deleted');
    await Transaction_1.Transaction.insertMany(transactions);
    console.log(`✅ ${transactions.length} transactions inserted`);
    await mongoose_1.default.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
  catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};
seedTransactions();
//# sourceMappingURL=importTransactions.js.map