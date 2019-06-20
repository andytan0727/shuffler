import { retryLazy } from "./lazyImportHelper";

const generateCustomSwal = async () => {
  try {
    const Swal = await retryLazy(() => import("sweetalert2"));
    const swalStyles = await retryLazy(() =>
      import("./swalStyles.module.scss")
    );

    return Swal.default.mixin({
      customClass: {
        confirmButton: swalStyles.swalSuccessButton,
        cancelButton: swalStyles.swalCancelButton,
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
    await import("react-toastify/dist/ReactToastify.min.css");

    toast.configure();

    const toastConfig = {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 4000,
      pauseOnFocusLoss: false,
    };

    switch (type) {
      case "error": {
        toast.error(message, toastConfig);
        break;
      }

      case "info": {
        toast.info(message, toastConfig);
        break;
      }

      case "warning": {
        toast.warn(message, toastConfig);
        break;
      }

      case "success": {
        toast.success(message, toastConfig);
        break;
      }

      default: {
        toast.warn(
          "Default toast is called. You may misconfigure notify function",
          toastConfig
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

export { generateCustomSwal, notify };
