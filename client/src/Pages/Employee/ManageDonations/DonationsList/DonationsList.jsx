import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Pagination, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import {
  getPendingDonations,
  setDonation,
  setRejectionReason,
  setVisibleAccept,
  setVisibleReject,
  setPagination,
  setQueryString,
  setBloodLifetime,
  setBloodGroup,
} from '../../../../Redux/Slices/donationSlice';
import RejectDonation from '../RejectDonation/RejectDonation';
import AcceptDonation from '../AcceptDonation/AcceptDonation';

function formatTimeAgo(date) {
  const now = moment();
  const diffInSeconds = now.diff(date, 'seconds');
  const diffInMinutes = now.diff(date, 'minutes');
  const diffInHours = now.diff(date, 'hours');
  const diffInDays = now.diff(date, 'days');

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  return `${diffInDays} days ago`;
}

function DonationsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dispatch = useDispatch();

  // Redux state
  const donations = useSelector((state) => state.donation.donations);
  const pagination = useSelector((state) => state.donation.pagination);

  function updatePage() {
    let page = queryParams.get('page');
    page = parseInt(page, 10);

    if (!Number.isNaN(page)) {
      dispatch(setPagination({ ...pagination, page }));
      return `page=${page}&`;
    }
    dispatch(setPagination({ ...pagination, page: 1 }));
    return '';
  }

  function getQueryString() {
    let queryString = '';

    queryString += updatePage();
    dispatch(setQueryString(queryString));
    return queryString;
  }

  useEffect(() => {
    dispatch(getPendingDonations(getQueryString()));
  }, [window.location.href]);

  const handleDonationAcceptance = (donation) => {
    dispatch(setBloodGroup('A+'));
    dispatch(setBloodLifetime('35'));
    dispatch(setDonation(donation));
    dispatch(setVisibleAccept(true));
  };

  const handleDonationRejection = (donation) => {
    dispatch(setRejectionReason('The blood virus test is positive'));
    dispatch(setDonation(donation));
    dispatch(setVisibleReject(true));
  };

  const handlePageChange = (event, value) => {
    navigate(`/donations?page=${value}`);
  };

  return (
    <>
      <Typography variant="h1" className="text-center my-3">
        Pending Donations
      </Typography>
      {donations.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1100 }} size="small" aria-label="donations table">
              <TableHead>
                <TableRow>
                  <TableCell>National ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Added</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow
                    key={donation.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {donation.donor.nationalId}
                    </TableCell>
                    <TableCell>{donation.donor.name}</TableCell>
                    <TableCell>{donation.donor.email}</TableCell>
                    <TableCell>{donation.city.name}</TableCell>
                    <TableCell>{formatTimeAgo(new Date(donation.createdAt))}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        className="m-2"
                        onClick={() => handleDonationAcceptance(donation)}
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        className="m-2"
                        onClick={() => handleDonationRejection(donation)}
                      >
                        <CloseIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          />
          <AcceptDonation />
          <RejectDonation />
        </>
      ) : (
        <>
          <Typography variant="h3" className="text-center my-3">
            There is no pending donations
          </Typography>
          <AcceptDonation />
          <RejectDonation />
        </>
      )}
    </>
  );
}

export default DonationsList;
