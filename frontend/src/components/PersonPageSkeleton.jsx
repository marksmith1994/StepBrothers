import { Box, Skeleton, Button } from '@mui/material';

export default function PersonPageSkeleton() {
  return (
    <Box sx={{ width: '100%', background: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Button disabled sx={{ mb: 2 }}><Skeleton variant="text" width={120} /></Button>
      <Skeleton variant="text" width={280} height={50} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={350} sx={{ mb: 4 }} />
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Box>
  );
}
