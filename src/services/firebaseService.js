import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs, getDoc,
  doc,
  setDoc,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
  writeBatch,
  limit
} from 'firebase/firestore';
import logger from '../utils/logger';

// --- IGREJAS ---

export const addChurch = async (userId, churchData) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const churchesCollectionRef = collection(db, 'users', userId, 'churches');
    await addDoc(churchesCollectionRef, { ...churchData, createdAt: Timestamp.now() });
  } catch (e) {
    logger.error("Erro ao adicionar igreja:", e);
    throw e;
  }
};

export const getChurches = async (userId) => {
  if (!userId) return [];
  try {
    const churchesCollectionRef = collection(db, 'users', userId, 'churches');
    const q = query(churchesCollectionRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    logger.error("Erro ao buscar igrejas:", e);
    throw e;
  }
};

export const deleteChurch = async (userId, churchId) => {
  if (!userId || !churchId) throw new Error("ID inválido.");
  try {
    const churchDocRef = doc(db, 'users', userId, 'churches', churchId);
    await deleteDoc(churchDocRef);
  } catch (e) {
    logger.error("Erro ao deletar igreja:", e);
    throw e;
  }
};

// Remove igreja e documentos nas subcollections especificadas (organists, schedules).
// Usa batches de escrita para evitar exceder limites; para grandes volumes considere Cloud Functions.
export const deleteChurchWithSubcollections = async (userId, churchId) => {
  if (!userId || !churchId) throw new Error("ID inválido.");
  try {
    const subCollections = ['organists', 'schedules'];

    for (const sub of subCollections) {
      const colRef = collection(db, 'users', userId, 'churches', churchId, sub);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) continue;

      let batch = writeBatch(db);
      let ops = 0;
      for (const docSnap of snapshot.docs) {
        batch.delete(docSnap.ref);
        ops++;
        // commit parcial para evitar lotes muito grandes
        if (ops >= 400) {
          await batch.commit();
          batch = writeBatch(db);
          ops = 0;
        }
      }
      if (ops > 0) await batch.commit();
    }

    // deleta o documento da igreja
    const churchDocRef = doc(db, 'users', userId, 'churches', churchId);
    await deleteDoc(churchDocRef);
  } catch (e) {
    logger.error("Erro ao deletar igreja com subcollections:", e);
    throw e;
  }
};

// --- ORGANISTAS (POR IGREJA) ---

export const getOrganistsByChurch = async (userId, churchId) => {
  try {
    const organistsRef = collection(db, "users", userId, "churches", churchId, "organists");
    const snapshot = await getDocs(organistsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logger.error("Erro ao buscar organistas:", error);
    throw error;
  }
};

export const addOrganistToChurch = async (userId, churchId, organistData) => {
  if (!userId || !churchId) throw new Error("ID do usuário e da Igreja são necessários.");
  try {
    const organistsRef = collection(db, "users", userId, "churches", churchId, "organists");
    const docRef = await addDoc(organistsRef, {
      ...organistData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...organistData };
  } catch (error) {
    logger.error("Erro ao adicionar organista na igreja:", error);
    throw error;
  }
};

export const updateOrganistInChurch = async (userId, churchId, organistId, dataToUpdate) => {
  if (!userId || !churchId || !organistId) throw new Error("Dados insuficientes.");
  try {
    const organistDocRef = doc(db, "users", userId, "churches", churchId, "organists", organistId);
    await updateDoc(organistDocRef, dataToUpdate);
  } catch (error) {
    logger.error("Erro ao atualizar organista:", error);
    throw error;
  }
};

export const deleteOrganistFromChurch = async (userId, churchId, organistId) => {
  if (!userId || !churchId || !organistId) throw new Error("Dados insuficientes.");
  try {
    const organistDocRef = doc(db, "users", userId, "churches", churchId, "organists", organistId);
    await deleteDoc(organistDocRef);
  } catch (error) {
    logger.error("Erro ao deletar organista:", error);
    throw error;
  }
};

// --- ESCALAS (POR IGREJA) ---

export const saveScheduleToChurch = async (userId, churchId, scheduleId, scheduleData) => {
  if (!userId || !churchId) throw new Error("ID do usuário e da Igreja são necessários.");
  try {
    const scheduleDocRef = doc(db, 'users', userId, 'churches', churchId, 'schedules', scheduleId);
    const dataToSave = {
      ...scheduleData,
      generatedAt: scheduleData.generatedAt ? Timestamp.fromDate(new Date(scheduleData.generatedAt)) : Timestamp.now(),
    };
    await setDoc(scheduleDocRef, dataToSave);
  } catch (e) {
    logger.error("Erro ao salvar escala da igreja:", e);
    throw e;
  }
};

export const getChurchSchedules = async (userId, churchId, count = 3) => {
  if (!userId || !churchId) return [];
  try {
    const schedulesRef = collection(db, 'users', userId, 'churches', churchId, 'schedules');
    const q = query(schedulesRef, orderBy("generatedAt", "desc"), limit(count));

    const querySnapshot = await getDocs(q);
    const schedules = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedules.push({
        id: doc.id,
        ...data,
        generatedAt: data.generatedAt?.toDate?.().toISOString() || data.generatedAt,
      });
    });
    return schedules;
  } catch (e) {
    logger.error("Erro ao buscar escalas da igreja:", e);
    throw e;
  }
};

// Atualizar dados de uma Igreja
export const updateChurch = async (userId, churchId, dataToUpdate) => {
  if (!userId || !churchId) throw new Error("Dados insuficientes.");
  try {
    const churchDocRef = doc(db, 'users', userId, 'churches', churchId);
    await updateDoc(churchDocRef, dataToUpdate);
  } catch (e) {
    logger.error("Erro ao atualizar igreja:", e);
    throw e;
  }
};

export const getChurch = async (userId, churchId) => {
  try {
    const docRef = doc(db, 'users', userId, 'churches', churchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (e) {
    logger.error("Erro ao buscar igreja:", e);
    throw e;
  }
};
