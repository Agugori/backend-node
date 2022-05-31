import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

connectDB()

const dominiosPermitidos = ["http://localhost:3000"]

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true)
        }else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`)
})