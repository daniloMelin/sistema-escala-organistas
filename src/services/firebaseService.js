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
  Timestamp,
  limit
} from 'firebase/firestore';

// Importa o Firebase Auth para autenticação
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

export const auth = getAuth(app);

const ORGANISTS_COLLECTION = 'organists';
const SCHEDULES_COLLECTION = 'schedules';

/**
 * Adiciona um nova organista ao Firestore.
 * @param {object} organistData - Dados do organista (nome, disponibilidade).
 * @returns {Promise<object>} O organista adicionado com seu ID.
 * @throws Lança um erro se a adição falhar.
 */
export const addOrganist = async (organistData) => {
  try {
    const dataToSave = {
      ...organistData,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, ORGANISTS_COLLECTION), dataToSave);
    console.log("Organista adicionado com ID: ", docRef.id);
    return { id: docRef.id, ...dataToSave };
  } catch (e) {
    console.error("Erro ao adicionar organista: ", e);
    throw e;
  }
};

/**
 * Busca todos os organistas do Firestore, ordenados por nome.
 * @returns {Promise<Array<object>>} Uma lista de organistas.
 * @throws Lança um erro se a busca falhar.
 */
export const getOrganists = async () => {
  try {
    const q = query(collection(db, ORGANISTS_COLLECTION), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const organists = [];
    querySnapshot.forEach((doc) => {
      organists.push({ id: doc.id, ...doc.data() });
    });
    return organists;
  } catch (e) {
    console.error("Erro ao buscar organistas: ", e);
    throw e;
  }
};

/**
 * Deleta um organista do Firestore.
 * @param {string} organistId - O ID do organista a ser deletado.
 * @returns {Promise<void>}
 * @throws Lança um erro se a deleção falhar.
 */
export const deleteOrganist = async (organistId) => {
  try {
    await deleteDoc(doc(db, ORGANISTS_COLLECTION, organistId));
    console.log("Organista deletado com ID: ", organistId);
  } catch (e) {
    console.error("Erro ao deletar organista: ", e);
    throw e;
  }
};


// --- Escalas ---

/**
 * Salva uma escala gerada no Firestore.
 * @param {string} scheduleId - O ID para a escala.
 * @param {object} scheduleData - Os dados da escala.
 * @returns {Promise<void>}
 * @throws Lança um erro se a operação de salvar falhar.
 */
export const saveSchedule = async (scheduleId, scheduleData) => {
  try {
    const dataToSave = {
      ...scheduleData,
      generatedAt: scheduleData.generatedAt ? Timestamp.fromDate(new Date(scheduleData.generatedAt)) : Timestamp.now(),
    };
    await setDoc(doc(db, SCHEDULES_COLLECTION, scheduleId), dataToSave);
    console.log("Escala salva com ID: ", scheduleId);
  } catch (e) {
    console.error("Erro ao salvar escala: ", e);
    throw e;
  }
};

/**
 * Busca as últimas N escalas salvas, ordenadas pela data de geração (mais recentes primeiro).
 * @param {number} count - O número de escalas mais recentes a serem buscadas.
 * @returns {Promise<Array<object>>} Uma lista das escalas mais recentes.
 * @throws Lança um erro se a busca falhar.
 */
export const getRecentSchedules = async (count = 3) => { // Adicionado parâmetro 'count' com default 3
  try {
    // Ordena por 'generatedAt' em ordem decrescente (mais recentes primeiro)
    // e limita o resultado ao 'count' especificado.
    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      orderBy("generatedAt", "desc"),
      limit(count) // <<<<<<< ADICIONADO LIMITAÇÃO AQUI
    );
    const querySnapshot = await getDocs(q);
    const schedules = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const scheduleItem = {
        id: doc.id,
        ...data,
        // Converte Timestamp do Firebase para string ISO para uso na UI
        generatedAt: data.generatedAt?.toDate?.().toISOString() || data.generatedAt,
        period: {
          start: data.period?.start, // Assumindo que já estão como string YYYY-MM-DD
          end: data.period?.end,
        }
      };
      schedules.push(scheduleItem);
    });
    return schedules;
  } catch (e) {
    console.error("Erro ao buscar escalas recentes: ", e);
    throw e;
  }
};