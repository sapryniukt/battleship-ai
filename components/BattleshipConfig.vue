<template>
  <SheetContent side="left" class="w-full bg-background/30 backdrop-blur-md sm:w-auto">
    <SheetHeader class="container mx-auto">
      <SheetTitle>Battleship Strategy Game</SheetTitle>
      <SheetDescription>Customize your players preferences below.</SheetDescription>
      <ScrollArea class="h-full">
        <div class="flex flex-col space-y-2 py-4"><slot /></div>
      </ScrollArea>
    </SheetHeader>
    <SheetFooter>
      <SheetClose as-child>
        <Button size="lg" @click.prevent="eventBus.emit('game:reset')">New Game</Button>
      </SheetClose>
      <SheetClose as-child>
        <Button size="lg" variant="secondary">Continue</Button>
      </SheetClose>
      <BattleshipGameConfig />
    </SheetFooter>
  </SheetContent>
</template>
