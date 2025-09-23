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
import testSeriesRoutes from "./src/routes/testSeriesRoutes.js";
import notificationRoutes from "./src/routes/notificationRoute.js";
import bannerRoutes from "./src/routes/bannerRoute.js";
import lessonRoute from "./src/routes/lessonRoute.js";
import signatureRoute from "./src/routes/signatureRoute.js";
import authRoute from "./src/routes/authRoute.js";
import { authorize } from "./src/middlewares/authorization.js";
import cookieParser from "cookie-parser";
import purchaseRoutes from "./src/routes/purchaseRoutes.js";

dotenv.config({
  path: './.env',
});

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  "https://lms-sys1-infynx.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api/categories', authorize, categoryRoute);
app.use('/api/subcategories', authorize, subCategoryRoute);
app.use('/api/course',authorize,courseRoute);
app.use('/api/subject',authorize,subjectRoute);
app.use('/api/users',authorize,userRoute);
app.use('/api/chapters',authorize,chapterRoute);
app.use('/api/liveclasses',authorize,liveClassRoute);
app.use('/api/freevideos',authorize,freeVideoRoute);
app.use("/api/testSeries", authorize,testSeriesRoutes)
app.use("/api/notifications", authorize,notificationRoutes);
app.use("/api/banners", authorize,bannerRoutes);
app.use('/api/lesson',authorize,lessonRoute);
app.use('/api/signature',authorize,signatureRoute);
app.use('/api/auth',authRoute);
app.use('/api/purchase',authorize,purchaseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});
