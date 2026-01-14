import { create } from 'zustand';

export const useEditorStore = create((set) => ({
  config: null,
  elements: [],
  selectedId: null,
  currentPage: 1,
  totalPages: 1,
  zoom: 1,
  
  setConfig:  (config) => set({ 
    config,
    totalPages: config.totalPages || 1,
  }),
  
  setElements: (elements) => {
    const totalPages = Math.max(1, ... elements.map(e => e.page || 1));
    set({ elements, totalPages });
  },
  
  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
    })),
  
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state. elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),
  
  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  
  selectElement: (id) => set({ selectedId: id }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setZoom: (zoom) => set({ zoom }),
}));