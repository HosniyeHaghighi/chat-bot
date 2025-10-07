<template>
  <div ref="messagesContainer" class="message-box flex flex-col gap-6 overflow-y-auto w-full p-hide-scrollbar py-20">
    <!-- حالت لودینگ -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="loading-spinner">در حال دریافت پیام‌ها...</div>
    </div>
    
    <!-- نمایش پیام‌ها -->
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="[
        message.type === 'sender' ? 'dender' : 'reciver',
        'w-[80%] rounded-3xl p-3 h-25 text-right'
      ]"
      :style="{
        backgroundColor: message.type === 'sender' ? 'black' : 'rgba(144, 46, 230, 1)',
        color: 'white',
        marginLeft: message.type === 'sender' ? 'auto' : 'initial',
        marginRight: message.type === 'sender' ? 'initial' : 'auto'
      }"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';

interface Message {
  id: number;
  text: string;
  type: 'sender' | 'receiver';
}

interface Props {
  messages: Message[];
  loading: boolean;
}

const props = defineProps<Props>();
const messagesContainer = ref<HTMLDivElement | null>(null);

// تابع برای اسکرول به پایین
const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  }
};

// وقتی پیام‌ها تغییر می‌کنند، به پایین اسکرول کن
watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });

// وقتی کامپوننت mount شد، به پایین اسکرول کن
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.loading-spinner {
  color: rgba(255, 255, 255, 0.64);
  font-size: 14px;
}

.message-box {
  scroll-behavior: smooth;
}
</style>