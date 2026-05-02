const express   = require('express');
const path      = require('path');
const helmet    = require('helmet');
const cors      = require('cors');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler }  = require('./middleware/errorHandler');
const { shutdownGuard } = require('./middleware/shutdownGuard');
const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'"], // tighten after build
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'", process.env.CORS_ORIGIN || "*"],
      fontSrc:     ["'self'"],
      objectSrc:   ["'none'"],
      frameSrc:    ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xContentTypeOptions: true,
  xFrameOptions: { action: "deny" },
}));
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map(o => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === "development") {
      return cb(null, true);
    }
    cb(new Error("CORS policy: origin not allowed"));
  },
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
}));
app.use('/uploads', (req,res,next)=>{ res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Cross-Origin-Resource-Policy','cross-origin'); next(); }, express.static(path.join(__dirname, '../uploads')));
app.use(express.json({ limit: '2mb' })); // general limit
// Extra-tight limit specifically for auth routes (prevents payload bombs)
app.use(['/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register'],
  express.json({ limit: '10kb' })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15*60*1000, max: 500, standardHeaders: true }));
app.use(shutdownGuard);
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));
// Strict rate limit for auth routes Ã¢â‚¬â€ 10 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});
app.use('/auth/login',    authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/auth',          require('./routes/auth'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/dashboard',     require('./routes/dashboard'));
app.use('/cards',         require('./routes/cards'));
app.use('/videos',        require('./routes/videos'));
app.use('/api/videos',     require('./routes/videos'));
app.use('/assignments',   require('./routes/assignments'));
app.use('/submissions',   require('./routes/submissions'));
app.use('/messages',      require('./routes/messages'));
app.use('/notifications', require('./routes/notifications'));
app.use('/quizzes',       require('./routes/quizzes'));
app.use('/pronunciation', require('./routes/pronunciation'));
app.use('/payments',      require('./routes/payments'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/telemetry',     require('./routes/telemetry'));
app.use('/system',        require('./routes/system'));
app.use('/users', require('./routes/users'));
app.use('/admin',         require('./routes/admin'));
app.use('/admin',     require('../routes/adminDashboard.routes'));
app.use('/dashboard', require('../routes/adminDashboard.routes'));
app.use('/studytime',     require('./routes/studytime'));
app.use('/api/studytime', require('./routes/studytime'));
app.use('/classes',      require('./routes/classes'));
app.use('/mpesa',        require('./routes/mpesa'));
app.use('/parent-student', require('./routes/parentStudent'));
app.use('/otp',          require('./routes/otp'));

// /api/* aliases so frontend baseURL:'/api' works
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/mpesa',         require('./routes/mpesa'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/leaderboard', require('./routes/leaderboard'))
app.use('/api/leaderboard', require('./routes/leaderboard'))
app.use('/quiz',         require('./routes/quiz.routes'))
app.use('/api/quiz',     require('./routes/quiz.routes'))
app.use('/api/notifications', require('./routes/notifications'));

app.use((_, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);
module.exports = app;


