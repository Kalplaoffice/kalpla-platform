'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
  UserIcon,
  PlusIcon,
  FunnelIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Discussion, DiscussionReply } from '@/lib/coursePlayerService';

interface DiscussionsManagerProps {
  lessonId: string;
  userId: string;
  onDiscussionClick?: (discussion: Discussion) => void;
  onReplySubmit?: (discussionId: string, content: string) => void;
  onNestedReplySubmit?: (parentReplyId: string, content: string) => void;
}

export default function DiscussionsManager({ 
  lessonId, 
  userId, 
  onDiscussionClick, 
  onReplySubmit, 
  onNestedReplySubmit 
}: DiscussionsManagerProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pinned' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showNestedReplyModal, setShowNestedReplyModal] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [selectedReply, setSelectedReply] = useState<DiscussionReply | null>(null);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [nestedReplyContent, setNestedReplyContent] = useState('');

  useEffect(() => {
    loadDiscussions();
  }, [lessonId]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would call the service here
      // const discussionsData = await coursePlayerService.getLessonDiscussions(lessonId);
      
      // Simulate discussions data
      const mockDiscussions: Discussion[] = [
        {
          id: 'discussion_1',
          lessonId,
          userId: 'user_1',
          userName: 'John Doe',
          userAvatar: 'https://example.com/avatar1.jpg',
          title: 'React Hooks Best Practices',
          content: 'Let\'s discuss the best practices for using React hooks in our projects. I\'ve been working with hooks for a while now and have some insights to share.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: true,
          isLocked: false,
          upvotes: 25,
          downvotes: 3,
          replies: [
            {
              id: 'reply_1',
              discussionId: 'discussion_1',
              userId: 'user_2',
              userName: 'Jane Smith',
              userAvatar: 'https://example.com/avatar2.jpg',
              content: 'I agree! Custom hooks are especially powerful for reusability. Here are some patterns I\'ve found useful...',
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: 8,
              downvotes: 1,
              replies: [
                {
                  id: 'nested_reply_1',
                  discussionId: 'discussion_1',
                  userId: 'user_3',
                  userName: 'Mike Johnson',
                  userAvatar: 'https://example.com/avatar3.jpg',
                  content: 'Great point! I\'d also add that keeping hooks focused on a single responsibility makes them much easier to test.',
                  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                  upvotes: 5,
                  downvotes: 0,
                  replies: []
                }
              ]
            },
            {
              id: 'reply_2',
              discussionId: 'discussion_1',
              userId: 'user_4',
              userName: 'Sarah Wilson',
              userAvatar: 'https://example.com/avatar4.jpg',
              content: 'Another important aspect is the dependency array in useEffect. It\'s crucial to include all dependencies to avoid stale closures.',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: 12,
              downvotes: 0,
              replies: []
            }
          ],
          tags: ['react', 'hooks', 'best-practices']
        },
        {
          id: 'discussion_2',
          lessonId,
          userId: 'user_5',
          userName: 'Alex Brown',
          userAvatar: 'https://example.com/avatar5.jpg',
          title: 'Performance Optimization Techniques',
          content: 'What are your favorite techniques for optimizing React performance? I\'m particularly interested in memoization strategies.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: false,
          isLocked: false,
          upvotes: 18,
          downvotes: 2,
          replies: [
            {
              id: 'reply_3',
              discussionId: 'discussion_2',
              userId: 'user_6',
              userName: 'David Lee',
              userAvatar: 'https://example.com/avatar6.jpg',
              content: 'React.memo, useMemo, and useCallback are my go-to tools. But remember, premature optimization can be counterproductive!',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: 10,
              downvotes: 1,
              replies: []
            }
          ],
          tags: ['react', 'performance', 'optimization']
        },
        {
          id: 'discussion_3',
          lessonId,
          userId: 'user_7',
          userName: 'Emma Davis',
          userAvatar: 'https://example.com/avatar7.jpg',
          title: 'State Management Discussion',
          content: 'When do you choose Redux vs Context API vs local state? I\'m trying to understand the trade-offs.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isPinned: false,
          isLocked: true,
          upvotes: 15,
          downvotes: 1,
          replies: [],
          tags: ['react', 'state-management', 'redux', 'context']
        }
      ];
      
      setDiscussions(mockDiscussions);
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'pinned' && discussion.isPinned) ||
                           (filterStatus === 'locked' && discussion.isLocked);
      
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVote = async (contentId: string, contentType: 'discussion' | 'reply', voteType: 'upvote' | 'downvote') => {
    try {
      // In a real implementation, you would call the service here
      // await coursePlayerService.voteOnContent(contentId, contentType, voteType);
      
      // Update local state
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === contentId && contentType === 'discussion') {
          return {
            ...discussion,
            upvotes: voteType === 'upvote' ? discussion.upvotes + 1 : discussion.upvotes,
            downvotes: voteType === 'downvote' ? discussion.downvotes + 1 : discussion.downvotes
          };
        }
        
        // Update replies
        const updatedReplies = discussion.replies.map(reply => {
          if (reply.id === contentId && contentType === 'reply') {
            return {
              ...reply,
              upvotes: voteType === 'upvote' ? reply.upvotes + 1 : reply.upvotes,
              downvotes: voteType === 'downvote' ? reply.downvotes + 1 : reply.downvotes
            };
          }
          
          // Update nested replies
          const updatedNestedReplies = reply.replies.map(nestedReply => {
            if (nestedReply.id === contentId && contentType === 'reply') {
              return {
                ...nestedReply,
                upvotes: voteType === 'upvote' ? nestedReply.upvotes + 1 : nestedReply.upvotes,
                downvotes: voteType === 'downvote' ? nestedReply.downvotes + 1 : nestedReply.downvotes
              };
            }
            return nestedReply;
          });
          
          return { ...reply, replies: updatedNestedReplies };
        });
        
        return { ...discussion, replies: updatedReplies };
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDiscussionSubmit = async () => {
    if (!discussionTitle.trim() || !discussionContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const discussion = await coursePlayerService.createDiscussion({
      //   lessonId,
      //   userId: userId,
      //   userName: 'Current User',
      //   title: discussionTitle,
      //   content: discussionContent,
      //   isPinned: false,
      //   isLocked: false,
      //   upvotes: 0,
      //   downvotes: 0
      // });
      
      const newDiscussion: Discussion = {
        id: 'discussion_' + Date.now(),
        lessonId,
        userId: userId,
        userName: 'Current User',
        title: discussionTitle,
        content: discussionContent,
        createdAt: new Date().toISOString(),
        isPinned: false,
        isLocked: false,
        upvotes: 0,
        downvotes: 0,
        replies: []
      };
      
      setDiscussions([newDiscussion, ...discussions]);
      setDiscussionTitle('');
      setDiscussionContent('');
      setShowDiscussionModal(false);
      
      if (onDiscussionClick) {
        onDiscussionClick(newDiscussion);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedDiscussion || !replyContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const reply = await coursePlayerService.createDiscussionReply({
      //   discussionId: selectedDiscussion.id,
      //   userId: userId,
      //   userName: 'Current User',
      //   content: replyContent,
      //   upvotes: 0,
      //   downvotes: 0
      // });
      
      const newReply: DiscussionReply = {
        id: 'reply_' + Date.now(),
        discussionId: selectedDiscussion.id,
        userId: userId,
        userName: 'Current User',
        content: replyContent,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        replies: []
      };
      
      setDiscussions(discussions.map(d => 
        d.id === selectedDiscussion.id 
          ? { ...d, replies: [...d.replies, newReply] }
          : d
      ));
      
      setReplyContent('');
      setShowReplyModal(false);
      setSelectedDiscussion(null);
      
      if (onReplySubmit) {
        onReplySubmit(selectedDiscussion.id, replyContent);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleNestedReplySubmit = async () => {
    if (!selectedReply || !nestedReplyContent.trim()) return;
    
    try {
      // In a real implementation, you would call the service here
      // const nestedReply = await coursePlayerService.createNestedReply({
      //   parentReplyId: selectedReply.id,
      //   userId: userId,
      //   userName: 'Current User',
      //   content: nestedReplyContent,
      //   upvotes: 0,
      //   downvotes: 0
      // });
      
      const newNestedReply: DiscussionReply = {
        id: 'nested_reply_' + Date.now(),
        discussionId: selectedReply.discussionId,
        userId: userId,
        userName: 'Current User',
        content: nestedReplyContent,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        replies: []
      };
      
      setDiscussions(discussions.map(discussion => ({
        ...discussion,
        replies: discussion.replies.map(reply =>
          reply.id === selectedReply.id
            ? { ...reply, replies: [...reply.replies, newNestedReply] }
            : reply
        )
      })));
      
      setNestedReplyContent('');
      setShowNestedReplyModal(false);
      setSelectedReply(null);
      
      if (onNestedReplySubmit) {
        onNestedReplySubmit(selectedReply.id, nestedReplyContent);
      }
    } catch (error) {
      console.error('Error submitting nested reply:', error);
    }
  };

  const renderReplies = (replies: DiscussionReply[], depth: number = 0) => {
    return replies.map((reply) => (
      <div key={reply.id} className={`${depth > 0 ? 'ml-8' : ''} mt-3`}>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start space-x-3 mb-2">
            <img
              src={reply.userAvatar || '/default-avatar.png'}
              alt={reply.userName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {reply.userName}
                </span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{formatDate(reply.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleVote(reply.id, 'reply', 'upvote')}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
              >
                <HandThumbUpIcon className="h-3 w-3" />
                <span className="text-xs">{reply.upvotes}</span>
              </button>
              <button
                onClick={() => handleVote(reply.id, 'reply', 'downvote')}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
              >
                <HandThumbDownIcon className="h-3 w-3" />
                <span className="text-xs">{reply.downvotes}</span>
              </button>
            </div>
            
            <button
              onClick={() => {
                setSelectedReply(reply);
                setShowNestedReplyModal(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reply
            </button>
          </div>
          
          {/* Nested Replies */}
          {reply.replies.length > 0 && (
            <div className="mt-3">
              {renderReplies(reply.replies, depth + 1)}
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading discussions...</span>
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
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Discussions</option>
              <option value="pinned">Pinned</option>
              <option value="locked">Locked</option>
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
          
          <button
            onClick={() => setShowDiscussionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Start Discussion</span>
          </button>
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredAndSortedDiscussions.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {discussions.length === 0 ? 'No discussions yet' : 'No discussions match your filters'}
            </p>
            <p className="text-sm text-gray-400">
              {discussions.length === 0 ? 'Start the first discussion about this lesson' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          filteredAndSortedDiscussions.map((discussion) => (
            <div key={discussion.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={discussion.userAvatar || '/default-avatar.png'}
                  alt={discussion.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{discussion.title}</h3>
                    {discussion.isPinned && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pinned
                      </span>
                    )}
                    {discussion.isLocked && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center">
                        <LockClosedIcon className="h-3 w-3 mr-1" />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{discussion.content}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>by {discussion.userName}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(discussion.createdAt)}</span>
                    {discussion.tags && discussion.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex space-x-1">
                          {discussion.tags.map((tag, index) => (
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
                    onClick={() => handleVote(discussion.id, 'discussion', 'upvote')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                    <span className="text-sm">{discussion.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(discussion.id, 'discussion', 'downvote')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                  >
                    <HandThumbDownIcon className="h-4 w-4" />
                    <span className="text-sm">{discussion.downvotes}</span>
                  </button>
                </div>
                
                {!discussion.isLocked && (
                  <button
                    onClick={() => {
                      setSelectedDiscussion(discussion);
                      setShowReplyModal(true);
                    }}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span className="text-sm">Reply</span>
                  </button>
                )}
              </div>
              
              {/* Replies */}
              {discussion.replies.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {discussion.replies.length} Reply{discussion.replies.length !== 1 ? 'ies' : ''}
                  </h4>
                  
                  <div className="space-y-3">
                    {renderReplies(discussion.replies)}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Start Discussion Modal */}
      {showDiscussionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Start Discussion</h3>
                <button
                  onClick={() => {
                    setShowDiscussionModal(false);
                    setDiscussionTitle('');
                    setDiscussionContent('');
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={discussionTitle}
                    onChange={(e) => setDiscussionTitle(e.target.value)}
                    placeholder="Discussion title..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={discussionContent}
                    onChange={(e) => setDiscussionContent(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDiscussionModal(false);
                      setDiscussionTitle('');
                      setDiscussionContent('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDiscussionSubmit}
                    disabled={!discussionTitle.trim() || !discussionContent.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                      !discussionTitle.trim() || !discussionContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Start Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedDiscussion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reply to Discussion</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedDiscussion(null);
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
                  <h4 className="font-medium text-gray-900 mb-2">{selectedDiscussion.title}</h4>
                  <p className="text-sm text-gray-700">{selectedDiscussion.content}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setSelectedDiscussion(null);
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

      {/* Nested Reply Modal */}
      {showNestedReplyModal && selectedReply && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reply to Comment</h3>
                <button
                  onClick={() => {
                    setShowNestedReplyModal(false);
                    setSelectedReply(null);
                    setNestedReplyContent('');
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
                  <p className="text-sm text-gray-700">{selectedReply.content}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                  <textarea
                    value={nestedReplyContent}
                    onChange={(e) => setNestedReplyContent(e.target.value)}
                    rows={3}
                    placeholder="Add your reply..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowNestedReplyModal(false);
                      setSelectedReply(null);
                      setNestedReplyContent('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNestedReplySubmit}
                    disabled={!nestedReplyContent.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                      !nestedReplyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
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
