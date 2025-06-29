import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Import your config file or define config here
import { config } from '../config/env'; // <-- FIXED: use correct path and named export

// Import your Mongoose models
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Optionally create mock users if needed
    const demoUsers = [
      { email: 'user1@example.com', firstName: 'User', lastName: 'One', password: 'password123', role: 'user' },
      { email: 'user2@example.com', firstName: 'User', lastName: 'Two', password: 'password123', role: 'user' },
      { email: 'user3@example.com', firstName: 'User', lastName: 'Three', password: 'password123', role: 'user' },
      { email: 'user4@example.com', firstName: 'User', lastName: 'Four', password: 'password123', role: 'user' }
    ];

    // These are just for visual purposes if your schema doesn't enforce user collection
    await User.create(demoUsers);

    // Load JSON file
    const dataPath = path.join(__dirname, 'transactions.json'); // update filename if needed
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const transactions = JSON.parse(raw);

    // Normalize for schema compatibility
    const formatted = transactions.map((t: any) => {
      // Remove the 'id' field if present and ensure it's not set to null or undefined
      const obj: any = {
        ...t,
        userId: t.user_id,
        date: new Date(t.date),
        description: `Imported Transaction ${t.id}`,
        category: t.category,
        amount: t.amount,
        type: t.category?.toLowerCase() === 'expense' ? 'expense' : 'income',
        status: t.status?.toLowerCase(),
        account: 'Imported Account',
        notes: `From user ${t.user_id}`,
        tags: [],
      };
      // Remove both 'id' and any accidental 'id' property
      if ('id' in obj) delete obj.id;
      // Also remove id from nested objects if present
      Object.keys(obj).forEach(key => {
        if (key === 'id') delete obj[key];
      });
      return obj;
    });

    // Remove 'id' index from the collection if it exists
    try {
      await Transaction.collection.dropIndex('id_1');
      console.log('Dropped index: id_1');
    } catch (e: any) {
      if (e.codeName !== 'IndexNotFound') {
        console.warn('Could not drop id_1 index:', e.message);
      }
    }

    await Transaction.insertMany(formatted);
    console.log(`💾 Inserted ${formatted.length} transactions from dataset`);

    console.log('🎉 Custom dataset seeded successfully!');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};


seedDatabase();
