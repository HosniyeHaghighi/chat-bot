<template>
  <div class="sticky bottom-0 inset-x-0 w-full h-24">
    <div
      class="flex items-center justify-between bg-black border border-nutral-850 p-2 rounded-full h-16 gap-1 overflow-hidden"
    >
      <textarea
        :value="modelValue"
        @input="handleInput"
        @keypress.enter.prevent="handleSendMessage"
        class="text-neutral-50 outline-none font-medium bg-transparent h-full flex-grow p-hide-scrollbar p-0.5 textarea"
        placeholder="سوال خود را بپرسید..."
        dir="rtl"
      />
      <icon-svg name="icons:send" class="text-5xl bg-primary-500" @click="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>();

const emit = defineEmits<{
  'update:modelValue': [value: string],
  'send-message': []
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleSendMessage = () => {
  emit('send-message');
};
</script>