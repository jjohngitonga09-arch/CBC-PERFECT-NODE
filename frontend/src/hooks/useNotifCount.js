import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function useNotifCount() {
 const userId = useAuthStore(s => s.userId);
 const [count, setCount] = useState(0);

 const refresh = useCallback(() => {
 if (!userId) return;
 api.get(`/notifications/unread-count/${userId}`)
 .then(r => setCount(r.data?.count || 0))
 .catch(() => {});
 }, [userId]);

 useEffect(() => {
 refresh();
 const id = setInterval(refresh, 30000);
 return () => clearInterval(id);
 }, [refresh]);

 return [count, setCount];
}
