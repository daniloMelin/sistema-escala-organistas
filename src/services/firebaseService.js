import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
  limit
} from 'firebase/firestore';

const ORGANISTS_SUBCOLLECTION = 'organists';
const SCHEDULES_SUBCOLLECTION = 'schedules';

// --- LEGADO (Fase 1 e 2) - Funções Globais ---
export const addOrganist = async (userId, organistData) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const organistsCollectionRef = collection(db, 'users', userId, ORGANISTS_SUBCOLLECTION);
    const docRef = await addDoc(organistsCollectionRef, { ...organistData, createdAt: Timestamp.now() });
    return { id: docRef.id, ...organistData };
  } catch (e) {
    console.error("Erro ao adicionar organista:", e);
    throw e;
  }
};

export const getOrganists = async (userId) => {
  if (!userId) return [];
  try {
    const organistsCollectionRef = collection(db, 'users', userId, ORGANISTS_SUBCOLLECTION);
    const q = query(organistsCollectionRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    const organists = [];
    querySnapshot.forEach((doc) => {
      organists.push({ id: doc.id, ...doc.data() });
    });
    return organists;
  } catch (e) {
    console.error("Erro ao buscar organistas:", e);
    throw e;
  }
};

export const deleteOrganist = async (userId, organistId) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const organistDocRef = doc(db, 'users', userId, ORGANISTS_SUBCOLLECTION, organistId);
    await deleteDoc(organistDocRef);
  } catch (e) {
    console.error("Erro ao deletar organista:", e);
    throw e;
  }
};

export const updateOrganist = async (userId, organistId, dataToUpdate) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const organistDocRef = doc(db, 'users', userId, ORGANISTS_SUBCOLLECTION, organistId);
    await updateDoc(organistDocRef, dataToUpdate);
  } catch (e) {
    console.error("Erro ao atualizar organista:", e);
    throw e;
  }
};

// --- ESCALAS (Globais por enquanto) ---
export const saveSchedule = async (userId, scheduleId, scheduleData) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const scheduleDocRef = doc(db, 'users', userId, SCHEDULES_SUBCOLLECTION, scheduleId);
    const dataToSave = {
      ...scheduleData,
      generatedAt: scheduleData.generatedAt ? Timestamp.fromDate(new Date(scheduleData.generatedAt)) : Timestamp.now(),
    };
    await setDoc(scheduleDocRef, dataToSave);
  } catch (e) {
    console.error("Erro ao salvar escala:", e);
    throw e;
  }
};

export const getRecentSchedules = async (userId, count = 3) => {
  if (!userId) return [];
  try {
    const schedulesCollectionRef = collection(db, 'users', userId, SCHEDULES_SUBCOLLECTION);
    const q = query(schedulesCollectionRef, orderBy("generatedAt", "desc"), limit(count));
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
    console.error("Erro ao buscar escalas recentes:", e);
    throw e;
  }
};

// --- FASE 3 e 4: Multi-Igreja ---

/**
 * Adiciona uma nova igreja.
 */
export const addChurch = async (userId, churchData) => {
  if (!userId) throw new Error("ID do usuário é necessário.");
  try {
    const churchesCollectionRef = collection(db, 'users', userId, 'churches');
    await addDoc(churchesCollectionRef, { ...churchData, createdAt: Timestamp.now() });
  } catch (e) {
    console.error("Erro ao adicionar igreja:", e);
    throw e;
  }
};

/**
 * Busca todas as igrejas.
 */
export const getChurches = async (userId) => {
  if (!userId) return [];
  try {
    const churchesCollectionRef = collection(db, 'users', userId, 'churches');
    const q = query(churchesCollectionRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Erro ao buscar igrejas:", e);
    throw e;
  }
};

/**
 * Busca organistas de uma igreja específica.
 */
export const getOrganistsByChurch = async (userId, churchId) => {
  try {
    const organistsRef = collection(db, "users", userId, "churches", churchId, "organists");
    const snapshot = await getDocs(organistsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar organistas:", error);
    throw error;
  }
};

/**
 * Adiciona organista em uma igreja específica.
 */
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
    console.error("Erro ao adicionar organista na igreja:", error);
    throw error;
  }
};

// Excluir uma Igreja
export const deleteChurch = async (userId, churchId) => {
  if (!userId || !churchId) throw new Error("ID inválido.");
  try {
    const churchDocRef = doc(db, 'users', userId, 'churches', churchId);
    await deleteDoc(churchDocRef);
  } catch (e) {
    console.error("Erro ao deletar igreja:", e);
    throw e;
  }
};

// Excluir uma Organista de uma Igreja específica
export const deleteOrganistFromChurch = async (userId, churchId, organistId) => {
  if (!userId || !churchId || !organistId) throw new Error("Dados insuficientes.");
  try {
    const organistDocRef = doc(db, "users", userId, "churches", churchId, "organists", organistId);
    await deleteDoc(organistDocRef);
  } catch (error) {
    console.error("Erro ao deletar organista:", error);
    throw error;
  }
};