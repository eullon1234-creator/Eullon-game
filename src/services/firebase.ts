import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  getDocs 
} from 'firebase/firestore';
import { Game } from '../types/game';

export const firebaseConfig = {
  apiKey: "AIzaSyBFT-w8XVq7w9N7WlOIsWXSI15bM2T1HiM",
  authDomain: "game-historia-2026.firebaseapp.com",
  projectId: "game-historia-2026",
  storageBucket: "game-historia-2026.firebasestorage.app",
  messagingSenderId: "285111086961",
  appId: "1:285111086961:web:4b5929bd6bf4cec67650d0",
  measurementId: "G-94GC7K3M32"
};

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION_NAME = 'games';

/**
 * Escuta em tempo real as mudanças na coleção de jogos do Firestore.
 */
export function subscribeToGames(
  onSuccess: (games: Game[]) => void,
  onError?: (error: Error) => void
) {
  const gamesCol = collection(db, COLLECTION_NAME);
  return onSnapshot(
    gamesCol,
    (snapshot) => {
      const list: Game[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Game;
        list.push({
          ...data,
          id: docSnap.id,
        });
      });
      onSuccess(list);
    },
    (err) => {
      console.error('Erro na conexão com o Firestore:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Salva ou atualiza um jogo no Firestore.
 */
export async function saveGameToFirestore(game: Game): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, game.id);
    await setDoc(docRef, game, { merge: true });
  } catch (err) {
    console.error('Erro ao salvar no Firestore:', err);
    throw err;
  }
}

/**
 * Remove um jogo do Firestore.
 */
export async function deleteGameFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Erro ao excluir do Firestore:', err);
    throw err;
  }
}

/**
 * Envia uma lista de jogos em lote para o Firestore.
 */
export async function batchUploadGames(games: Game[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    games.forEach((game) => {
      const docRef = doc(db, COLLECTION_NAME, game.id);
      batch.set(docRef, game, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Erro no upload em lote para o Firestore:', err);
    throw err;
  }
}

/**
 * Remove todos os jogos da coleção no Firestore.
 */
export async function clearAllFirestoreGames(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (err) {
    console.error('Erro ao limpar Firestore:', err);
    throw err;
  }
}
