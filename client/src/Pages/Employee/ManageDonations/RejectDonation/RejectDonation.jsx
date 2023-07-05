import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {
  getPendingDonations,
  rejectDonation,
  removeDonation,
  setRejectionReason,
  setVisibleReject,
} from '../../../../Redux/Slices/donationSlice';

function RejectDonation() {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux state
  const donation = useSelector((state) => state.donation.donation);
  const queryString = useSelector((state) => state.donation.queryString);
  const visibleReject = useSelector((state) => state.donation.visibleReject);
  const rejectionReason = useSelector((state) => state.donation.rejectionReason);

  const handleClose = () => {
    dispatch(setVisibleReject(false));
  };

  const handleReject = () => {
    if (!rejectionReason) {
      return toast.error('Please enter rejection reason');
    }
    dispatch(rejectDonation({
      id: donation.id,
      rejectionReason,
    }))
      .then((response) => {
        console.log(response);
        dispatch(getPendingDonations(queryString));
        const { status, message } = response.payload;
        if (status === 'success') {
          dispatch(removeDonation(donation.id));
          toast.success(message, {
            autoClose: 2500,
          });
        } else if (status === 'error') {
          toast.error(message);
        } else if (response.payload.errors) {
          const { errors } = response.payload;
          errors.forEach((error) => {
            toast.error(error.msg);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return handleClose();
  };

  return (
    <>
      <Dialog open={visibleReject} onClose={handleClose}>
        <DialogTitle>Reject Donation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject&nbsp;
            <em style={{ color: theme.palette.primary.main }}>
              {donation?.donor?.name}
            </em>
            &nbsp;&#39;s&nbsp;donation ?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => dispatch(setRejectionReason(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleReject}>Reject</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default RejectDonation;
