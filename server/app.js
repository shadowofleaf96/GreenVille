const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

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

app.use(cookieParser());
app.use(express.json());

app.use("/", api);

module.exports = app;
