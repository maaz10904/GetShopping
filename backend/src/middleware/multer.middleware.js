import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const storage = multer.diskStorage({
    filename: (req,file,cb) => {
       const ext = path.extname(file.originalname || "").toLowerCase();
       const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : "";
       const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
       cb(null, `${unique}${safeExt}`);
    },
});

const fileFilter = (req,file,cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if(extname && mimetype){
        cb(null,true)
    }    else{
        cb(new Error("Only images are allowed"))
    }
}
export const upload = multer(
    {
        storage,
        fileFilter,
        limits:{fileSize: 5 * 1024 * 1024}
    });

