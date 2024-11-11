import toast from 'react-hot-toast';

// export const consoleClear = () => console.clear()
export const consoleClear = () => {
  // console.clear()
};

export const toastMessage = (code) => {
  if (+code === 3) return toast.error('The password did not match');
  else if (+code === 2) return toast.error('No information found on this');
  else if (+code === 5) return toast.error('Data should not be bushed');
  else if (+code === 6)
    return toast.error(
      'Please check the information entered incorrectly and try again',
    );
  else if (+code === 7) return toast.error('An unknown error has occurred');
};
 
 