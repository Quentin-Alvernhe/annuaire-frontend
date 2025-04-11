<template>
    <div class="mb-4">
      <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
      <select
        :id="id"
        v-model="selected"
        @change="onChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">{{ defaultOption }}</option>
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.label }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  interface Option {
    id: number;
    label: string;
  }
  
  const props = defineProps<{
    id: string;
    label: string;
    options: Option[];
    defaultOption: string;
    modelValue: number | string;
  }>();
  
  const emit = defineEmits(['update:modelValue', 'change']);
  
  const selected = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    selected.value = newVal;
  });
  
  const onChange = () => {
    emit('update:modelValue', selected.value);
    emit('change', selected.value);
  };
  </script>