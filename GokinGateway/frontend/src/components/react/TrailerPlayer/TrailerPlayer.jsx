import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const TrailerPlayer = ({ videoUrl }) => {
    const videoId = videoUrl.split('v=')[1];

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <Box display="flex" justifyContent="center" sx={{pb: 4, width:'100%', backgroundColor:"white" }}>
            <Card sx={{ width: 650, boxShadow: 3, pl:1 }}>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        Трейлер фильма
                    </Typography>
                    <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TrailerPlayer;
