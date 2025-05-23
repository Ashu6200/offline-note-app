'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { useSyncNotes } from '@/hooks';
import { RefreshCcw, RefreshCwOff } from 'lucide-react';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const Page = () => {
  const { syncStatus } = useSyncNotes();
  const [newNote, setNewNote] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteData, setNoteData] = useState({
    id: '',
    title: '',
    category: '',
    content: '**Hello world!!!**',
    synced: false,
    updatedAt: new Date().toISOString(),
  });
  const notes = useLiveQuery(async () => {
    let query = await db.notes.orderBy('updatedAt').reverse().toArray();
    return query;
  }, []);

  useEffect(() => {
    if (newNote && !selectedNote) {
      const createNote = async () => {
        const newNoteData = {
          id: uuidv4(),
          title: 'New Note',
          content: '# New Note\n\nStart writing here...',
          category: 'General',
          updatedAt: new Date().toISOString(),
          synced: false,
        };
        setNewNote(false);
        setNoteData(newNoteData);
        await db.notes.add(newNoteData);
      };
      createNote();
    }
  }, [newNote, selectedNote]);

  const hanldeSelectedNote = (id) => {
    setSelectedNote(id);
    setNewNote(false);
  };
  useEffect(() => {
    if (selectedNote) {
      db.notes.get(selectedNote).then((storedNote) => {
        if (storedNote) {
          setNoteData(storedNote);
        }
      });
    }
  }, [selectedNote]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (updatedNote) => {
        await db.notes.put({
          ...updatedNote,
          synced: false,
        });
      }, 500),
    []
  );

  const handleChange = (field, value) => {
    const updateNoteData = {
      ...noteData,
      [field]: value,
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    setNoteData(updateNoteData);
    debouncedSave(updateNoteData);
  };
  const handleDelete = async (id) => {
    if (id) {
      await db.notes.delete(id);
    }
  };
  return (
    <div className='mt-4 mx-auto p-4 flex gap-4 h-screen '>
      <div className='w-8/12'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-semibold text-center'>Note Editor</h1>
          <div className='flex gap-2'>
            <Button
              variant='default'
              onClick={() => {
                setNewNote(true);
              }}
            >
              Add New Note
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                handleDelete(noteData.id);
                setNewNote(true);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className='space-y-2 flex flex-col gap-4'>
          <div className='space-y-1'>
            <Label htmlFor='title' className='text-base font-semibold'>
              Enter the Title
            </Label>
            <Input
              id='title'
              type='text'
              value={noteData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className='w-full p-4 text-sm border-b border-gray-200 '
              placeholder='Note title...'
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='category' className='text-base font-semibold'>
              Select Category
            </Label>

            <Select
              value={noteData.category}
              className='w-full p-4 text-sm border-b border-gray-200 '
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className=''>
                <SelectValue placeholder='Select Category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className='h-[300px] space-y-1'>
            <Label htmlFor='content' className='text-base font-semibold'>
              Enter the content
            </Label>
            <MDEditor
              value={noteData.content}
              onChange={(value) => handleChange('content', value || '')}
              className='h-full'
            />
          </div>
        </div>
      </div>
      <div className='w-4/12 h-full overflow-y-auto overflow-hidden'>
        <h1 className='font-semibold text-black text-3xl'>Recent Note</h1>
        <div className='grid grid-cols-1 gap-2'>
          {notes?.map((note) => {
            return (
              <Card key={note.id} className='w-full p-1 m-0'>
                <CardHeader className='p-2 m-0'>
                  <CardTitle>
                    {note.title}{' '}
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
                <CardContent className='p-2 m-0'>
                  <CardDescription className='text-xs'>
                    {' '}
                    {note.content}
                  </CardDescription>
                </CardContent>
                <CardFooter className='flex gap-2 p-2 m-0'>
                  <Button
                    variant='outline'
                    onClick={() => hanldeSelectedNote(note.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const categories = [
  { label: 'Learning', value: 'Learning' },
  { label: 'Project', value: 'Project' },
  { label: 'Meeting', value: 'Meeting' },
  { label: 'Ideas', value: 'Ideas' },
  { label: 'Personal', value: 'Personal' },
  { label: 'Work', value: 'Work' },
  { label: 'Health', value: 'Health' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Travel', value: 'Travel' },
  { label: 'General', value: 'General' },
];

export default Page;
