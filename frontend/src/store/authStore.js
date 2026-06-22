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
 impersonating: null,

 setAuth: ({ token, role, userId, linkedStudentIds, grade }) =>
 set({ token, role, userId, grade: grade || null, linkedStudentIds: linkedStudentIds || [], viewAs: role, maintenanceReason: null }),

 setUser: (user) => set({ user }),
 setDeviceProfile: (profile) => set({ deviceProfile: profile }),
 toggleView: () => set(s => ({ viewAs: s.viewAs === 'student' ? 'guardian' : 'student' })),

 subscriptionStatus: null,
 setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
 subscriptionInfo: null,
 setSubscriptionInfo: (info) => set({ subscriptionInfo: info }),
 setMaintenance: (reason) => set({ maintenanceReason: reason }),
 clearMaintenance: () => set({ maintenanceReason: null }),

 useAsChild: ({ token, user, childName }) => {
   const s = get();
   if (s.impersonating) return;
   set({
     impersonating: {
       parentToken: s.token,
       parentRole: s.role,
       parentUserId: s.userId,
       parentUser: s.user,
       parentGrade: s.grade,
       parentLinkedStudentIds: s.linkedStudentIds,
       parentSubscriptionStatus: s.subscriptionStatus,
     parentSubscriptionInfo: s.subscriptionInfo,
       childName: childName || user?.name || 'your child',
     },
     token,
     role: user.role,
     userId: user.id,
     user,
     grade: user.grade || null,
     linkedStudentIds: [],
     subscriptionStatus: null,
     subscriptionInfo: null,
   });
 },

 backToParent: () => {
   const s = get();
   if (!s.impersonating) return;
   const p = s.impersonating;
   set({
     token: p.parentToken,
     role: p.parentRole,
     userId: p.parentUserId,
     user: p.parentUser,
     grade: p.parentGrade,
     linkedStudentIds: p.parentLinkedStudentIds,
     subscriptionStatus: p.parentSubscriptionStatus,
     subscriptionInfo: p.parentSubscriptionInfo,
     impersonating: null,
   });
 },

 logout: () => set({
 token: null, role: null, userId: null, user: null, grade: null, subscriptionStatus: null, subscriptionInfo: null,
 linkedStudentIds: [], viewAs: null, impersonating: null
 }),

 isLoggedIn: () => !!get().token,
 }),
 {
 name: 'eduapp-auth',
 partialize: s => ({
 token: s.token, role: s.role, userId: s.userId, grade: s.grade,
 user: s.user, linkedStudentIds: s.linkedStudentIds, maintenanceReason: s.maintenanceReason,
 impersonating: s.impersonating
 })
 }
 )
);

export default useAuthStore;
