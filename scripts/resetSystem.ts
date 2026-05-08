import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega as variveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import * as admin from 'firebase-admin';

async function resetSystem() {
  console.log('Iniciando o reset completo do sistema...');
  
  try {
    // Dynamic import after env variables are loaded
    const { adminAuth, adminDb } = require('../src/lib/firebase/admin');

    // 1. Apagar todos os ususarios do Firebase Auth
    console.log('Apagando usuários do Firebase Auth...');
    const listUsersResult = await adminAuth.listUsers(1000);
    const uids = listUsersResult.users.map((u: any) => u.uid);
    if (uids.length > 0) {
      await adminAuth.deleteUsers(uids);
      console.log(`Deletados ${uids.length} usuários.`);
    } else {
      console.log('Nenhum usuário para deletar.');
    }

    // 2. Apagar todas as colecoes do Firestore (simplificado para as principais)
    console.log('Apagando coleções do Firestore...');
    const collections = ['agencies', 'clients', 'demands', 'financial', 'briefings', 'contracts'];
    
    for (const col of collections) {
      console.log(`Apagando coleção: ${col}`);
      const snapshot = await adminDb.collection(col).get();
      const batchSize = snapshot.size;
      if (batchSize === 0) continue;

      let count = 0;
      for (const doc of snapshot.docs) {
        // Apaga subcolecoes do documento se existirem (ex: collaborators em agencies)
        const subcollections = await doc.ref.listCollections();
        for (const subcol of subcollections) {
          const subdocs = await subcol.get();
          for (const subdoc of subdocs.docs) {
             await subdoc.ref.delete();
             count++;
          }
        }
        await doc.ref.delete();
        count++;
      }
      console.log(`Deletados ${count} documentos em ${col} (incluindo subcoleções).`);
    }

    // 3. Criar o super admin com o CPF especificado
    const adminCpf = '084.044.423-04';
    const adminPassword = '12345678';
    const cleanCpf = adminCpf.replace(/\D/g, '');
    const adminEmail = `${cleanCpf}@portal.audazz.com`;
    const agencyId = 'audazz-nexus';

    console.log('Criando o usuário admin raiz...');
    const adminUser = await adminAuth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Witalo (Dono do Sistema)',
    });

    await adminAuth.setCustomUserClaims(adminUser.uid, {
      agencyId,
      role: 'admin',
      isCollaborator: true,
      cpf: cleanCpf
    });

    console.log(`Usuário criado com sucesso no Auth! UID: ${adminUser.uid}`);

    // Criar o documento no Firestore
    const docData = {
      uid: adminUser.uid,
      agencyId,
      name: 'Witalo',
      emailPessoal: null,
      emailProfissional: adminEmail,
      telefone: null,
      whatsapp: null,
      cpf: adminCpf,
      cargo: 'CEO / Admin',
      departamento: 'Gestão',
      vinculo: 'Sócio',
      senioridade: 'Líder',
      dataEntrada: new Date().toISOString(),
      cargaHoraria: 40,
      role: 'admin',
      ativo: true,
      podeSerAlocado: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedAt: null
    };

    await adminDb.collection('agencies').doc(agencyId).collection('collaborators').doc(adminUser.uid).set(docData);
    
    console.log('Documento do usuário criado no Firestore.');
    console.log('--- RESET CONCLUÍDO COM SUCESSO ---');

  } catch (error) {
    console.error('Erro durante o reset do sistema:', error);
  }
}

resetSystem().then(() => process.exit(0)).catch(() => process.exit(1));
