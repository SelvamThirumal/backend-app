import multer from "multer";

const storage = multer.memoryStorage();

const filterTypes = (req, file, cb) => {
  const fileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  filterTypes,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
