const multer = require("multer");
const sharp = require("sharp");
const Product = require("./../models/productModel");
const AppError = require("./../utils/appError");
const catchAsyncError = require("./../utils/catchAsyncError");
const factory = require("./handlerFactory");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload a valid image", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadProductPhoto = upload.single("photo");
exports.resizeProductPhoto = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `product-${req.product.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/img/products/${req.file.filename}`);
  next();
});
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product /*{ path: "reviews" }*/);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.createProduct = factory.createOne(Product);