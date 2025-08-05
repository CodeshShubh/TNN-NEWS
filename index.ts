import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import { dB } from './db/db.connection.js';

import userRoutes from './routes/user.routes.js'

dotenv.config(); // must first
const app = express();




app.use(express.json())



app.use('/user',userRoutes)

// check
app.get('/',(req:Request, res:Response)=>{
   res.send(`<h1>Working</h1>`)
})

const URI:string = process.env.URI || '';
const PORT:number = parseInt(process.env.PORT as string, 10) || 4000
dB(URI)
app.listen(PORT,()=>{
    console.log(`Server is Working on http://localhost:${PORT}`)
})