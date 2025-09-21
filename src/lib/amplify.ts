import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

// Import the configuration
import config from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(config);

// Create GraphQL client
export const client = generateClient();

// Auth helper functions
export const getCurrentUserInfo = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Role-based access helper
export const getUserRole = async () => {
  try {
    const user = await getCurrentUser();
    const groups = user.signInDetails?.loginId ? 
      await user.signInDetails.loginId : [];
    return groups.length > 0 ? groups[0] : 'Guest';
  } catch (error) {
    return 'Guest';
  }
};

export default Amplify;
