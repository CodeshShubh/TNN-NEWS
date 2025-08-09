import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();
export const upload = multer({ storage });
export const getDataURi = (file) => {
    const ext = path.extname(file.originalname).toString();
    const base64 = file.buffer.toString('base64');
    return `data:image/${ext.replace('.', '')};base64,${base64}`;
};
