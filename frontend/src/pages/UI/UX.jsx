import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export default function ChatListSkeleton() {
  // We can render multiple chat items by mapping over an array
  const numberOfSkeletons = 6;

  return (
    <Box sx={{ width: "100%", padding: 0 }}>
      {[...Array(numberOfSkeletons)].map((_, index) => (
        <Box key={index}>
          {/* Main Chat Item Container (Flexbox Row) */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              paddingX: 3,
              paddingY: 2.5,
              justifyContent: "flex-start",
            }}
          >
            {/* 1. The Avatar - Matches the circle in your image */}
            <Skeleton
              variant="circular"
              width={80} // Matched to image size
              height={80}
              animation="wave"
              sx={{ flexShrink: 0 }}
            />

            {/* 2. Middle Text Area - Using a vertical Stack */}
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                flexGrow: 1,
                paddingRight: 2,
                minWidth: 0, // Helps with text truncation (if needed later)
              }}
            >
              {/* Name Skeleton (Bolded text) */}
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1.25rem", width: "60%" }}
              />
              {/* Message Skeleton (Sub-text) */}
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1rem", width: "90%" }}
              />
            </Stack>

            {/* 3. Right-Side Info Area */}
            <Stack
              direction="column"
              alignItems="flex-end"
              spacing={1}
              sx={{
                paddingLeft: 2,
                width: 70, // Fixed width matches timestamp position
              }}
            >
              {/* Timestamp Skeleton */}
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "0.875rem", width: 60 }}
              />
              {/* Notification Dot Skeleton */}
              <Skeleton
                variant="circular"
                animation="wave"
                width={12}
                height={12}
              />
            </Stack>
          </Stack>

          {/* Add a divider between items for visual separation */}
          {index < numberOfSkeletons - 1 && (
            <Divider sx={{ borderBottomWidth: 2, borderColor: "#f0f0f0" }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
