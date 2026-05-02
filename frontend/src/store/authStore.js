import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
 persist(
 (set, get) => ({
 token: null,
 role: null,
 userId: null,
 user: null,
 grade: null,
 linkedStudentIds: [],
 deviceProfile: null,
 viewAs: null,
 maintenanceReason: null,

 setAuth: ({ token, role, userId, linkedStudentIds, grade }) =>
 set({ token, role, userId, grade: grade || null, linkedStudentIds: linkedStudentIds || [], viewAs: role, maintenanceReason: null }),

 setUser: (user) => set({ user }),
 setDeviceProfile: (profile) => set({ deviceProfile: profile }),
 toggleView: () => set(s => ({ viewAs: s.viewAs === 'student' ? 'guardian' : 'student' })),

 subscriptionStatus: null,
 setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
 setMaintenance: (reason) => set({ maintenanceReason: reason }),
 clearMaintenance: () => set({ maintenanceReason: null }),

 logout: () => set({
 token: null, role: null, userId: null, user: null, grade: null, subscriptionStatus: null,
 linkedStudentIds: [], viewAs: null
 // maintenanceReason intentionally NOT cleared here
 }),

 isLoggedIn: () => !!get().token,
 }),
 {
 name: 'eduapp-auth',
 partialize: s => ({
 token: s.token, role: s.role, userId: s.userId, grade: s.grade,
 user: s.user, linkedStudentIds: s.linkedStudentIds, maintenanceReason: s.maintenanceReason, subscriptionStatus: s.subscriptionStatus
 })
 }
 )
);

export default useAuthStore;
