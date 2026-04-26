import css from "./App.module.css";
import { useState, useEffect, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchNotes } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1); // Скидаємо сторінку відразу при пошуку
    updateSearchQuery(value);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;
  const noNotesToastShown = useRef(false);

  useEffect(() => {
    if (!isLoading && isSuccess && data?.notes.length === 0 && searchQuery !== "") {
      if (!noNotesToastShown.current) {
        toast.info("No notes found for your request.");
        noNotesToastShown.current = true;
      }
    } else {
      noNotesToastShown.current = false;
    }
  }, [data, isLoading, isSuccess, searchQuery]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong. Please try again later.");
    }
  }, [isError]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleInputChange} value={inputValue} />
        
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        
        <button onClick={() => setModalOpen(true)} className={css.button}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm onCancel={() => setModalOpen(false)} />
          </Modal>
        )}
      </header>

      <main>
        {isLoading && <Loader />}
        
        {isSuccess && data?.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {isSuccess && data?.notes.length === 0 && searchQuery === "" && !isLoading && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Your note list is empty.</p>
        )}
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}