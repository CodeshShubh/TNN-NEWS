import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import { dB } from './db/db.connection.js';





const app = express();


app.get('/',(req:Request, res:Response)=>{
   res.send(`<h1>Working</h1>`)
})


dotenv.config(); // must first
const URI:string = process.env.URI || '';
const PORT:number = parseInt(process.env.PORT as string, 10) || 4000
dB(URI)
app.listen(PORT,()=>{
    console.log(`Server is Working on http://localhost:${PORT}`)
})