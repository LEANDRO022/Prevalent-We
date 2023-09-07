import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

// Props tipadas del componente
interface LoadingProps {
  open: boolean;
}

function Loading({ open = true }: LoadingProps) {
  return (
    <Backdrop
      open={open}
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
}

export default Loading;
