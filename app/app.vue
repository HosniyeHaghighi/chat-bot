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

    const fetchMessages = async () => {
      loading.value = true;
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
        const posts = await response.json();
        
        const apiMessages: Message[] = posts.map((post: any, index: number) => ({
          id: post.id,
          text: post.title,
          type: index % 2 === 0 ? 'sender' : 'receiver'
        }));

        messages.value = apiMessages;
      } catch (error) {
        console.error('Error fetching messages:', error);
        messages.value = [
          {
            id: 1,
            text: 'خطا در دریافت پیام‌ها. لطفا دوباره تلاش کنید.',
            type: 'receiver'
          }
        ];
      } finally {
        loading.value = false;
      }
    };

    const sendMessage = () => {
      if (userInput.value.trim()) {
        const newMessage: Message = {
          id: Date.now(),
          text: userInput.value,
          type: 'sender'
        };
        messages.value.push(newMessage);
        userInput.value = '';
        
        // شبیه‌سازی پاسخ پس از ارسال پیام
        setTimeout(() => {
          const responseMessage: Message = {
            id: Date.now() + 1,
            text: 'پیام شما دریافت شد. من دستیار هوش مصنوعی هستم و در حال حاضر از JSONPlaceholder برای تست استفاده می‌کنم.',
            type: 'receiver'
          };
          messages.value.push(responseMessage);
        }, 1000);
      }
    };

    onMounted(() => {
      fetchMessages();
    });

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
  background-color: rgba(144, 46, 230, 1);
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