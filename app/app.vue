<template>
  <div dir="rtl">
    <div class="w-full flex items-center h-screen">
      <div class="app-container flex flex-col bg-cover h-screen px-4 pb-4">
        <div
          class="alert-box w-80 h-max alert-box text-white mt-6 flex items-center justify-center rounded-3xl flex-col border-nutral-850 w-full px-4 pt-4 pb-8"
        >
          <div class="w-12 h-12">
            <icon-svg name="icons:icon" class="text-5xl" />
          </div>
          <span class="mt-4 text-white text-sm font-medium"
            >سلام خوش‌آمدی
          </span>
          <span class="text-sm text-justify text-neutral-064 font-medium">
            من دستیار هوش مصنوعی رویداد هستم، هر سوالی از آرش سروری داری ازم
            بپرس، اگه سوالی راجب به رویداد داری هم در خدمتم</span
          >
        </div>

        <MessageBox :messages="messages" :loading="loading" />
        <ChatInput v-model="userInput" @send-message="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import MessageBox from './components/MessageBox.vue';
import ChatInput from './components/ChatInput.vue';

interface Message {
  id: number | string;
  text: string;
  type: 'sender' | 'receiver';
}

export default {
  components: {
    MessageBox,
    ChatInput
  },
  setup() {
    const userInput = ref('');
    const messages = ref<Message[]>([]);
    const loading = ref(false);

    const backendUrl = 'http://89.251.9.191:8000';

    // --- START OF THE FIX ---
    // تابع جدید و مقاوم برای ساخت شناسه
    function generateUUID() {
      // اگر crypto.randomUUID در دسترس و امن بود، از آن استفاده کن
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // در غیر این صورت، از روش جایگزین استفاده کن
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function getSessionId() {
      let sessionId = localStorage.getItem('chatSessionId');
      if (!sessionId) {
        sessionId = generateUUID(); // استفاده از تابع جدید
        localStorage.setItem('chatSessionId', sessionId);
      }
      return sessionId;
    }
    // --- END OF THE FIX ---

    const sendMessage = async () => {
      console.log('sendMessage function was called!');

      if (userInput.value.trim()) {
        const userMessageText = userInput.value;
        
        messages.value.push({
          id: 'msg-' + Date.now(),
          text: userMessage-Text,
          type: 'sender'
        });
        
        userInput.value = '';
        loading.value = true;

        try {
          console.log('Sending fetch request to backend...');
          const response = await fetch(`${backendUrl}/api/v1/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessageText,
              session_id: getSessionId()
            })
          });
          console.log('Fetch request sent.');

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          messages.value.push({
            id: 'res-' + Date.now(),
            text: data.response,
            type: 'receiver'
          });

        } catch (error) {
          console.error('Error sending message:', error);
          messages.value.push({
            id: 'error-' + Date.now(),
            text: 'متاسفانه در ارتباط با سرور مشکلی پیش آمد. لطفا دوباره تلاش کنید.',
            type: 'receiver'
          });
        } finally {
          loading.value = false;
        }
      } else {
        console.log('User input is empty.');
      }
    };
    
    return {
      userInput,
      messages,
      loading,
      sendMessage
    };
  }
};
</script>

<style>
/* استایل‌های قبلی شما */
@import "../assets/css/main.css";
.app-container {
  width: min(100vw, 360px);
  margin: 0 auto;
  background: #000 url("/bg.svg") center no-repeat;
}
.alert-box {
  background-color: #00000014;
  backdrop-filter: blur(2px);
  border: 1px solid #cacaca;
}
.text-neutral-064 {
  color: rgba(255, 255, 255, 0.64);
}
.text-neutral-500 {
  color: rgba(158, 158, 158, 1);
}
.text-neutral-0 {
  color: rgba(255, 255, 255, 1);
}
.text-nutral-50{
  color: rgba(158, 158, 158, 1);
}
.border-nutral-850{
  border-color: rgba(47, 47, 47, 1);
}
.bg-primary-500{
  color: rgba(144, 46, 230, 1);
}
.message-box {
  height: calc(100vh - 298px);
}
.textarea {
  resize: none;
}
.textarea::placeholder {
  padding-top: 0.625rem;
  font-size: 14px;
}
</style>