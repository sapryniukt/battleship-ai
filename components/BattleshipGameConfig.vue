<script lang="ts" setup>
const selectedBoardSize = ref('10x10');
const difficulty = ref('easy');
const placementMode = ref('random');

const submitSettings = () => {
  console.log('Board Size:', selectedBoardSize.value);
  console.log('Difficulty:', difficulty.value);
  console.log('Placement Mode:', placementMode.value);
  // You can emit an event or call a composable function here
};
</script>

<template>
  <Sheet side="left">
    <SheetTrigger as-child>
      <Button size="lg" variant="outline">Settings</Button>
    </SheetTrigger>
    <SheetContent class="w-full bg-background/80 backdrop-blur-md sm:w-auto" hideOverlay>
      <SheetHeader class="container mx-auto">
        <SheetTitle>Game Settings</SheetTitle>
        <SheetDescription>Customize your game preferences below.</SheetDescription>
        <ScrollArea class="h-full">
          <div class="space-y-6 py-4">
            <!-- Board size -->
            <div class="space-y-2">
              <Label for="board-size">Board Size</Label>
              <Select id="board-size" v-model="selectedBoardSize">
                <SelectTrigger class="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10x10">10 × 10</SelectItem>
                  <SelectItem value="12x12">12 × 12</SelectItem>
                  <SelectItem value="8x8">8 × 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- AI difficulty -->
            <div class="space-y-2">
              <Label for="difficulty">AI Difficulty</Label>
              <RadioGroup id="difficulty" v-model="difficulty">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="option-one" value="easy" />
                  <Label for="option-one">Easy</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="medium" />
                  <Label for="option-two">Medium</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="option-three" value="hard" />
                  <Label for="option-three">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            <!-- Ship placement -->
            <div class="space-y-2">
              <Label for="placement">Ship Placement</Label>
              <Select id="placement" v-model="placementMode">
                <SelectTrigger class="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual" disabled>Manual</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
      </SheetHeader>
      <SheetFooter>
        <Button size="lg" @click="submitSettings">Submit</Button>
        <SheetClose as-child>
          <Button size="lg" variant="outline">Cancel</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style></style>
