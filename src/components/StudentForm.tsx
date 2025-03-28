import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid
} from '@mui/material';
import { Student } from '../types/api';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Student>({
    defaultValues: student || {
      name: '',
      birthDate: '',
      address: '',
      phone: '',
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {student ? 'Edit Student' : 'Add New Student'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('birthDate')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Address"
              {...register('address')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Phone"
              {...register('phone')}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {student ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
