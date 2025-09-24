'use client';

import React, { useState, useEffect } from 'react';
import { 
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Question, Answer, Reply } from '@/lib/coursePlayerService';

interface QAManagerProps {
  lessonId: string;
  userId: string;
  onQuestionClick?: (question: Question) => void;
  onAnswerSubmit?: (questionId: string, content: string) => void;
  onReplySubmit?: (answerId: string, content: string) => void;
}

export default function QAManager({ 
  lessonId, 
  userId, 
  onQuestionClick, 
  onAnswerSubmit, 
  onReplySubmit 
}: QAManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would call the service here
      // const questionsData = await coursePlayerService.getLessonQuestions(lessonId);
      
      // Simulate questions data
      const mockQuestions: Question[] = [
        {
          id: 'question_1',
          lessonId,
          userId: 'user_1',
          userName: 'John Doe',
          userAvatar: 'https://example.com/avatar1.jpg',
          content: 'Can someone explain the difference between useState and useEffect? I\'m having trouble understanding when to use each one.',
          timestamp: 300,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isResolved: true,
          isPinned: false,
          upvotes: 15,
          downvotes: 2,
          answers: [
            {
              id: 'answer_1',
              questionId: 'question_1',
              userId: 'user_2',
              userName: 'Jane Smith',
              userAvatar: 'https://example.com/avatar2.jpg',
              content: 'useState is for managing state in your component, while useEffect is for handling side effects like API calls, subscriptions, or cleanup. Think of useState as your component\'s memory and useEffect as your component\'s actions.',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              isAccepted: true,
              upvotes: 12,
              downvotes: 1,
              replies: [
                {
                  id: 'reply_1',
                  answerId: 'answer_1',
                  userId: 'user_3',
                  userName: 'Mike Johnson',
                  userAvatar: 'https://example.com/avatar3.jpg',
                  content: 'Great explanation! I\'d also add that useEffect runs after every render by default, but you can control when it runs with the dependency array.',
                  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                  upvotes: 5,
                  downvotes: 0
                }
              ]
            }
          ],
          tags: ['react', 'hooks', 'state']
        },
        {
          id: 'question_2',
          lessonId,
          userId: 'user_4',
          userName: 'Sarah Wilson',
          userAvatar: 'https://example.com/avatar4.jpg',
          content: 'What is the best practice for handling async operations in React? Should I use useEffect with async functions?',
          timestamp: 600,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
          isPinned: true,
          upvotes: 8,
          downvotes: 1,
          answers: [
            {
              id: 'answer_2',
              questionId: 'question_2',
              userId: 'user_5',
              userName: 'Alex Brown',
              userAvatar: 'https://example.com/avatar5.jpg',
              content: 'You can use async functions inside useEffect, but be careful about cleanup. Here\'s a common pattern...',
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              isAccepted: false,
              upvotes: 3,
              downvotes: 0,
              replies: []
            }
          ],
          tags: ['react', 'async', 'useeffect']
        },
        {
          id: 'question_3',
          lessonId,
          userId: 'user_6',
          userName: 'David Lee',
          userAvatar: 'https://example.com/avatar6.jpg',
          content: 'How do I prevent infinite re-renders when using useEffect?',
          timestamp: 900,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isResolved: false,
          isPinned: false,
          upvotes: 6,
          downvotes: 0,
          answers: [],
          tags: ['react', 'useeffect', 'performance']
        }
      ];
      
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedQuestions = questions
    .filter(question => {
      const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'resolved' && question.isResolved) ||
                           (filterStatus === 'unresolved' && !question.isResolved);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        default:
          return 0;
      }
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

  const handleVote = async (contentId: string, contentType: 'question' | 'answer', voteType: 'upvote' | 'downvote') => {
    try {
      // In a real implementation, you would call the service here
      // await coursePlayerService.voteOnContent(contentId, contentType, voteType);
      
      // Update local state
      setQuestions(questions.map(question => {
        if (question.id === contentId && contentType === 'question') {
          return {
            ...question,
            upvotes: voteType === 'upvote' ? question.upvotes + 1 : question.upvotes,
            downvotes: voteType === 'downvote' ? question.downvotes + 1 : question.downvotes
          };
        }
        
        // Update answers
        const updatedAnswers = question.answers.map(answer => {
          if (answer.id === contentId && contentType === 'answer') {
            return {
              ...answer,
              upvotes: voteType === 'upvote' ? answer.upvotes + 1 : answer.upvotes,
              downvotes: voteType === 'downvote' ? answer.downvotes + 1 : answer.downvotes
            };
          }
          return answer;
        });
        
        return { ...question, answers: updatedAnswers };
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion || !answerContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const answer = await coursePlayerService.createAnswer({
      //   questionId: selectedQuestion.id,
      //   userId: userId,
      //   userName: 'Current User',
      //   content: answerContent,
      //   isAccepted: false,
      //   upvotes: 0,
      //   downvotes: 0
      // });
      
      const newAnswer: Answer = {
        id: 'answer_' + Date.now(),
        questionId: selectedQuestion.id,
        userId: userId,
        userName: 'Current User',
        content: answerContent,
        createdAt: new Date().toISOString(),
        isAccepted: false,
        upvotes: 0,
        downvotes: 0,
        replies: []
      };
      
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      ));
      
      setAnswerContent('');
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      
      if (onAnswerSubmit) {
        onAnswerSubmit(selectedQuestion.id, answerContent);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedAnswer || !replyContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const reply = await coursePlayerService.createReply({
      //   answerId: selectedAnswer.id,
      //   userId: userId,
      //   userName: 'Current User',
      //   content: replyContent,
      //   upvotes: 0,
      //   downvotes: 0
      // });
      
      const newReply: Reply = {
        id: 'reply_' + Date.now(),
        answerId: selectedAnswer.id,
        userId: userId,
        userName: 'Current User',
        content: replyContent,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0
      };
      
      setQuestions(questions.map(question => ({
        ...question,
        answers: question.answers.map(answer =>
          answer.id === selectedAnswer.id
            ? { ...answer, replies: [...answer.replies, newReply] }
            : answer
        )
      })));
      
      setReplyContent('');
      setShowReplyModal(false);
      setSelectedAnswer(null);
      
      if (onReplySubmit) {
        onReplySubmit(selectedAnswer.id, replyContent);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading questions...</span>
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
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Questions</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredAndSortedQuestions.length === 0 ? (
          <div className="text-center py-8">
            <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {questions.length === 0 ? 'No questions yet' : 'No questions match your filters'}
            </p>
            <p className="text-sm text-gray-400">
              {questions.length === 0 ? 'Be the first to ask a question' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          filteredAndSortedQuestions.map((question) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={question.userAvatar || '/default-avatar.png'}
                  alt={question.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{question.userName}</span>
                    {question.isPinned && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pinned
                      </span>
                    )}
                    {question.isResolved && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{question.content}</p>
                  {question.timestamp && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Asked at {formatTime(question.timestamp)}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatDate(question.createdAt)}</span>
                    {question.tags && question.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex space-x-1">
                          {question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Voting */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(question.id, 'question', 'upvote')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                    <span className="text-sm">{question.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(question.id, 'question', 'downvote')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                  >
                    <HandThumbDownIcon className="h-4 w-4" />
                    <span className="text-sm">{question.downvotes}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowAnswerModal(true);
                  }}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span className="text-sm">Answer</span>
                </button>
              </div>
              
              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
                  </h4>
                  
                  <div className="space-y-3">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start space-x-3 mb-2">
                          <img
                            src={answer.userAvatar || '/default-avatar.png'}
                            alt={answer.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {answer.userName}
                              </span>
                              {answer.isAccepted && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  Accepted
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{answer.content}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>{formatDate(answer.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleVote(answer.id, 'answer', 'upvote')}
                              className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                            >
                              <HandThumbUpIcon className="h-3 w-3" />
                              <span className="text-xs">{answer.upvotes}</span>
                            </button>
                            <button
                              onClick={() => handleVote(answer.id, 'answer', 'downvote')}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                            >
                              <HandThumbDownIcon className="h-3 w-3" />
                              <span className="text-xs">{answer.downvotes}</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedAnswer(answer);
                              setShowReplyModal(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Reply
                          </button>
                        </div>
                        
                        {/* Replies */}
                        {answer.replies.length > 0 && (
                          <div className="mt-3 pl-8 space-y-2">
                            {answer.replies.map((reply) => (
                              <div key={reply.id} className="bg-white rounded p-2">
                                <div className="flex items-start space-x-2">
                                  <img
                                    src={reply.userAvatar || '/default-avatar.png'}
                                    alt={reply.userName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-1 mb-1">
                                      <span className="text-xs font-medium text-gray-900">
                                        {reply.userName}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-700">{reply.content}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs text-gray-500">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <button className="flex items-center space-x-1 text-gray-400 hover:text-green-600">
                                          <HandThumbUpIcon className="h-3 w-3" />
                                          <span className="text-xs">{reply.upvotes}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-gray-400 hover:text-red-600">
                                          <HandThumbDownIcon className="h-3 w-3" />
                                          <span className="text-xs">{reply.downvotes}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Answer Question</h3>
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setSelectedQuestion(null);
                    setAnswerContent('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{selectedQuestion.content}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                  <textarea
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    rows={4}
                    placeholder="Provide a helpful answer..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAnswerModal(false);
                      setSelectedQuestion(null);
                      setAnswerContent('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!answerContent.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                      !answerContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedAnswer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reply to Answer</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedAnswer(null);
                    setReplyContent('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{selectedAnswer.content}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    placeholder="Add your reply..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setSelectedAnswer(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                      !replyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Submit Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
