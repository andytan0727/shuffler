import { retryLazy } from "./lazyImportHelper";

const generateCustomSwal = async () => {
  try {
    const Swal = await retryLazy(() => import("sweetalert2"));
    const notifyStyles = await retryLazy(() =>
      import("./notifyStyles.module.scss")
    );

    return Swal.default.mixin({
      customClass: {
        confirmButton: notifyStyles.swalSuccessButton,
        cancelButton: notifyStyles.swalCancelButton,
      },
      buttonsStyling: false,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const notify = async (type, message) => {
  try {
    const { toast } = await retryLazy(() => import("react-toastify"));
    // @ts-ignore
    await import("react-toastify/dist/ReactToastify.min.css");
    const notifyStyles = await retryLazy(() =>
      import("./notifyStyles.module.scss")
    );

    toast.configure();

    const toastConfig = {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 4000,
      pauseOnFocusLoss: false,
    };

    switch (type) {
      case "error": {
        toast.error(message, {
          ...toastConfig,
          className: notifyStyles.toastError,
        });
        break;
      }

      case "info": {
        toast.info(message, {
          ...toastConfig,
          className: notifyStyles.toastInfo,
        });
        break;
      }

      case "warning": {
        toast.warn(message, {
          ...toastConfig,
          className: notifyStyles.toastWarning,
        });
        break;
      }

      case "success": {
        toast.success(message, {
          ...toastConfig,
          className: notifyStyles.toastSuccess,
        });
        break;
      }

      default: {
        toast.warn(
          "Default toast is called. You may misconfigure notify function",
          {
            ...toastConfig,
            className: notifyStyles.toastWarning,
          }
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

export { generateCustomSwal, notify };
