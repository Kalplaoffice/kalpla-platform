'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookmarkIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Note } from '@/lib/coursePlayerService';

interface NotesManagerProps {
  lessonId: string;
  userId: string;
  onNoteClick?: (note: Note) => void;
  onNoteUpdate?: (note: Note) => void;
  onNoteDelete?: (noteId: string) => void;
}

export default function NotesManager({ 
  lessonId, 
  userId, 
  onNoteClick, 
  onNoteUpdate, 
  onNoteDelete 
}: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'highlight' | 'bookmark'>('all');
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, [lessonId, userId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would call the service here
      // const notesData = await coursePlayerService.getLessonNotes(lessonId, userId);
      
      // Simulate notes data
      const mockNotes: Note[] = [
        {
          id: 'note_1',
          lessonId,
          userId,
          timestamp: 120,
          content: 'Important concept about React hooks - useState is used for managing state in functional components.',
          type: 'text',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isPublic: false,
          tags: ['react', 'hooks', 'state']
        },
        {
          id: 'note_2',
          lessonId,
          userId,
          timestamp: 300,
          content: 'Bookmark this section for later review - useEffect examples',
          type: 'bookmark',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isPublic: true,
          tags: ['react', 'useeffect']
        },
        {
          id: 'note_3',
          lessonId,
          userId,
          timestamp: 450,
          content: 'Key takeaway: Custom hooks allow you to extract component logic into reusable functions.',
          type: 'highlight',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          isPublic: false,
          tags: ['react', 'custom-hooks']
        }
      ];
      
      setNotes(mockNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || note.type === filterType;
    const matchesVisibility = !showPublicOnly || note.isPublic;
    
    return matchesSearch && matchesType && matchesVisibility;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const updatedNote = await coursePlayerService.updateNote(editingNote.id, {
      //   content: editContent,
      //   updatedAt: new Date().toISOString()
      // });
      
      const updatedNote = {
        ...editingNote,
        content: editContent,
        updatedAt: new Date().toISOString()
      };
      
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
      setEditingNote(null);
      setEditContent('');
      
      if (onNoteUpdate) {
        onNoteUpdate(updatedNote);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      // In a real implementation, you would call the service here
      // await coursePlayerService.deleteNote(noteId);
      
      setNotes(notes.filter(note => note.id !== noteId));
      
      if (onNoteDelete) {
        onNoteDelete(noteId);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const toggleNoteVisibility = async (note: Note) => {
    try {
      // In a real implementation, you would call the service here
      // const updatedNote = await coursePlayerService.updateNote(note.id, {
      //   isPublic: !note.isPublic,
      //   updatedAt: new Date().toISOString()
      // });
      
      const updatedNote = {
        ...note,
        isPublic: !note.isPublic,
        updatedAt: new Date().toISOString()
      };
      
      setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
      
      if (onNoteUpdate) {
        onNoteUpdate(updatedNote);
      }
    } catch (error) {
      console.error('Error updating note visibility:', error);
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <PencilIcon className="h-4 w-4 text-blue-500" />;
      case 'highlight':
        return <BookmarkIcon className="h-4 w-4 text-yellow-500" />;
      case 'bookmark':
        return <BookmarkIcon className="h-4 w-4 text-green-500" />;
      default:
        return <PencilIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'highlight':
        return 'bg-yellow-100 text-yellow-800';
      case 'bookmark':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading notes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="text">Text Notes</option>
            <option value="highlight">Highlights</option>
            <option value="bookmark">Bookmarks</option>
          </select>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPublicOnly}
              onChange={(e) => setShowPublicOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Public only</span>
          </label>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
            </p>
            <p className="text-sm text-gray-400">
              {notes.length === 0 ? 'Start taking notes while watching lessons' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getNoteTypeIcon(note.type)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNoteTypeColor(note.type)}`}>
                    {note.type}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {formatTime(note.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleNoteVisibility(note)}
                    className={`p-1 rounded ${
                      note.isPublic 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={note.isPublic ? 'Make private' : 'Make public'}
                  >
                    {note.isPublic ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit note"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete note"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {editingNote?.id === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingNote(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editContent.trim()}
                      className={`px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 ${
                        !editContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-900 mb-3">{note.content}</p>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created {formatDate(note.createdAt)}</span>
                    {note.updatedAt && (
                      <span>Updated {formatDate(note.updatedAt)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {notes.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Notes Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{notes.length}</div>
              <div className="text-xs text-gray-500">Total Notes</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {notes.filter(n => n.type === 'text').length}
              </div>
              <div className="text-xs text-gray-500">Text Notes</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {notes.filter(n => n.isPublic).length}
              </div>
              <div className="text-xs text-gray-500">Public Notes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
