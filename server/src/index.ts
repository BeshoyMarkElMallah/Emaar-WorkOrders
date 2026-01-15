import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
// import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import cors from 'cors'; // Import cors
import http from 'http';
// import { Server } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
// export const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', rootRouter);



// export const prismaClient = new PrismaClient({
//   log: ['query'],

// })




app.use(errorMiddleware);

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});