import { mockApi } from '@/hooks';
import Dexie from 'dexie';
import { notesData } from './contant';

export const db = new Dexie('noteappdb');
db.version(1).stores({
  notes: 'id, title, content,category, updatedAt, synced',
});

export const seedNotesData = async () => {
  try {
    await db.notes.bulkPut(
      notesData.map((note) => ({ ...note, synced: false }))
    );
    for (const note of notesData) {
      try {
        let exists = false;
        try {
          const existing = await mockApi.getNoteById(note.id);
          exists = !!existing;
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err;
          }
        }

        if (exists) {
          await mockApi.updateNote(note.id, note);
        } else {
          await mockApi.addNote(note);
        }

        const updated = await db.notes.update(note.id, {
          ...note,
          synced: true,
        });
        if (!updated) {
          console.warn(`Note ${note.id} was not updated in IndexedDB`);
        } else {
          console.log(`Note ${note.id} synced successfully`);
        }
      } catch (error) {
        console.error(
          `Failed to sync note ${note.id}:`,
          error.message || error
        );
      }
    }
    console.log('✅ All notes processed');
  } catch (error) {
    console.error('Error in seedNotesData:', error.message || error);
  }
};

export const resetDatabase = async () => {
  try {
    // Step 1: Clear IndexedDB
    await db.notes.clear();
    console.log('IndexedDB cleared');
    console.log('Mock API (db.json) reset to empty state');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};
