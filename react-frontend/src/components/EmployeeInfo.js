import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  Tooltip
} from "@mui/material";
import { styled } from "@mui/system";
import { FaChevronDown, FaChevronUp, FaUserTie, FaUsers, FaEnvelope, FaPhone } from "react-icons/fa";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "16px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10]
  }
}));

const mockData = {
  managers: [
    {
      id: 1,
      name: "John Smith",
      position: "Senior Manager",
      department: "Engineering",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      staff: [
        {
          id: 101,
          name: "Alice Johnson",
          position: "Developer",
          department: "Engineering",
          email: "alice.j@example.com",
          phone: "+1 (555) 234-5678"
        },
        {
          id: 102,
          name: "Bob Wilson",
          position: "Developer",
          department: "Engineering",
          email: "bob.w@example.com",
          phone: "+1 (555) 345-6789"
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Davis",
      position: "Product Manager",
      department: "Product",
      email: "sarah.d@example.com",
      phone: "+1 (555) 456-7890",
      staff: [
        {
          id: 201,
          name: "Mike Brown",
          position: "Product Analyst",
          department: "Product",
          email: "mike.b@example.com",
          phone: "+1 (555) 567-8901"
        }
      ]
    }
  ]
};

const EmployeeInfoCard = ({ employee, isManager = false }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard role="article" aria-label={`Employee card for ${employee.name}`}>
      <CardContent>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} alignItems="center">
          <Box flex={1}>
            <Typography variant="h6" component="h2">{employee.name}</Typography>
            <Typography color="textSecondary" gutterBottom>{employee.position}</Typography>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <FaEnvelope />
              <Typography variant="body2">{employee.email}</Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <FaPhone />
              <Typography variant="body2">{employee.phone}</Typography>
            </Box>
          </Box>
          {isManager && (
            <Tooltip title={expanded ? "Show less" : "Show team members"}>
              <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
      {isManager && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h6" gutterBottom>Team Members</Typography>
            <Grid container spacing={2}>
              {employee.staff.map((staffMember) => (
                <Grid item xs={12} sm={6} key={staffMember.id}>
                  <EmployeeInfoCard employee={staffMember} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      )}
    </StyledCard>
  );
};

const EmployeeInfo = () => {
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }} role="main" aria-label="Employee hierarchy display">
      <Typography variant="h4" component="h1" gutterBottom align="center">Employee Directory</Typography>
      <Grid container spacing={3}>
        {mockData.managers.map((manager) => (
          <Grid item xs={12} key={manager.id}>
            <EmployeeInfoCard employee={manager} isManager={true} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmployeeInfo;