import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function SimpleBackdrop({estado}) {
  const [open, setOpen] = React.useState(estado);
  const handleClose = () => {
    setOpen(estado);
  };
  const handleOpen = () => {
    setOpen(estado);
  };

  React.useEffect(()=>{
   handleOpen();
  },[estado]);

  return (
    <div>
      
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
