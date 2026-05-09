const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, "src/uploads");
  },

  filename: (
    req,
    file,
    cb
  ) => {
    cb(
      null,
      Date.now() +
        path.extname(
          file.originalname
        )
    );
  },
});

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowed =
    /pdf|doc|docx/;

  const ext =
    allowed.test(
      path.extname(
        file.originalname
      )
    );

  if (ext) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only PDF/DOC/DOCX files allowed"
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;