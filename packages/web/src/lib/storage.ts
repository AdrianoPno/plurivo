import {
  ref,
  uploadBytes,
  getDownloadURL,
  FullMetadata,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/lib/firebase";

/**
 * Faz o upload de um arquivo para o Firebase Storage com sanitização.
 */
export async function uploadFileToStorage(
  file: File,
  path: string = "artifacts",
): Promise<{ downloadURL: string; metadata: FullMetadata }> {
  if (!file) {
    throw new Error("Nenhum arquivo fornecido para upload.");
  }

  // Sanitização básica para evitar problemas com caracteres em URLs
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const fileId = uuidv4();
  const storageRef = ref(storage, `${path}/${fileId}-${sanitizedName}`);

  const uploadResult = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(uploadResult.ref);

  return { downloadURL, metadata: uploadResult.metadata };
}
