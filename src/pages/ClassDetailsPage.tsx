import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Skeleton,
} from '@mui/material';
import { classApi, professorApi, departmentApi } from '../api/client';
import { ClassStudentsManager } from '../components/relationships/ClassStudentsManager';

export const ClassDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: classData, isLoading: isLoadingClass } = useQuery({
    queryKey: ['class', id],
    queryFn: () => id ? classApi.getById(id) : null,
  });

  const { data: professor } = useQuery({
    queryKey: ['professor', classData?.professor],
    queryFn: () => classData?.professor ? professorApi.getById(classData.professor) : null,
    enabled: !!classData?.professor,
  });

  const { data: department } = useQuery({
    queryKey: ['department', classData?.department],
    queryFn: () => classData?.department ? departmentApi.getById(classData.department) : null,
    enabled: !!classData?.department,
  });

  if (isLoadingClass) {
    return <Skeleton height={400} />;
  }

  if (!classData || !id) {
    return <Typography>Class not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {classData.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Class Details
            </Typography>
            <Box>
              <Typography><strong>Term:</strong> {classData.term}</Typography>
              <Typography><strong>Description:</strong> {classData.description}</Typography>
              <Typography>
                <strong>Professor:</strong> {professor?.name || 'Not assigned'}
              </Typography>
              <Typography>
                <strong>Department:</strong> {department?.name || 'Not assigned'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={12}>
          <ClassStudentsManager
            classId={id}
            className={classData.name}
          />
        </Grid>
      </Grid>
    </Container>
  );
};