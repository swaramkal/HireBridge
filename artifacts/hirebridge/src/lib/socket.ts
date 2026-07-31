import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({
      path: `${import.meta.env.BASE_URL}api/socket.io`.replace(/\/+/g, "/"),
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export type RealtimeEvent =
  | "job:created"
  | "job:updated"
  | "job:deleted"
  | "application:created"
  | "application:updated"
  | "candidate:created"
  | "candidate:updated"
  | "company:created"
  | "company:updated";
