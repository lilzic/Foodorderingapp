import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info.tsx';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export interface User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  isAdmin: boolean;
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/make-server-7817ccb1/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || 'Failed to sign up');
      // Add the error code to the error object
      (error as any).code = data.code;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      // Provide more user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/make-server-7817ccb1/profile`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const { profile } = await response.json();
    return profile;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};