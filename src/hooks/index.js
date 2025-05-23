import { db } from '@/database/db';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return { isOnline };
};

const url = 'https://68300ce2f504aa3c70f61b95.mockapi.io/api/note/note';
export const mockApi = {
  async getNotes() {
    const res = await axios.get(`${url}`);
    return res.data;
  },
  async getNoteById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  },
  async addNote(note) {
    const res = await axios.post(`${url}`, note);
    return res.data;
  },
  async updateNote(id, note) {
    const res = await axios.put(`${url}/${id}`, note);
    return res.data;
  },
  async deleteNote(id) {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  },
};

export const useSyncNotes = () => {
  const { isOnline } = useOnlineStatus();
  const [syncStatus, setSyncStatus] = useState({});
  const syncNotes = useCallback(async () => {
    if (!isOnline) {
      return;
    }
    const unsyncedNotes = await db.notes
      .toArray()
      .then((notes) => notes.filter((note) => note.synced === false));
    for (const note of unsyncedNotes) {
      try {
        setSyncStatus((prev) => ({ ...prev, [note.id]: 'Syncing...' }));
        if (!note.isDeleted) {
          const serverNote = await mockApi
            .getNotes()
            .then((res) => res.find((n) => n.id === note.id));
          if (serverNote) {
            if (new Date(note.updatedAt) > new Date(serverNote.updatedAt)) {
              await mockApi.updateNote(note.id, {
                title: note.title,
                content: note.content,
                category: note.category,
                updatedAt: note.updatedAt,
              });
            }
          } else {
            await mockApi.addNote({ ...note, synced: true });
          }
          await db.notes.update(note.id, { synced: true });
          setSyncStatus((prev) => ({ ...prev, [note.id]: 'Synced' }));
        } else {
          await mockApi.deleteNote(note.id);
          await db.notes.delete(note.id);
          setSyncStatus((prev) => ({ ...prev, [note.id]: 'Synced' }));
        }
      } catch (error) {
        setSyncStatus((prev) => ({ ...prev, [note.id]: 'Error' }));
        console.log(error);
      }
    }
  }, [isOnline]);

  useEffect(() => {
    syncNotes();
    const interval = setInterval(syncNotes, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);
  return { syncStatus };
};
