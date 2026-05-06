import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { firebaseStorage } from "../firebase/storage";

interface UploadFileParams {
  file: File;

  path: string;
}

export const uploadService = {
  async uploadFile({ file, path }: UploadFileParams) {
    const fileName = `${Date.now()}-${file.name}`;

    const storageRef = ref(firebaseStorage, `${path}/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, file);

    const url = await getDownloadURL(uploadResult.ref);

    return {
      url,
      path: uploadResult.ref.fullPath,
      name: fileName,
    };
  },
};
