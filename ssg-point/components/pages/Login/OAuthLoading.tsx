'use client'
import React, { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OAuthLoading = () => {
  const { data: session, status } = useSession();
  const [token, setToken] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      const requestBody = {
        oauthId: session?.user?.id,
        provider: 'NAVER',
      };

      fetch('https://workjo.duckdns.org/api/v1/auth/oauth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then((res) => {
        console.log("Response: ", res);
        return res.json();
      })
      .then((data) => {
        console.log("유저데이터: ", data);

        if (data.code === 'S001') {
          fetch ('https://workjo.duckdns.org/api/v1/auth/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': data.data.token,
            },
          })
          router.push('/');
          
        } else {
          router.push('/totallogin');
        }
      });
    }
  }, [session, status]);

  return (
    <div>
      {/* Loading indicator */}
    </div>
  );
};

export default OAuthLoading;