'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { notesService } from '@/lib/notesService';
import { qaService } from '@/lib/qaService';
import { discussionService } from '@/lib/discussionService';
import { 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ArrowUturnLeftIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Note {
  id: string;
  content: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  askedAt: string;
  answeredBy?: string;
  answeredAt?: string;
  likes: number;
  isLiked: boolean;
}

interface Discussion {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Array<{
    id: string;
    content: string;
    author: string;
    authorAvatar?: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
  }>;
}

interface VideoTabsProps {
  lessonId: string;
  currentTime?: number;
  onNoteAdd?: (note: Note) => void;
  onQuestionAdd?: (question: Omit<Question, 'id' | 'askedAt' | 'likes' | 'isLiked'>) => void;
  onDiscussionAdd?: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'isLiked' | 'replies'>) => void;
  className?: string;
}

export function VideoTabs({
  lessonId,
  currentTime = 0,
  onNoteAdd,
  onQuestionAdd,
  onDiscussionAdd,
  className = ''
}: VideoTabsProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'notes' | 'qa' | 'discussions'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');

  // Load data from backend services
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load notes
        const notesData = await notesService.getNotesByLesson(lessonId, user.id);
        setNotes(notesData.map(note => ({
          id: note.id,
          content: note.content,
          timestamp: note.timestamp,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        })));

        // Load questions
        const questionsData = await qaService.getQuestionsByLesson(lessonId);
        setQuestions(questionsData.map(q => ({
          id: q.id,
          question: q.question,
          answer: q.answers?.[0]?.answer,
          askedBy: 'Student', // You might want to get the actual student name
          askedAt: q.createdAt,
          answeredBy: q.answers?.[0] ? 'Mentor' : undefined,
          answeredAt: q.answers?.[0]?.createdAt,
          likes: 0, // You might want to add likes to the schema
          isLiked: false
        })));

        // Load discussions
        const discussionsData = await discussionService.getDiscussionsByLesson(lessonId);
        setDiscussions(discussionsData.map(d => ({
          id: d.id,
          content: d.content,
          author: 'Student', // You might want to get the actual author name
          authorAvatar: undefined,
          createdAt: d.createdAt,
          likes: d.likes,
          isLiked: false,
          replies: d.replies.map(r => ({
            id: r.id,
            content: r.content,
            author: 'User', // You might want to get the actual author name
            authorAvatar: undefined,
            createdAt: r.createdAt,
            likes: 0,
            isLiked: false
          }))
        })));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lessonId, user?.id]);

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user?.id) return;

    try {
      const noteData = await notesService.createNote({
        studentId: user.id,
        lessonId,
        content: newNote,
        timestamp: currentTime
      });

      const note: Note = {
        id: noteData.id,
        content: noteData.content,
        timestamp: noteData.timestamp,
        createdAt: noteData.createdAt,
        updatedAt: noteData.updatedAt
      };

      setNotes([note, ...notes]);
      setNewNote('');
      onNoteAdd?.(note);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !user?.id) return;

    try {
      const questionData = await qaService.createQuestion({
        studentId: user.id,
        lessonId,
        question: newQuestion
      });

      const question: Omit<Question, 'id' | 'askedAt' | 'likes' | 'isLiked'> = {
        question: newQuestion,
        askedBy: 'Current User'
      };

      setQuestions([{
        ...question,
        id: questionData.id,
        askedAt: questionData.createdAt,
        likes: 0,
        isLiked: false
      }, ...questions]);
      setNewQuestion('');
      onQuestionAdd?.(question);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleAddDiscussion = async () => {
    if (!newDiscussion.trim() || !user?.id) return;

    try {
      const discussionData = await discussionService.createDiscussion({
        studentId: user.id,
        lessonId,
        title: 'Discussion', // You might want to add a title field
        content: newDiscussion
      });

      const discussion: Omit<Discussion, 'id' | 'createdAt' | 'likes' | 'isLiked' | 'replies'> = {
        content: newDiscussion,
        author: 'Current User'
      };

      setDiscussions([{
        ...discussion,
        id: discussionData.id,
        createdAt: discussionData.createdAt,
        likes: discussionData.likes,
        isLiked: false,
        replies: []
      }, ...discussions]);
      setNewDiscussion('');
      onDiscussionAdd?.(discussion);
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleLike = (type: 'question' | 'discussion', id: string) => {
    if (type === 'question') {
      setQuestions(prev => prev.map(q => 
        q.id === id 
          ? { ...q, likes: q.isLiked ? q.likes - 1 : q.likes + 1, isLiked: !q.isLiked }
          : q
      ));
    } else {
      setDiscussions(prev => prev.map(d => 
        d.id === id 
          ? { ...d, likes: d.isLiked ? d.likes - 1 : d.likes + 1, isLiked: !d.isLiked }
          : d
      ));
    }
  };

  const tabs = [
    { id: 'notes', label: 'Notes', icon: DocumentTextIcon, count: notes.length },
    { id: 'qa', label: 'Q&A', icon: QuestionMarkCircleIcon, count: questions.length },
    { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon, count: discussions.length }
  ];

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Add Note */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Add Note</h3>
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note at the current timestamp..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Current time: {formatTime(currentTime)}
                  </span>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{note.content}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatTime(note.timestamp)}</span>
                        <span>•</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-4">
            {/* Add Question */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Ask a Question</h3>
              <div className="space-y-3">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this lesson..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Ask Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{question.question}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <UserIcon className="h-3 w-3" />
                        <span>{question.askedBy}</span>
                        <span>•</span>
                        <span>{formatDate(question.askedAt)}</span>
                      </div>
                    </div>
                    
                    {question.answer && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{question.answer}</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <UserIcon className="h-3 w-3" />
                          <span>{question.answeredBy}</span>
                          <span>•</span>
                          <span>{formatDate(question.answeredAt!)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike('question', question.id)}
                        className={`flex items-center space-x-1 text-xs ${
                          question.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <HeartIcon className="h-3 w-3" />
                        <span>{question.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                        <ArrowUturnLeftIcon className="h-3 w-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {/* Add Discussion */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Start a Discussion</h3>
              <div className="space-y-3">
                <textarea
                  value={newDiscussion}
                  onChange={(e) => setNewDiscussion(e.target.value)}
                  placeholder="Share your thoughts about this lesson..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleAddDiscussion}
                  disabled={!newDiscussion.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Post Discussion
                </button>
              </div>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {discussion.authorAvatar ? (
                            <img
                              src={discussion.authorAvatar}
                              alt={discussion.author}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{discussion.author}</h4>
                          <span className="text-xs text-gray-500">{formatDate(discussion.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{discussion.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-11">
                      <button
                        onClick={() => handleLike('discussion', discussion.id)}
                        className={`flex items-center space-x-1 text-xs ${
                          discussion.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <HeartIcon className="h-3 w-3" />
                        <span>{discussion.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                        <ArrowUturnLeftIcon className="h-3 w-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {discussion.replies.length > 0 && (
                      <div className="ml-11 space-y-3">
                        {discussion.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                                {reply.authorAvatar ? (
                                  <img
                                    src={reply.authorAvatar}
                                    alt={reply.author}
                                    className="h-6 w-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className="text-xs font-medium text-gray-900">{reply.author}</h5>
                                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-xs text-gray-700 mt-1">{reply.content}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600">
                                  <HeartIcon className="h-3 w-3" />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
