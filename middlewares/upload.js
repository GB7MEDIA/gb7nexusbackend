import multer from 'multer';
import path from  'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

export const uploadMiddleware = (req, res, next) => {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: "There was an error uploading the image!" });
      } else if (err) {
        return res.status(500).json({ error: "There was an error uploading the image!" });
      }

      next();
    });
  };