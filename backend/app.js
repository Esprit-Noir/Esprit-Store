const express = require('express');
const authRouter = require('./routes/AuthRoute');
const productRouter = require('./routes/ProductRoute');
const blogRouter = require('./routes/BlogRoute');
const productCategoryRouter = require('./routes/ProductCategoryRoute');
const blogCategoryRouter = require('./routes/BlogCategoryRoute');
const brandRouter = require('./routes/BrandRoute');
const CouponRouter = require('./routes/CouponRoute');

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/ErrorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'config/.env',
  });
}

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/products/category', productCategoryRouter);
app.use('/api/blogs/category', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', CouponRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
