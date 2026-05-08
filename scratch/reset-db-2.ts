import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { adminAuth, adminDb } from '../src/lib/firebase/admin';

async function resetDb() {
  console.log('Zeroing out system...');
  
  // 1. Delete all users
  const listUsersResult = await adminAuth.listUsers();
  for (const user of listUsersResult.users) {
    await adminAuth.deleteUser(user.uid);
  }
  console.log('All auth users deleted.');

  // 2. Clear Firestore Collections
  const collections = ['users', 'clients', 'projects', 'briefings', 'financial', 'contracts', 'demands'];
  for (const collectionName of collections) {
    const querySnapshot = await adminDb.collection(collectionName).get();
    for (const doc of querySnapshot.docs) {
      await doc.ref.delete();
    }
  }
  console.log('All collections cleared.');

  // 3. Create owner user
  const ownerCpf = '084.044.423-04';
  const ownerEmail = '08404442304@audazz.app';
  const ownerPassword = '12345678';

  const userRecord = await adminAuth.createUser({
    email: ownerEmail,
    password: ownerPassword,
    displayName: 'Witalo Designer',
  });

  await adminAuth.setCustomUserClaims(userRecord.uid, {
    role: 'admin',
    permissions: ['all']
  });

  await adminDb.collection('users').doc(userRecord.uid).set({
    id: userRecord.uid,
    name: 'Witalo Designer',
    email: ownerEmail,
    cpf: ownerCpf,
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log('Owner created successfully!');
  console.log(`CPF: ${ownerCpf}`);
  console.log(`Password: ${ownerPassword}`);
}

resetDb().catch(console.error).finally(() => process.exit(0));
