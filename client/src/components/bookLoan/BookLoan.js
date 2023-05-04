import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import {useSelector} from 'react-redux';

import Students from "../pages/adminPages/Students";
import Books from "../pages/adminPages/Books";
import Overdue from "../pages/adminPages/Overdue";

import Current from "../pages/studentPages/Current";
import StudentOverdue from "../pages/studentPages/StudentOverdue";
import History from "../pages/studentPages/History";

import "../../styles/books.styles.css";
import "../../styles/common.styles.css";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`
    };
  }

const BookLoan = () => {
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState('')
  const { user } = useSelector((state) => state.auth);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // if(user && user.data.role_id === 1  && newValue === 0) {
    //   setTitle("Students with loan")
    // } else if(user && user.data.role_id === 1  && newValue === 1) {
    //   setTitle("Books on loan")
    // } else if(user && user.data.role_id === 1  && newValue === 2) {
    //   setTitle("Overdue loans")
    // } else if(user && user.data.role_id === 2  && newValue === 0) {
    //   setTitle("Currently borrowed books")
    // } else if(user && user.data.role_id === 2  && newValue === 1) {
    //   setTitle("Overdue borrow")
    // } else if(user && user.data.role_id === 2  && newValue === 2) {
    //   setTitle("Borrow history")
    // } else {
    //   setTitle("Borrow activities")
    // }
  };

  useEffect(() => {
    if(user && user.data.role_id === 1  && value === 0) {
      setTitle("Students with loan")
    } else if(user && user.data.role_id === 1  && value === 1) {
      setTitle("Books on loan")
    } else if(user && user.data.role_id === 1  && value === 2) {
      setTitle("Overdue loans")
    } else if(user && user.data.role_id === 2  && value === 0) {
      setTitle("Currently borrowed books")
    } else if(user && user.data.role_id === 2  && value === 1) {
      setTitle("Overdue borrow")
    } else if(user && user.data.role_id === 2  && value === 2) {
      setTitle("Borrow history")
    } else {
      setTitle("Borrow activities")
    }
  })

  
  return (
  <div>
    <div className="table-title" style={{margin: "30px 0 0 50px"}}>{title}</div>
      {
      user && user.data.role_id === 1 ?
          <Paper elevation={3} className="tabs-paper">
            <div className="tabs-label-container">
            <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Vertical tabs example"
            TabIndicatorProps={{ sx: { background: "#662D91"} }}
            sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Students" {...a11yProps(0)} className="tab-title" />
                <Tab label="Books" {...a11yProps(1)} className="tab-title" />
                <Tab label="Overdue" {...a11yProps(2)} className="tab-title" />
            </Tabs>
        </div>
        <div className="tabs-panel-container">
        <TabPanel value={value} index={0} className="tab-content"><Students /></TabPanel>
        <TabPanel value={value} index={1} className="tab-content"><Books /></TabPanel>
        <TabPanel value={value} index={2} className="tab-content"><Overdue /></TabPanel>
        </div>  
        </Paper> 
        
        :

        <Paper elevation={3} className="tabs-paper">
          <div className="tabs-label-container">
        <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Vertical tabs example"
        TabIndicatorProps={{ sx: { background: "#662D91"} }}
        sx={{ borderRight: 1, borderColor: 'divider' }}
        >
            <Tab label="Current" {...a11yProps(0)} className="tab-title" />
            <Tab label="Overdue" {...a11yProps(1)} className="tab-title" />
            <Tab label="History" {...a11yProps(2)} className="tab-title" />
        </Tabs>
        </div>
        <div className="tabs-panel-container">
        <TabPanel value={value} index={0}><Current /></TabPanel>
        <TabPanel value={value} index={1}><StudentOverdue /></TabPanel>
        <TabPanel value={value} index={2}><History /></TabPanel>
        </div>
    </Paper>
    
    }
     
  </div>
  );
}

export default BookLoan