const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
// const viewRouter = require("./routes/viewRoutes");
// const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      baseUri: ["'self'"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrc: ["'self'", "https://*.stripe.com"],

      scriptSrc: ["'self'", "http:", "https://*.mapbox.com", "data:"],

      frameSrc: ["'self'", "https://*.stripe.com"],

      objectSrc: ["'none'"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      workerSrc: ["'self'", "data:", "blob:"],

      childSrc: ["'self'", "blob:"],

      imgSrc: ["'self'", "data:", "blob:"],

      connectSrc: ["'self'", "blob:", "https://*.mapbox.com"],

      upgradeInsecureRequests: [],
    },
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests sent. Please try again in one hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      // "duration",
      // "ratingsQuantity",
      // "ratingsAverage",
      // "maxGroupSize",
      // "difficulty",
      // "price",
    ],
  })
);
// app.use(express.static(`${__dirname}/public`));

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //  console.log(req.cookies)
  next();
});

// Route Handlers
// Routes
// app.use("/", viewRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
