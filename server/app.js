const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");

const app = express();

app.use(compression());

const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  })
);
app.disable("x-powered-by");

const staticPath = path.join(__dirname, "public", "images");
app.use(
  "/images",
  express.static(staticPath, {
    maxAge: "1d",
    etag: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const softLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 50,
  handler: (req, res, next) => {
    strictLimiter(req, res, next);
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  message: "You have exceeded the request limit. Please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    softLimiter(req, res, next);
  } else {
    next();
  }
});

app.use("/", api);

module.exports = app;
