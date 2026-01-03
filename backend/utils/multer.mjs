import multer from 'multer'
import path from 'path';

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'../userProfilePics');
    },
    filename(req,file,cb){
        // console.log("first",file);
        const ext = path.extname(file.originalname);
        // console.log("second",req);
        const id = req.user._id;
        cb(null,`${id}${ext.toString()}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter(req,file,cb){
        // console.log(file);
        if(file.mimetype.startsWith("image/")) cb(null,true);
        else{ 
            cb(new Error("is not a image file"));
            cb(null,false);
        }
    },
    limits: 300*1024
})

export default upload;