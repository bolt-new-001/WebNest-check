import mongoose from 'mongoose';
import Package from '../models/Package.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://webnestpro:yourpassword@ac-64m3ccy-shard-00-00.ezpsgaq.mongodb.net/webnest?retryWrites=true&w=majority';

async function createTestPackage() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const testPackage = await Package.create({
      name: 'Test Package',
      description: 'Test package for debugging',
      price: 0,
      features: [
        { name: 'Test Feature 1', description: 'Test feature description', included: true },
        { name: 'Test Feature 2', description: 'Another test feature', included: true }
      ],
      type: 'basic',
      active: true, // This is important for the getPackages endpoint
      maxProjects: 1,
      maxTeamMembers: 1,
      maxStorage: 1,
      supportLevel: 'basic'
    });

    console.log('Test package created:', testPackage);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test package:', error);
    process.exit(1);
  }
}

createTestPackage();
