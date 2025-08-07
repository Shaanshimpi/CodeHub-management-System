import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2
      }}
    >
      <CircularProgress />
      {message && <Typography variant="body1">{message}</Typography>}
    </Box>
  )
}

export default Loading