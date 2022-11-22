const express = require("express");
const router = express.Router();
const con = require("../mysql");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/", (req, res) => {
  let sql = `SELECT * FROM operator`;
  con.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results);
    return res.status(200).json(results);
  });
});

router.post("/", uploadOptions.single("uploads"), (req, res) => {
  const file = req.file;

  // console.log(req.file)
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let imagePath = `${basePath}${fileName}`;
  let sql = `INSERT INTO operator(name, contact_number, age, address, imagePath) VALUES(?,?,?,?,?)`;
  console.log(fileName, sql);
  con.query(
    sql,
    [
      req.body.name,
      req.body.contact_number,
      req.body.age,
      req.address,
      imagePath,
    ],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }

      return res.status(200).json(results);
    }
  );
});

router.get("/:id", (req, res) => {
  let sql = `SELECT * FROM operator WHERE operator_id = ${req.params.id}`;
  con.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results);
    return res.status(200).json(results);
  });
});

router.put("/:id", uploadOptions.single("uploads"), (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let imagePath = `${basePath}${fileName}`;
  let sql = `UPDATE operator SET name = ?, contact_number = ?, age = ?, address = ?, imagePath = ? WHERE operator_id = ${req.params.id}`;
  console.log(fileName, sql);
  con.query(
    sql,
    [
      req.body.name,
      req.body.contact_number,
      req.body.age,
      req.address,
      imagePath,
    ],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }

      return res.status(200).json(results);
    }
  );
});

router.delete("/:id", (req, res) => {
  let sql = `DELETE FROM operator WHERE operator_id = ${req.params.id}`;
  con.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results);
    return res.status(200).json(results);
  });
});

module.exports = router;
