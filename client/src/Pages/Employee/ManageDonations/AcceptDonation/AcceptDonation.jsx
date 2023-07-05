import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import moment from 'moment';

import {
  acceptDonation,
  getPendingDonations,
  removeDonation,
  setBloodGroup,
  setBloodLifetime,
  setVisibleAccept,
} from '../../../../Redux/Slices/donationSlice';

function AcceptDonation() {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux state
  const donation = useSelector((state) => state.donation.donation);
  const queryString = useSelector((state) => state.donation.queryString);
  const visibleAccept = useSelector((state) => state.donation.visibleAccept);
  const bloodGroup = useSelector((state) => state.donation.bloodGroup);
  const bloodLifetime = useSelector((state) => state.donation.bloodLifetime);

  // Local State
  const [helperText, setHelperText] = useState('');
  const [validLifetime, setValidLifetime] = useState(true);

  const handleBloodLifetimeChange = () => {
    const now = moment();
    const diffInDays = now.diff(donation.createdAt, 'days');
    const validationSpan = bloodLifetime - diffInDays;

    if (validationSpan > 0) {
      setValidLifetime(true);
      setHelperText(`Note: Blood donation will expire after ${bloodLifetime - diffInDays} day(s)`);
    } else {
      setValidLifetime(false);
      setHelperText('Warning: Blood donation has been expired and won\'t be accepted');
    }
  };

  useEffect(() => {
    handleBloodLifetimeChange();
  }, [bloodLifetime]);

  const handleClose = () => {
    dispatch(setVisibleAccept(false));
  };

  const handleAccept = () => {
    if (!validLifetime) {
      return toast.error(helperText);
    }

    dispatch(acceptDonation({
      id: donation.id,
      bloodGroup,
      bloodLifetime,
    }))
      .then((response) => {
        console.log(response);
        dispatch(getPendingDonations(queryString));
        const { status, message } = response.payload;
        if (status === 'success') {
          dispatch(removeDonation());
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
      <Dialog open={visibleAccept} onClose={handleClose}>
        <DialogTitle>Accept Donation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept&nbsp;
            <em style={{ color: theme.palette.success.main }}>
              {donation?.donor?.name}
            </em>
            &nbsp;&#39;s&nbsp;donation ?
          </DialogContentText>

          <InputLabel style={{ fontSize: '14px', marginTop: '20px', marginBottom: '5px' }} id="select-blood-group-label">Blood Group</InputLabel>
          <Select
            size="small"
            labelId="select-blood-group-label"
            id="select-blood-group"
            value={bloodGroup}
            fullWidth
            onChange={(e) => dispatch(setBloodGroup(e.target.value))}
            style={{ marginBottom: '20px', padding: 0 }}
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </Select>

          <TextField
            autoFocus
            margin="dense"
            id="blood-lifetime"
            label="Blood Lifetime"
            type="text"
            fullWidth
            variant="standard"
            value={bloodLifetime}
            onChange={(e) => dispatch(setBloodLifetime(e.target.value))}
            helperText={helperText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">Cancel</Button>
          <Button onClick={handleAccept} color="success">Accept</Button>
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

export default AcceptDonation;
