import { retryLazy } from "./lazyImportHelper";

/**
 * Generate custom swal to show notification, alert popup and so on
 *
 * @param mixinOptions Additional options to pass to Swal mixin
 * @returns
 */
export const generateCustomSwal = async (mixinOptions = {}) => {
  try {
    const Swal = await retryLazy(() => import("sweetalert2"));
    const notifyStyles: any = await retryLazy(() =>
      import("./notifyStyles.module.scss")
    );

    return Swal.default.mixin({
      customClass: {
        container: notifyStyles.swalContainer,
        popup: notifyStyles.swalPopup,
        title: notifyStyles.swalTitle,
        content: notifyStyles.swalContent,
        confirmButton: notifyStyles.swalSuccessButton,
        cancelButton: notifyStyles.swalCancelButton,
      },
      buttonsStyling: false,
      ...mixinOptions,
    });
  } catch (err) {
    console.error(err.message);
  }
};

/**
 * Using sweetalert2 to show toast notification
 *
 * @param type Type of notification
 * @param message Message that needs to be shown by notification
 */
export const notify = async (
  type: "error" | "info" | "warning" | "success",
  message: string
) => {
  let customSwal;
  try {
    customSwal = await generateCustomSwal({ toast: true });

    const swalDefaultConfig = {
      type,
      title: message,
      position: "bottom-end" as const,
      showConfirmButton: false,
      timer: 3000,
    };

    switch (type) {
      case "warning": {
        await customSwal!.fire({
          ...swalDefaultConfig,
          position: "top-end",
          timer: 2500,
        });
        break;
      }

      case "error": {
        await customSwal!.fire({
          ...swalDefaultConfig,
          toast: false,
          position: "center",
          timer: 2500,
        });
        break;
      }

      case "info":
      case "success": {
        await customSwal!.fire(swalDefaultConfig);
        break;
      }

      default: {
        await customSwal!.fire({
          ...swalDefaultConfig,
          title:
            "Default toast is called. You may misconfigure notify function",
        });
      }
    }
  } catch (err) {
    console.log("Swal error: ", err.message);
  } finally {
    // hacks on removeEventListener error on swal
    // when changing theme on fast rate (edge case)
    const swalContainerLeftOver = document.querySelector(".swal2-container");
    if (swalContainerLeftOver) swalContainerLeftOver.remove();
  }
};

/**
 * Custom alert for playlists addition/removal actions
 */
export const noPlaylistProvidedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal!.fire({
    title: "No playlist provided!💢",
    text: "Please select at least one playlist!",
    type: "warning",
  });
};
