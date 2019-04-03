import { retryLazy } from "./lazyImportHelper";

const generateCustomSwal = async () => {
  const Swal = await retryLazy(() => import("sweetalert2"));
  const swalStyles = await retryLazy(() => import("./swalStyles.module.scss"));

  return Swal.default.mixin({
    customClass: {
      confirmButton: swalStyles.swalSuccessButton,
      cancelButton: swalStyles.swalCancelButton,
    },
    buttonsStyling: false,
  });
};

const notify = async (type, message) => {
  const { toast } = await retryLazy(() => import("react-toastify"));
  await import("react-toastify/dist/ReactToastify.min.css");

  switch (type) {
    case "error": {
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });
      break;
    }

    case "info": {
      toast.info(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        pauseOnFocusLoss: false,
      });
      break;
    }

    case "warning": {
      toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });
      break;
    }

    case "success": {
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        pauseOnFocusLoss: false,
      });
      break;
    }

    default: {
      return;
    }
  }
};

export { generateCustomSwal, notify };
