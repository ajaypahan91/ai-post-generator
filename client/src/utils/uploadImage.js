import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // adjust path if needed

export const uploadImage = async (file, userId) => {
  const storageRef = ref(storage, `user_uploads/${userId}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
