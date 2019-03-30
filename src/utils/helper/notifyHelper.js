import Swal from "sweetalert2";
import { toast } from "react-toastify";
import swalStyles from "./swalStyles.module.scss";
import "react-toastify/dist/ReactToastify.min.css";

const customSwal = Swal.mixin({
  customClass: {
    confirmButton: swalStyles.swalSuccessButton,
    cancelButton: swalStyles.swalCancelButton
  },
  buttonsStyling: false
});

const notify = (type, message) => {
  switch (type) {
    case "error": {
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        pauseOnFocusLoss: false
      });
      break;
    }

    case "warning": {
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        pauseOnFocusLoss: false
      });
      break;
    }

    case "success": {
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        pauseOnFocusLoss: false
      });
      break;
    }

    default: {
      return;
    }
  }
};

export { customSwal, notify };
