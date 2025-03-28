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
import { departmentApi, classApi } from '../../api/client';
import { Class } from '../../types/api';

interface DepartmentClassesManagerProps {
  departmentId: string;
  departmentName: string;
}

export const DepartmentClassesManager: React.FC<DepartmentClassesManagerProps> = ({
  departmentId,
  departmentName,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const queryClient = useQueryClient();

  const { data: departmentClasses = [] } = useQuery({
    queryKey: ['department-classes', departmentId],
    queryFn: () => departmentApi.getClasses(departmentId),
  });

  const { data: allClasses = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classApi.getAll,
  });

  const availableClasses = allClasses.filter(
    cls => !departmentClasses.find(deptClass => deptClass.id === cls.id)
  );

  const addClassMutation = useMutation({
    mutationFn: async (classData: Class) => {
      return classApi.update(classData.id!, { ...classData, department: departmentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['department-classes', departmentId]});
      setIsAddDialogOpen(false);
      setSelectedClass(null);
    },
  });

  const removeClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      const classData = await classApi.getById(classId);
      return classApi.update(classId, { ...classData, department: '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['department-classes', departmentId]});
    },
  });

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Classes in {departmentName}</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Class
        </Button>
      </Box>

      <List>
        {departmentClasses.map((cls) => (
          <ListItem key={cls.id}>
            <ListItemText
              primary={cls.name}
              secondary={`Term: ${cls.term}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => cls.id && removeClassMutation.mutate(cls.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add Class to Department</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableClasses}
            getOptionLabel={(cls) => `${cls.name} (${cls.term})`}
            value={selectedClass}
            onChange={(_, newValue) => setSelectedClass(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Class"
                fullWidth
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedClass && addClassMutation.mutate(selectedClass)}
            variant="contained"
            disabled={!selectedClass}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};