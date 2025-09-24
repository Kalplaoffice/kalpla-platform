'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { generateClient } from 'aws-amplify/api';
import { LIST_LEADERS } from '@/graphql/queries';

interface Leader {
  id: string;
  name: string;
  imageUrl: string;
  brandName?: string;
  brandLogoUrl: string;
  createdAt?: string;
  updatedAt: string;
}

export default function LeadersSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const client = generateClient();
        const result = await client.graphql({
          query: LIST_LEADERS,
          variables: {
            limit: 6 // Limit to 6 leaders for the homepage
          }
        });
        
        if (result.data?.listLeaders?.items) {
          setLeaders(result.data.listLeaders.items);
        }
      } catch (err) {
        console.error('Error fetching leaders:', err);
        // Fallback to mock data if API fails
        setLeaders([
          {
            id: '1',
            name: 'Narayana Murthy',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'Infosys',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sachin Bansal',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'Flipkart',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Kunal Shah',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'CRED',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Vijay Shekhar Sharma',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'Paytm',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Bhavish Aggarwal',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'Ola',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Deepinder Goyal',
            imageUrl: '/api/placeholder/200/200',
            brandName: 'Zomato',
            brandLogoUrl: '/api/placeholder/64/64',
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning from the leaders who built India's most iconic ventures
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="w-40 h-40 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600 to-blue-600 transform rotate-12 scale-150"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-medium mb-4">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Industry Leaders
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Learning from the leaders who built India's most iconic ventures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get insights from the visionaries who transformed India's startup ecosystem and built billion-dollar companies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leaders.map((leader, index) => (
            <div 
              key={leader.id} 
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Leader Image */}
              <div className="relative w-40 h-40 mx-auto mb-4 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={leader.imageUrl}
                  alt={leader.name}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Leader Name */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                {leader.name}
              </h3>
              
              {/* Brand Logo */}
              <div className="w-16 h-16 mx-auto relative">
                <Image
                  src={leader.brandLogoUrl}
                  alt={leader.brandName || 'brand'}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Real Industry Experience</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Proven Track Records</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Expert Mentorship</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
