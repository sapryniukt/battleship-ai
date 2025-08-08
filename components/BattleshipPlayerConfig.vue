<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { UserPen } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import type { PlayerConfig } from '~/types/battleship';

const props = defineProps<{
  modelValue?: PlayerConfig | null;
  defaultValue?: PlayerConfig | null;
  class?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', payload: PlayerConfig): void;
}>();

// Use useVModel to create a two-way binding
const config = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: props.defaultValue || {
    name: '',
    useAI: false,
    aiStrategy: 'llm',
    llmProvider: 'openai',
    llmModel: 'gpt-4o-mini'
  }
});

const aiModelOptions = computed(() => {
  switch (config.value?.llmProvider) {
    case 'openai':
      return ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4o-mini'];
    case 'claude':
      return [
        'claude-3-haiku-20240307',
        'claude-3-5-haiku-latest',
        'claude-3-5-sonnet-latest',
        'claude-3-opus-20240229'
      ];
    case 'gemini':
      return ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    default:
      return [];
  }
});

watch(
  () => config.value?.aiStrategy,
  (newValue) => {
    if (config.value && newValue === 'llm') {
      config.value.name = capitalize(config.value.llmProvider);
    }
  }
);

// Reset model when provider changes
watch(
  () => config.value?.llmProvider,
  () => {
    const models = aiModelOptions.value;
    if (config.value && models.length > 0 && !models.includes(config.value.llmModel || '')) {
      config.value.llmModel = models[0];
      config.value.name = capitalize(config.value.llmProvider);
    }
  }
);
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button size="lg" variant="outline">
        <UserPen class="mr-2 h-4 w-4" />
        <slot>Player</slot>
      </Button>
    </SheetTrigger>
    <SheetContent class="w-full bg-background/80 backdrop-blur-md sm:w-auto" hideOverlay>
      <SheetHeader class="container mx-auto">
        <SheetTitle> Configuration: <slot>Player</slot> </SheetTitle>
        <SheetDescription>Customize your player preferences below.</SheetDescription>
        <ScrollArea class="h-full">
          <div class="space-y-6 py-4">
            <!-- Player Type -->
            <div class="space-y-2" v-if="config">
              <Label for="type">Type</Label>
              <Select v-model="config.useAI">
                <SelectTrigger id="type" class="h-10">
                  <SelectValue :placeholder="config.useAI ? 'AI' : 'User'" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="false">User</SelectItem>
                  <SelectItem :value="true">AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- AI Strategy (only show if AI is selected) -->
            <div v-if="config?.useAI" class="space-y-2">
              <Label for="ai-strategy">AI Strategy</Label>
              <Select v-model="config.aiStrategy">
                <SelectTrigger id="ai-strategy" class="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="hunt-target">Hunt & Target</SelectItem>
                  <SelectItem value="llm">LLM (AI Model)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- AI Provider (only show if LLM strategy is selected) -->
            <div v-if="config?.useAI && config?.aiStrategy === 'llm'" class="space-y-2">
              <Label for="ai-provider">AI Provider</Label>
              <Select v-model="config.llmProvider">
                <SelectTrigger id="ai-provider" class="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- AI Model (only show if LLM strategy is selected) -->
            <div v-if="config?.useAI && config?.aiStrategy === 'llm'" class="space-y-2">
              <Label for="ai-model">AI Model</Label>
              <Select v-model="config.llmModel">
                <SelectTrigger id="ai-model" class="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="model in aiModelOptions" :key="model" :value="model">
                    {{ model }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Player Name -->
            <div class="space-y-2" v-if="config">
              <Label for="player-name">Name</Label>
              <Input id="player-name" class="h-10" v-model="config.name" placeholder="Enter player name" />
            </div>
          </div>
        </ScrollArea>
      </SheetHeader>
      <SheetFooter>
        <SheetClose as-child>
          <Button size="lg" variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
