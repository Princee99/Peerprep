const express =require("express");
const cors = require("cors");

const app= express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/email', require('./routes/email'));
// app.use('/api/reviews', require('./routes/reviews'));

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
