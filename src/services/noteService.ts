import axios from "axios";
import type { Note, NewNote } from "../types/note";

// 1. Описываем интерфейс ответа (важно, чтобы он был перед использованием)
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 2. Настраиваем базу и токен
axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 3. Функция получения нотаток
export const fetchNotes = async (
  searchQuery: string = "",
  page: number = 1
): Promise<FetchNotesResponse> => {
  // Убираем <NoteSearchResponse> из axios.get, чтобы не путать TS
  const response = await axios.get("/notes", {
    params: {
      search: searchQuery,
      page: page,
      perPage: 12,
    },
  });
  return response.data;
};

// 4. Функция создания
export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await axios.post("/notes", noteData);
  return response.data;
};

// 5. Функция удаления
export const deleteNote = async (id: string | number): Promise<Note> => {
  const response = await axios.delete(`/notes/${id}`);
  return response.data;
};