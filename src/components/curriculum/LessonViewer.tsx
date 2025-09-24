'use client';

import React, { useState } from 'react';
import { 
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Lesson, QuizData } from '@/lib/curriculumService';

interface LessonViewerProps {
  lesson: Lesson;
  onComplete?: () => void;
  isPreview?: boolean;
}

export default function LessonViewer({ lesson, onComplete, isPreview = false }: LessonViewerProps) {
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-8 w-8 text-red-500" />;
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-8 w-8 text-green-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'pdf':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson.quizData) return;

    let correctAnswers = 0;
    let totalQuestions = lesson.quizData.questions.length;

    lesson.quizData.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= lesson.quizData.passingScore) {
      onComplete?.();
    }
  };

  const renderVideoContent = () => {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {lesson.fileUrl ? (
            <video
              controls
              className="w-full h-full"
              poster={lesson.thumbnailUrl}
            >
              <source src={lesson.fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <PlayIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Video not available</p>
                <p className="text-sm opacity-75">Please contact your instructor</p>
              </div>
            </div>
          )}
        </div>
        
        {lesson.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        )}
      </div>
    );
  };

  const renderPDFContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <DocumentTextIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{lesson.title}</h3>
          {lesson.description && (
            <p className="text-gray-600 mb-4">{lesson.description}</p>
          )}
          {lesson.fileUrl ? (
            <div className="space-y-2">
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View PDF
              </a>
              <a
                href={lesson.fileUrl}
                download
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 ml-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download
              </a>
            </div>
          ) : (
            <p className="text-gray-500">PDF not available</p>
          )}
        </div>
      </div>
    );
  };

  const renderQuizContent = () => {
    if (!lesson.quizData) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Quiz: {lesson.title}</h3>
            {lesson.quizData.timeLimit && (
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                {lesson.quizData.timeLimit} minutes
              </div>
            )}
          </div>
          {lesson.description && (
            <p className="text-gray-600 mb-4">{lesson.description}</p>
          )}
          <div className="text-sm text-gray-500">
            Passing Score: {lesson.quizData.passingScore}% | 
            Questions: {lesson.quizData.questions.length} | 
            Retakes: {lesson.quizData.allowRetakes ? 'Allowed' : 'Not Allowed'}
          </div>
        </div>

        {!quizSubmitted ? (
          <div className="space-y-6">
            {lesson.quizData.questions.map((question, index) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                    <div className="text-sm text-gray-500 mb-3">{question.points} points</div>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              onChange={(e) => setQuizAnswers({
                                ...quizAnswers,
                                [question.id]: e.target.value
                              })}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="True"
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [question.id]: e.target.value
                            })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">True</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="False"
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [question.id]: e.target.value
                            })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">False</span>
                        </label>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <input
                        type="text"
                        value={quizAnswers[question.id] || ''}
                        onChange={(e) => setQuizAnswers({
                          ...quizAnswers,
                          [question.id]: e.target.value
                        })}
                        placeholder="Enter your answer..."
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleQuizSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Results */}
            <div className={`rounded-lg p-6 text-center ${
              quizScore && quizScore >= lesson.quizData.passingScore 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex justify-center mb-4">
                {quizScore && quizScore >= lesson.quizData.passingScore ? (
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircleIcon className="h-12 w-12 text-red-500" />
                )}
              </div>
              <h3 className={`text-lg font-medium mb-2 ${
                quizScore && quizScore >= lesson.quizData.passingScore 
                  ? 'text-green-900' 
                  : 'text-red-900'
              }`}>
                {quizScore && quizScore >= lesson.quizData.passingScore ? 'Quiz Passed!' : 'Quiz Failed'}
              </h3>
              <p className={`text-2xl font-bold mb-2 ${
                quizScore && quizScore >= lesson.quizData.passingScore 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {quizScore}%
              </p>
              <p className={`text-sm ${
                quizScore && quizScore >= lesson.quizData.passingScore 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                Passing Score: {lesson.quizData.passingScore}%
              </p>
            </div>

            {/* Question Review */}
            {lesson.quizData.showCorrectAnswers && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Question Review</h4>
                {lesson.quizData.questions.map((question, index) => {
                  const userAnswer = quizAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`border rounded-lg p-4 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-2">{question.question}</h5>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Your answer:</span> {userAnswer || 'No answer'}</p>
                            <p><span className="font-medium">Correct answer:</span> {question.correctAnswer}</p>
                            {question.explanation && (
                              <p><span className="font-medium">Explanation:</span> {question.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Retake Option */}
            {lesson.quizData.allowRetakes && quizScore && quizScore < lesson.quizData.passingScore && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    setQuizScore(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return renderVideoContent();
      case 'pdf':
        return renderPDFContent();
      case 'quiz':
        return renderQuizContent();
      default:
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Content not available</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {getLessonIcon(lesson.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLessonTypeColor(lesson.type)}`}>
                {lesson.type.toUpperCase()}
              </span>
              {lesson.isPreview && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  PREVIEW
                </span>
              )}
            </div>
            
            {lesson.description && (
              <p className="text-gray-600 mb-3">{lesson.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {lesson.duration && (
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {lesson.duration}
                </span>
              )}
              {lesson.type === 'quiz' && lesson.quizData && (
                <span>{lesson.quizData.questions.length} questions</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  );
}
