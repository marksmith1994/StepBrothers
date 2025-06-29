import create from 'zustand';

// UI store: theme, sidebar, modal, etc.
export const useUIStore = create((set) => ({
  // Theme: 'light' | 'dark' | 'system'
  theme: 'system',
  setTheme: (theme) => set({ theme }),

  // Sidebar open/close
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modal state (example)
  modal: null, // e.g., { type: 'login', props: {...} }
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),

  // Snackbar/Toast
  snackbar: null, // e.g., { message, severity }
  showSnackbar: (snackbar) => set({ snackbar }),
  hideSnackbar: () => set({ snackbar: null }),
})); 