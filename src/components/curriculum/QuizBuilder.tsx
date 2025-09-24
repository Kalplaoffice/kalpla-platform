'use client';

import React, { useState } from 'react';
import { 
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { QuizData, QuizQuestion } from '@/lib/curriculumService';

interface QuizBuilderProps {
  quizData?: QuizData;
  onSave: (quizData: QuizData) => void;
  onCancel: () => void;
}

export default function QuizBuilder({ quizData, onSave, onCancel }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quizData?.questions || [
      {
        id: 'q1',
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 10
      }
    ]
  );
  
  const [settings, setSettings] = useState({
    passingScore: quizData?.passingScore || 70,
    timeLimit: quizData?.timeLimit || 10,
    allowRetakes: quizData?.allowRetakes !== false,
    showCorrectAnswers: quizData?.showCorrectAnswers !== false
  });

  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, {
      options: [...(questions.find(q => q.id === questionId)?.options || []), '']
    });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSave = () => {
    const validQuestions = questions.filter(q => 
      q.question.trim() && 
      (q.type === 'short-answer' || (q.options && q.options.some(opt => opt.trim())))
    );
    
    if (validQuestions.length === 0) {
      alert('Please add at least one valid question');
      return;
    }

    const quizData: QuizData = {
      questions: validQuestions,
      ...settings
    };
    
    onSave(quizData);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return '🔘';
      case 'true-false':
        return '✅';
      case 'short-answer':
        return '📝';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <CogIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Quiz Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.passingScore}
              onChange={(e) => setSettings({ ...settings, passingScore: parseInt(e.target.value) || 0 })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              min="0"
              value={settings.timeLimit}
              onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) || 0 })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.allowRetakes}
              onChange={(e) => setSettings({ ...settings, allowRetakes: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Allow multiple attempts</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => setSettings({ ...settings, showCorrectAnswers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show correct answers after submission</span>
          </label>
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quiz Questions</h3>
          <button
            onClick={addQuestion}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                  <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  {questions.length > 1 && (
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Type */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, { 
                    type: e.target.value as 'multiple-choice' | 'true-false' | 'short-answer',
                    options: e.target.value === 'true-false' ? ['True', 'False'] : question.options
                  })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>

              {/* Question Text */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  rows={2}
                  placeholder="Enter your question here..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Options for Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === option}
                          onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {question.options && question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(question.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {/* True/False Options */}
              {question.type === 'true-false' && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 'True'}
                        onChange={() => updateQuestion(question.id, { correctAnswer: 'True' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">True</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === 'False'}
                        onChange={() => updateQuestion(question.id, { correctAnswer: 'False' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">False</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Short Answer */}
              {question.type === 'short-answer' && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <input
                    type="text"
                    value={question.correctAnswer as string}
                    onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                    placeholder="Enter the correct answer..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Points */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  min="1"
                  value={question.points}
                  onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                  className="w-20 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Explanation */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                <textarea
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                  rows={2}
                  placeholder="Explain why this is the correct answer..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}
