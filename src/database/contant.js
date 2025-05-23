import { v4 as uuidv4 } from 'uuid';

export const notesData = [
  {
    id: uuidv4(),
    title: 'JavaScript Closures',
    content:
      'Closures are functions that reference variables in the outer scope from their inner scope.',
    category: 'Learning',
    updatedAt: '2025-05-22T14:30:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Project Kickoff Notes',
    content: 'Define milestones, assign team roles, and create a GitHub repo.',
    category: 'Project',
    updatedAt: '2025-05-21T10:15:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Team Sync Meeting',
    content:
      'Reviewed sprint progress and blocked tasks. Need to finalize API contracts.',
    category: 'Meeting',
    updatedAt: '2025-05-20T09:45:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'App Feature Ideas',
    content: '1. Dark mode\n2. Offline support\n3. Tag-based filtering',
    category: 'Ideas',
    updatedAt: '2025-05-19T17:00:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Grocery List',
    content: '- Milk\n- Bread\n- Eggs\n- Apples',
    category: 'Personal',
    updatedAt: '2025-05-18T08:00:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Weekly Work Summary',
    content:
      'Completed dashboard UI, started API integration for analytics module.',
    category: 'Work',
    updatedAt: '2025-05-17T19:30:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Workout Routine',
    content: 'Mon: Chest + Triceps\nTue: Back + Biceps\nWed: Cardio + Core',
    category: 'Health',
    updatedAt: '2025-05-16T07:45:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Budget Plan for May',
    content: 'Rent: $1000\nGroceries: $250\nSavings Goal: $500',
    category: 'Finance',
    updatedAt: '2025-05-15T12:00:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Paris Travel Checklist',
    content: '- Passport\n- Book Airbnb\n- Buy museum passes',
    category: 'Travel',
    updatedAt: '2025-05-14T11:30:00.000Z',
    synced: true,
  },
  {
    id: uuidv4(),
    title: 'Random Thoughts',
    content: 'What if you could time-block by intention, not task?',
    category: 'General',
    updatedAt: '2025-05-13T14:00:00.000Z',
    synced: true,
  },
];
