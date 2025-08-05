import { createVNode, render } from 'vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface AlertDialogInstance {
  confirm: () => Promise<boolean>;
  close: () => void;
}

const createAlertDialog = (options: AlertOptions): AlertDialogInstance => {
  let resolvePromise: (value: boolean) => void;
  const isOpen = ref(true);

  const promise = new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });

  const handleConfirm = () => {
    isOpen.value = false;
    resolvePromise(true);
  };

  const handleCancel = () => {
    isOpen.value = false;
    resolvePromise(false);
  };

  const vnode = createVNode({
    setup() {
      return () =>
        h(
          AlertDialog,
          {
            open: isOpen.value,
            onOpenChange: (open: boolean) => {
              isOpen.value = open;
            }
          },
          {
            default: () => [
              h(
                AlertDialogContent,
                {},
                {
                  default: () => [
                    h(
                      AlertDialogHeader,
                      {},
                      {
                        default: () => [
                          h(AlertDialogTitle, {}, { default: () => options.title }),
                          options.description && h(AlertDialogDescription, {}, { default: () => options.description })
                        ]
                      }
                    ),
                    h(
                      AlertDialogFooter,
                      {},
                      {
                        default: () => [
                          h(
                            AlertDialogCancel,
                            {
                              onClick: handleCancel,
                              variant: options.cancelVariant
                            },
                            { default: () => options.cancelText || 'Cancel' }
                          ),
                          h(
                            AlertDialogAction,
                            {
                              onClick: handleConfirm,
                              variant: options.confirmVariant
                            },
                            { default: () => options.confirmText || 'Continue' }
                          )
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        );
    }
  });

  const container = document.createElement('div');
  document.body.appendChild(container);
  render(vnode, container);

  const cleanup = () => {
    setTimeout(() => {
      render(null, container);
      document.body.removeChild(container);
    }, 200); // Small delay for animation
  };

  watch(isOpen, (newValue) => {
    if (!newValue) {
      cleanup();
    }
  });

  return {
    confirm: () => promise,
    close: () => {
      isOpen.value = false;
      resolvePromise(false);
    }
  };
};

export const useAlertDialog = () => {
  const instances = new Set<AlertDialogInstance>();

  const alert = async (options: AlertOptions | string): Promise<boolean> => {
    const alertOptions: AlertOptions = typeof options === 'string' ? { title: options } : options;

    const instance = createAlertDialog(alertOptions);
    instances.add(instance);

    const result = await instance.confirm();
    instances.delete(instance);

    return result;
  };

  const closeAll = () => {
    instances.forEach((instance) => instance.close());
    instances.clear();
  };

  onUnmounted(() => {
    closeAll();
  });

  return {
    alert,
    closeAll
  };
};

let globalAlertDialog: ReturnType<typeof useAlertDialog> | null = null;

export const getAlertDialog = () => {
  if (!globalAlertDialog) {
    globalAlertDialog = useAlertDialog();
  }
  return globalAlertDialog;
};

export const alertDialog = (options: AlertOptions | string): Promise<boolean> => {
  return getAlertDialog().alert(options);
};
