require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const admin = require('firebase-admin');

let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) 
  : {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    };

// Corrige a private_key se tiver \\n duplos (comum em arquivos .env)
if (serviceAccountKey.private_key) {
  serviceAccountKey.private_key = serviceAccountKey.private_key.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function reset() {
  const agencyId = 'audazz-nexus';
  console.log("Deletando coleções da agência", agencyId);
  const collections = ['collaborators', 'clients', 'demandas', 'financeiros', 'briefings', 'contratos'];
  
  for (const col of collections) {
    const snapshot = await db.collection('agencies').doc(agencyId).collection(col).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deletados ${snapshot.docs.length} documentos de ${col}`);
  }

  // Deletar os usuários do Auth (opcional, vamos apenas garantir o master)
  const cpf = '08404442304';
  const email = `usr_${cpf}@portal.audazz.com`;
  const password = '12345678';
  
  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      await auth.updateUser(userRecord.uid, { password, displayName: 'Witalo' });
      console.log('Usuário mestre atualizado');
    } catch(e) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          displayName: 'Witalo'
        });
        console.log('Usuário mestre criado');
      } else {
        throw e;
      }
    }
    
    await auth.setCustomUserClaims(userRecord.uid, {
      agencyId,
      role: 'admin',
      isCollaborator: true,
      cpf
    });
    
    // Inserir no Firestore
    await db.collection('agencies').doc(agencyId).collection('collaborators').doc(userRecord.uid).set({
      uid: userRecord.uid,
      agencyId,
      name: 'Witalo',
      emailProfissional: email,
      cpf: '084.044.423-04',
      cargo: 'CEO',
      departamento: 'Gestão',
      role: 'admin',
      ativo: true,
      vinculo: 'Sócio',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Dados do usuário mestre criados no Firestore.');
  } catch(e) {
    console.error("Erro ao configurar usuário master:", e);
  }
}

reset().then(() => {
  console.log('Reset concluído com sucesso.');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
