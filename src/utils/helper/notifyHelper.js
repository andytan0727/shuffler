import { retryLazy } from "./lazyImportHelper";

/**
 * Generate custom swal to show notification, alert popup and so on
 *
 * @param {*} [mixinOptions={}] Additional options to pass to Swal mixin
 * @returns
 */
const generateCustomSwal = async (mixinOptions = {}) => {
  try {
    const Swal = await retryLazy(() => import("sweetalert2"));
    const notifyStyles = await retryLazy(() =>
      import("./notifyStyles.module.scss")
    );

    return Swal.default.mixin({
      customClass: {
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
 * @param {"error"|"info"|"warning"|"success"} type Type of notification
 * @param {string} message Message that needs to be shown by notification
 */
const notify = async (type, message) => {
  let customSwal;
  try {
    customSwal = await generateCustomSwal({ toast: true });

    const swalDefaultConfig = {
      type,
      title: message,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
    };

    switch (type) {
      case "warning":
      case "error": {
        customSwal.fire({
          ...swalDefaultConfig,
          position: "top-end",
          timer: 2500,
        });
        break;
      }

      case "info":
      case "success": {
        customSwal.fire(swalDefaultConfig);
        break;
      }

      default: {
        customSwal.fire({
          ...swalDefaultConfig,
          title:
            "Default toast is called. You may misconfigure notify function",
        });
      }
    }
  } catch (err) {
    if (customSwal.isVisible()) customSwal.close();
    document.querySelector(".swal2-container").remove();
    console.error("Swal: ", err.message);
  }
};

export { generateCustomSwal, notify };
