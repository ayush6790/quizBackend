import "./db/db";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from 'http';
import errorMiddleware from "./modules/config/errorHandler";
import importRoutings from "./routing/routingIndex";
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();
dotenv.config();

// create the server
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Store the active rooms
interface Room {
  teacher: string;
  students: string[];
}

const activeRooms: Record<string, Room> = {};

io.on('connect', (socket: Socket) => {
  console.log("A client has connected.");

  // Handle teacher joining a room
  socket.on('joinAsTeacher', (roomId: string) => {
    console.log(`Teacher joined room: ${roomId}`);
    socket.join(roomId);
    activeRooms[roomId] = { teacher: socket.id, students: [] };
  });

  // Handle student joining a room
  socket.on('joinAsStudent', (roomId: string) => {
    // console.log(`Student joined room: ${roomId}`);
    socket.join(roomId);
    const room = activeRooms[roomId];
    console.log('the active rooms is', room)
    // console.log('the room is', room)
    if (room) {
      // console.log('the room is', room)
      room.students.push(socket.id);
      socket.to(room.teacher).emit('studentJoined', socket.id);

      // console.log('the activeRooms ', activeRooms)
    } else {
      console.log(`Invalid room: ${roomId}`);
      socket.emit('roomNotFound');
    }
  });


  // teacher stream

  socket.on('teacherStream',(stream) => {
    if(activeRooms[stream.roomId])
    {
      console.log(activeRooms)
    socket.to(activeRooms[stream.roomId].students).emit('getTeacherStream', stream);
    console.log('the teacher stream is',stream.stream)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log("A client has disconnected.");
    // Remove the disconnected client from active rooms
    for (const roomId in activeRooms) {
      const room = activeRooms[roomId];
      if (room.teacher === socket.id) {
        delete activeRooms[roomId];
      } else if (room.students.includes(socket.id)) {
        room.students = room.students.filter((studentId) => studentId !== socket.id);
        socket.to(room.teacher).emit('studentLeft', socket.id);
      }
    }
  });
});

// use the body-parser
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Enable CORS for all routes and all origins
app.use(cors());

// import routing function
importRoutings(app);

// Apply the error handler middleware
app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${process.env.PORT}`);
});
