import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi, classApi } from '../../api/client';
import { Student } from '../../types/api';

interface ClassStudentsManagerProps {
  classId: string;
  className: string;
}

export const ClassStudentsManager: React.FC<ClassStudentsManagerProps> = ({
  classId,
  className,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const queryClient = useQueryClient();

  // Fetch enrolled students and all available students
  const { data: enrolledStudents = [] } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => classApi.getStudents(classId),
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentApi.getAll,
  });

  // Get available students (not enrolled in this class)
  const availableStudents = allStudents.filter(
    student => !enrolledStudents.find(enrolled => enrolled.id === student.id)
  );

  // Mutations for managing student enrollment
  const addStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const currentClass = await classApi.getById(classId);
      const updatedStudents = [...(currentClass.students || []), studentId];
      return classApi.update(classId, { ...currentClass, students: updatedStudents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['class-students', classId]});
      setIsAddDialogOpen(false);
      setSelectedStudent(null);
    },
  });

  const removeStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const currentClass = await classApi.getById(classId);
      const updatedStudents = (currentClass.students || []).filter(id => id !== studentId);
      return classApi.update(classId, { ...currentClass, students: updatedStudents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['class-students', classId]});
    },
  });

  const handleAddStudent = () => {
    if (selectedStudent?.id) {
      addStudentMutation.mutate(selectedStudent.id);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    removeStudentMutation.mutate(studentId);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Students in {className}</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Student
        </Button>
      </Box>

      <List>
        {enrolledStudents.map((student) => (
          <ListItem key={student.id}>
            <ListItemText
              primary={student.name}
              secondary={`ID: ${student.id}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => student.id && handleRemoveStudent(student.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add Student to Class</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableStudents}
            getOptionLabel={(student) => student.name}
            value={selectedStudent}
            onChange={(_, newValue) => setSelectedStudent(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Student"
                fullWidth
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddStudent}
            variant="contained"
            disabled={!selectedStudent}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};