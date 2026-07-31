import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket, type RealtimeEvent } from "@/lib/socket";

/**
 * Connects to the Socket.IO server and automatically invalidates React Query
 * caches when relevant server events arrive. Also shows toast notifications
 * for key events.
 *
 * Call this once at the app root so all pages share a single socket.
 */
export function useRealtime() {
  const queryClient = useQueryClient();
  const connectedRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    if (!connectedRef.current) {
      connectedRef.current = true;
    }

    const invalidate = (keys: string[][]) => {
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    };

    const handlers: Record<RealtimeEvent, (data: Record<string, unknown>) => void> = {
      "job:created": (data) => {
        invalidate([["listJobs"], ["getAdminStats"]]);
        toast.success(`New job posted: ${data["title"] ?? "a new role"}`, {
          description: `at ${data["companyName"] ?? "a company"}`,
        });
      },
      "job:updated": () => {
        invalidate([["listJobs"]]);
      },
      "job:deleted": () => {
        invalidate([["listJobs"], ["getAdminStats"]]);
      },
      "application:created": (data) => {
        invalidate([["listApplications"], ["getAdminStats"]]);
        toast.info(`New application received for ${data["jobTitle"] ?? "a job"}`, {
          description: `from ${data["candidateName"] ?? "a candidate"}`,
        });
      },
      "application:updated": (data) => {
        invalidate([["listApplications"]]);
        const status = data["status"] as string | undefined;
        if (status === "approved") {
          toast.success(`Application approved!`, {
            description: `Status updated for ${data["jobTitle"] ?? "your application"}`,
          });
        } else if (status === "rejected") {
          toast.error(`Application rejected`, {
            description: `Status updated for ${data["jobTitle"] ?? "your application"}`,
          });
        }
      },
      "candidate:created": () => {
        invalidate([["listCandidates"], ["getCandidateStats"], ["getAdminStats"]]);
      },
      "candidate:updated": () => {
        invalidate([["listCandidates"], ["getCandidateStats"], ["getAdminStats"]]);
      },
      "company:created": () => {
        invalidate([["listCompanies"], ["getAdminStats"]]);
      },
      "company:updated": () => {
        invalidate([["listCompanies"], ["getAdminStats"]]);
      },
    };

    const entries = Object.entries(handlers) as [RealtimeEvent, (data: Record<string, unknown>) => void][];
    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.on("connect", () => {
      toast.success("Connected", { description: "Real-time updates active", duration: 2000 });
    });

    socket.on("disconnect", () => {
      toast.warning("Disconnected", { description: "Reconnecting…", duration: 3000 });
    });

    return () => {
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [queryClient]);
}

/**
 * Lightweight hook for components that only need the socket connection status.
 */
export function useSocketStatus() {
  const connectedRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    connectedRef.current = socket.connected;

    const onConnect = () => { connectedRef.current = true; };
    const onDisconnect = () => { connectedRef.current = false; };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}
