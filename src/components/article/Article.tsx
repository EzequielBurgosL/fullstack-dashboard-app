import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const Value = styled(Typography)`
  align-self: center;
  margin-left: auto;
  padding: 0 8px;
`;

export type ArticleProps = {
  author: string;
  url: string;
  image: string;
  traffic: number;
  id: string;
};

export const Article = ({ author, url, image, traffic, id }: ArticleProps) => {
  return (
    <Card key={id} sx={{ display: 'flex', mb: 1, paddingRight: '6px', boxShadow: 'rgb(0 0 0 / 20%) 1px 1px 2px' }} variant='outlined'>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={ image }
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            { url }
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            { author }
          </Typography>
        </CardContent>
      </Box>
      <Value variant="h4">
            { traffic }
      </Value>
    </Card>
  );
}
