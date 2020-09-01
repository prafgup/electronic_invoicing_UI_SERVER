import React , {useState, useEffect }from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Pages from '@material-ui/icons/Pages';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Select from "@material-ui/core/Select";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem"
import Loader from 'react-loader-spinner'
import { Link as ReactLink } from "react-router-dom";
import {  useHistory } from "react-router-dom";

import FormData from "form-data";
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  paper: {

    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(40),

  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {alignItems: 'center',
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  select : {
    width: '100%'
  },
  spinner:{ position: "relative", left: "40%",top : "1px"},
}));


export default function AllDone() {

  const [selectedFile , setselectedFile] = useState(null)

  const [totalTemplate , settotalTemplate] = useState([])

  const [selectedTemplate , setselectedTemplate] = useState(null)

  const [loading , setLoading] = useState(false)
  const [isdone , setIsDone] = useState(false)

  let history = useHistory();












  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Pages />
        </Avatar>
        <Typography component="h1" variant="h5">
          All Done Invoice Processed
        </Typography>
        
      </div>
     
    </Container>
  );
}