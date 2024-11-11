import axios from 'axios';
import { consoleClear } from 'contexts/toast-message';
import { config } from 'contexts/token';

export const downloadFile = (url) => {
  axios
    .post(url, '', { ...config, responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QrPay.xlsx`;
      document.body.appendChild(a);
      a.click();
  consoleClear();
    })
    .catch(() => consoleClear());
};
