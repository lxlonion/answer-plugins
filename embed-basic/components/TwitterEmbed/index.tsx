/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { useRef, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface UserInfo {
  username: string;
  display_name: string;
  email?: string;
  avatar: string;
}

const TwitterEmbed = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loadingRef.current) {
      return;
    }
    
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('a_ltk');
        if (!token) {
          setError('未找到登录信息，请先登录');
          return;
        }

        const response = await fetch('/answer/api/v1/user/info', {
          headers: {
            'Accept': 'application/json',
            'Authorization': token,
          },
        });

        const data = await response.json();
        
        if (data.code === 0 && data.data && data.data.info) {
          setUserInfo(data.data.info);
        } else {
          setError(data.msg || '获取用户信息失败');
        }
      } catch (err) {
        setError('请求用户信息时出错');
      } finally {
        if (loadingRef.current) {
          const parentElement = loadingRef.current.parentElement;
          if (parentElement) {
            parentElement.style.height = 'auto';
          }
          loadingRef.current.remove();
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <div className="card p-3 mb-3">
        {userInfo ? (
          <div className="d-flex align-items-center">
            {userInfo.avatar && (
              <img 
                src={userInfo.avatar} 
                alt="用户头像" 
                className="rounded-circle me-3" 
                style={{ width: '48px', height: '48px' }}
              />
            )}
            <div>
              <h5 className="mb-1">{userInfo.display_name || userInfo.username}</h5>
              <p className="mb-0 text-muted">用户名: {userInfo.username}</p>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-warning mb-0">{error}</div>
        ) : null}
      </div>
      <span
        ref={loadingRef}
        className="loading position-absolute top-0 left-0 w-100 h-100 z-1 bg-white d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="secondary" />
      </span>
    </>
  );
};

export default TwitterEmbed;
