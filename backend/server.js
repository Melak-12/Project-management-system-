const express = require('express');
const colors = require('colors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const issueRoutes = require('./routes/issueRoutes');
const connectDb = require('./config/db');
const dotenv = require('dotenv')
const cors = require('cors')
const app = express();
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3001' }));
const PORT = process.env.PORT || 5000;
connectDb()


app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', require('./routes/userRoutes'))
app.get('/', (req, res) => {
    res.send("welcome to pms")
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.cyan);
});
