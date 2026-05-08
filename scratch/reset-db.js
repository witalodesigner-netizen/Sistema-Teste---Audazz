const admin = require('firebase-admin');

// We parse the env var just like in admin.ts
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    return;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Deleted ${batchSize} documents from ${collectionPath}`);
}

async function reset() {
  try {
    console.log("Deleting all Auth users...");
    let listUsersResult = await auth.listUsers(1000);
    while (listUsersResult.users.length > 0) {
      const uids = listUsersResult.users.map(u => u.uid);
      await auth.deleteUsers(uids);
      console.log(`Deleted ${uids.length} users.`);
      if (listUsersResult.pageToken) {
        listUsersResult = await auth.listUsers(1000, listUsersResult.pageToken);
      } else {
        break;
      }
    }

    console.log("Deleting collections...");
    const collections = [
      'collaborators',
      'clients',
      'projects',
      'financials',
      'briefings',
      'contracts'
    ];
    
    for (const coll of collections) {
      await deleteCollection(`agencies/audazz-nexus/${coll}`);
    }

    console.log("Creating Admin User...");
    const cpf = '08404442304';
    const email = `${cpf}@portal.audazz.com`;
    const password = '12345678';

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: 'Dono do Sistema',
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      agencyId: 'audazz-nexus',
      role: 'admin',
      isCollaborator: true,
      cpf: cpf
    });

    await db.collection('agencies').doc('audazz-nexus').collection('collaborators').doc(userRecord.uid).set({
      uid: userRecord.uid,
      agencyId: 'audazz-nexus',
      name: 'Dono do Sistema',
      emailProfissional: email,
      cpf: '084.044.423-04',
      cargo: 'CEO',
      departamento: 'Diretoria',
      role: 'admin',
      ativo: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("System reset and admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during reset:", error);
    process.exit(1);
  }
}

reset();
