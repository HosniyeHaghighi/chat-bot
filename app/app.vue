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
import { ref, onMounted } from 'vue';
import MessageBox from './components/MessageBox.vue';
import ChatInput from './components/ChatInput.vue';

interface Message {
  id: number;
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

    // --- START OF CHANGES ---

    // 1. Define your backend URL
    const backendUrl = 'http://89.251.9.191:8000'; // Or your server's public IP

    // 2. Create the session ID management function
    function getSessionId() {
      let sessionId = localStorage.getItem('chatSessionId');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('chatSessionId', sessionId);
      }
      return sessionId;
    }

    // 3. Update the sendMessage function
    const sendMessage = async () => {
      if (userInput.value.trim()) {
        const userMessageText = userInput.value;
        
        // Add user's message to the UI immediately
        messages.value.push({
          id: Date.now(),
          text: userMessageText,
          type: 'sender'
        });
        
        userInput.value = '';
        loading.value = true; // Show loading indicator

        try {
          const response = await fetch(`http://89.251.9.191:8000/api/v1/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessageText,
              session_id: getSessionId()
            })
          });

          if (!response.ok) {
            throw new Error(`error!`);
          }

          const data = await response.json();
          
          // Add bot's response to the UI
          messages.value.push({
            id: Date.now() + 1, // Or use an ID from the backend if available
            text: data.response,
            type: 'receiver'
          });

        } catch (error) {
          console.error('Error sending message:', error);
          // Show an error message in the chat
          messages.value.push({
            id: 'error-' + Date.now(),
            text: 'متاسفانه در ارتباط با سرور مشکلی پیش آمد. لطفا دوباره تلاش کنید.',
            type: 'receiver'
          });
        } finally {
          loading.value = false; // Hide loading indicator
        }
      }
    };

    // We no longer need fetchMessages on mount, 
    // but you can keep it if you want to load an initial welcome message from an API.
    onMounted(() => {
      // fetchMessages(); // This can be removed or repurposed
    });
    
    // --- END OF CHANGES ---

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