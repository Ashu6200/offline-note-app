'use client';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db, seedNotesData } from '@/database/db';
import { useSyncNotes } from '@/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { RefreshCcw, RefreshCwOff, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const { syncStatus } = useSyncNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const notes = useLiveQuery(async () => {
    let query = await db.notes.orderBy('updatedAt').reverse();
    if (searchQuery) {
      query = query.filter((note) => {
        return (
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    return query.toArray();
  }, [searchQuery]);
  useEffect(() => {
    async function initializeData() {
      const noteCount = await db.notes.count();
      if (noteCount === 0) {
        await seedNotesData();
      }
    }
    initializeData();
  }, []);

  return (
    <section className='w-full min-h-screen'>
      <div className='mt-4 mx-auto max-w-5xl p-4'>
        <h1 className='text-lg font-bold tracking-tight'>
          Search Profiles
          <p className='text-black text-sm font-medium'>
            {'Find specific Note by role, company, or skills.'}
          </p>
        </h1>
        <div className='relative mt-2'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-black' />
          <Input
            placeholder='Search by role, company, or skills...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='grid grid-cols-3 mt-4 gap-2'>
          {notes?.map((note) => {
            return (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle>
                    {note.title}
                    <Badge variant='secondary'> {note.category}</Badge>
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    {syncStatus[note.id] ||
                      (note.synced ? <RefreshCcw /> : <RefreshCwOff />)}
                    <p className='text-gray-600 text-xs'>
                      Last updated: {new Date(note.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription> {note.content}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Home;
