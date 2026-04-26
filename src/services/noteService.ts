import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const fetchNotes = async (
  searchQuery: string = "",
  page: number = 1
): Promise<FetchNotesResponse> => {

  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      search: searchQuery,
      page: page,
      perPage: 12,
    },
  });
  return response.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  
  const response = await axios.post<Note>("/notes", noteData);
  return response.data;
};


export const deleteNote = async (id: string): Promise<Note> => {

  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};