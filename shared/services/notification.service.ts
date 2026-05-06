type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationParams {
  title: string;

  description?: string;

  type?: NotificationType;
}

export const notificationService = {
  show({ title, description, type = "info" }: NotificationParams) {
    console.log(`[${type.toUpperCase()}] ${title}`);

    if (description) {
      console.log(description);
    }
  },

  success(title: string, description?: string) {
    this.show({
      title,
      description,
      type: "success",
    });
  },

  error(title: string, description?: string) {
    this.show({
      title,
      description,
      type: "error",
    });
  },

  warning(title: string, description?: string) {
    this.show({
      title,
      description,
      type: "warning",
    });
  },

  info(title: string, description?: string) {
    this.show({
      title,
      description,
      type: "info",
    });
  },
};
