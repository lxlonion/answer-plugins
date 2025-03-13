(function() {
  // 定义一个全局对象，类似于 Twitter 的 twttr
  window.userInfoWidget = {
    events: {
      callbacks: {},
      bind: function(event, callback) {
        this.callbacks[event] = callback;
      },
      trigger: function(event) {
        if (this.callbacks[event]) {
          this.callbacks[event]();
        }
      }
    },
    // 初始化函数
    init: function() {
      this.loadUserInfo();
    },
    // 获取用户信息
    loadUserInfo: function() {
      const token = localStorage.getItem('a_ltk');
      
      if (!token) {
        this.renderError('未登录，无法获取用户信息');
        return;
      }

      fetch('/answer/api/v1/user/info', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': token
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.code === 0 && data.data && data.data.info) {
          this.renderUserInfo(data.data.info);
        } else {
          this.renderError('获取用户信息失败: ' + (data.msg || '未知错误'));
        }
      })
      .catch(error => {
        this.renderError('获取用户信息出错: ' + error.message);
      })
      .finally(() => {
        // 触发渲染完成事件
        this.events.trigger('rendered');
      });
    },
    // 渲染用户信息
    renderUserInfo: function(userInfo) {
      const tweets = document.querySelectorAll('.twitter-tweet');
      tweets.forEach(tweet => {
        // 清空现有内容
        tweet.innerHTML = '';
        
        // 创建用户信息卡片
        const card = document.createElement('div');
        card.className = 'user-info-card p-3 border rounded';
        card.style.margin = '10px 0';
        card.style.backgroundColor = '#f8f9fa';
        
        // 添加用户名和显示名称
        const nameDiv = document.createElement('div');
        nameDiv.className = 'mb-2';
        nameDiv.innerHTML = `<strong>用户名:</strong> ${userInfo.username || 'N/A'}`;
        
        const displayNameDiv = document.createElement('div');
        displayNameDiv.className = 'mb-2';
        displayNameDiv.innerHTML = `<strong>显示名称:</strong> ${userInfo.display_name || 'N/A'}`;
        
        // 添加其他信息
        const bioDiv = document.createElement('div');
        bioDiv.className = 'mb-2';
        bioDiv.innerHTML = `<strong>简介:</strong> ${userInfo.bio || 'N/A'}`;
        
        const locationDiv = document.createElement('div');
        locationDiv.className = 'mb-2';
        locationDiv.innerHTML = `<strong>位置:</strong> ${userInfo.location || 'N/A'}`;
        
        // 将所有元素添加到卡片中
        card.appendChild(nameDiv);
        card.appendChild(displayNameDiv);
        card.appendChild(bioDiv);
        card.appendChild(locationDiv);
        
        // 将卡片添加到推文容器
        tweet.appendChild(card);
      });
    },
    // 渲染错误信息
    renderError: function(errorMsg) {
      const tweets = document.querySelectorAll('.twitter-tweet');
      tweets.forEach(tweet => {
        tweet.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
      });
    }
  };
  
  // 初始化
  window.userInfoWidget.init();
})();
