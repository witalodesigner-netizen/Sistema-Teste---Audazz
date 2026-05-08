import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

let accountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '';
if (accountKeyString.startsWith("'") && accountKeyString.endsWith("'")) {
  accountKeyString = accountKeyString.substring(1, accountKeyString.length - 1);
}

const serviceAccount = JSON.parse(accountKeyString);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function resetDb() {
  console.log('Zeroing out system...');
  
  // 1. Delete all users
  const listUsersResult = await auth.listUsers();
  for (const user of listUsersResult.users) {
    await auth.deleteUser(user.uid);
  }
  console.log('All auth users deleted.');

  // 2. Clear Firestore Collections
  const collections = ['users', 'clients', 'projects', 'briefings', 'financial', 'contracts', 'demands'];
  for (const collectionName of collections) {
    const querySnapshot = await db.collection(collectionName).get();
    for (const doc of querySnapshot.docs) {
      await doc.ref.delete();
    }
  }
  console.log('All collections cleared.');

  // 3. Create owner user
  const ownerCpf = '084.044.423-04';
  const ownerEmail = '08404442304@audazz.app';
  const ownerPassword = '12345678';

  const userRecord = await auth.createUser({
    email: ownerEmail,
    password: ownerPassword,
    displayName: 'Witalo Designer',
  });

  await auth.setCustomUserClaims(userRecord.uid, {
    role: 'admin',
    permissions: ['all']
  });

  await db.collection('users').doc(userRecord.uid).set({
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
