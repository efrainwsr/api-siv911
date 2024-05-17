// import routes
const authRoutes = require('./routes/auth');

// route middlewares
app.use('/api/user', authRoutes);