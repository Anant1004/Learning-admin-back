import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './src/config/dbConfig.js';
import categoryRoute from "./src/routes/categoryRoute.js";
import subCategoryRoute from './src/routes/subCategoryRoute.js';
import courseRoute from "./src/routes/courseRoutes.js";
import subjectRoute from "./src/routes/subjectRoutes.js";
import userRoute from "./src/routes/userRoutes.js";
import chapterRoute from "./src/routes/chapterRoutes.js";
import liveClassRoute from "./src/routes/liveClassRoutes.js";
import freeVideoRoute from "./src/routes/freeVideoRoutes.js";
import lessonRoute from "./src/routes/lessonRoute.js";
import signatureRoute from "./src/routes/signatureRoute.js";

dotenv.config({
  path: './.env',
});

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));


app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);
app.use('/api/course',courseRoute);
app.use('/api/subject',subjectRoute);
app.use('/api/users',userRoute);
app.use('/api/chapters',chapterRoute);
app.use('/api/liveclasses',liveClassRoute);
app.use('/api/freevideos',freeVideoRoute);
app.use('/api/lesson',lessonRoute);
app.use('/api/signature',signatureRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});
