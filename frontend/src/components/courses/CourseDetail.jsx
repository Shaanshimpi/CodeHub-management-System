import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Chip, Divider, List, ListItem, ListItemText } from '@mui/material'
import { useGetCourseQuery } from '../../store/slices/apiSlice'

const CourseDetail = () => {
  const { id } = useParams()
  const { data: course, isLoading, error } = useGetCourseQuery(id)

  if (isLoading) return <Typography>Loading...</Typography>
  if (error) return <Typography>Error loading course</Typography>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{course.name}</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Course Details</Typography>
        <Typography paragraph>{course.description}</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip label={`Duration: ${course.duration} weeks`} />
          <Chip label={`Total Fees: ₹${course.totalFees.toLocaleString()}`} />
          <Chip 
            label={course.isActive ? 'Active' : 'Inactive'} 
            color={course.isActive ? 'success' : 'error'} 
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>Installment Plan</Typography>
        <List>
          {course.installments.map((installment, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`₹${installment.amount.toLocaleString()} due at week ${installment.dueWeek}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default CourseDetail