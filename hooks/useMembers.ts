import { useState, useEffect } from 'react';
import { Member, MembersResponse } from '@/types/member';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data: MembersResponse = await response.json();
      
      if (data.success) {
        setMembers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchMembers();
  };

  return { members, loading, error, refetch };
}