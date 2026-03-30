import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export default function SkeletonLoading() {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh', // Ensures it takes full screen height
        backgroundColor: '#f9f9f9', // Optional: light background
        padding: 4 
      }}
    >
      <Container maxWidth="lg">
        {/* Header Skeleton */}
        <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 2, width: '60%' }} />
        
        {/* Body Skeletons - Using an array to loop makes it cleaner */}
        {[...Array(6)].map((_, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Skeleton 
              variant="rectangular" 
              height={110} 
              animation="wave" // Wave looks more "alive" than static
              sx={{ borderRadius: 2 }} 
            />
            <Skeleton variant="text" sx={{ mt: 1, width: '80%' }} />
            <Skeleton variant="text" sx={{ width: '40%' }} />
          </Box>
        ))}
      </Container>
    </Box>
  );
}