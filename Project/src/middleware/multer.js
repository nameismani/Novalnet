// const multer = require('multer')
// const path = require('path')

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Uploads is the Upload_folder_name
//     cb(null, "media/img");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + ".jpg");
//   },
// });

// var upload = multer({

//   storage: storage,
//   //   limits: { fileSize: maxSize },
//   fileFilter: function (req, file, cb) {
//     // Set the filetypes, it is optional
//     var filetypes = /jpeg|jpg|png/;
//     var mimetype = filetypes.test(file.mimetype);

//     var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//     if (mimetype && extname) {
//       return cb(null, true);
//     }

//     cb(
//       "Error: File upload only supports the " +
//         "following filetypes - " +
//         filetypes
//     );
//   },

//   // mypic is the name of file attribute
// }).single("mypic");

// module.exports = upload

c

module.exports = uploadMiddleware;
