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

export default function TemplateUploader() {

  const [selectedFile , setselectedFile] = useState(null)

  const [totalTemplate , settotalTemplate] = useState([])

  const [selectedTemplate , setselectedTemplate] = useState(null)

  const [loading , setLoading] = useState(false)
  const [isdone , setIsDone] = useState(false)




  const uploadHandler = ()=> {


    console.log("uploading" , selectedFile);


    if(selectedFile == null || selectedTemplate == null) return;


    setLoading(true);

    let data = new FormData();
    data.append('file', selectedFile, selectedFile.name);

   
    axios.post("http://localhost:4000/upload", data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then((response) => {
        console.log(response)


        axios.post("http://localhost:4000/preprocess", {
      
      fname : response.data[0].filename,
      newtemp : false,
      template : selectedTemplate
    })
      .then((response) => {

        console.log(response)


        setLoading(false)
        setIsDone(true)

      }).catch((error) => {
        //handle error
      });

      }).catch((error) => {
        //handle error
      });
    
  }


  const getTemplate = ()=> {


    let data = new FormData();
    

   
    axios.get("http://localhost:4000/template_count",{
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then((response) => {
        console.log(response.data.templates)
        settotalTemplate((old_temp)=>{
          var curr = [];
          for(let i=0;i<response.data.templates.length;i+=1){
            curr = [...curr, <MenuItem key={i} value={response.data.templates[i].name}>{response.data.templates[i].name}</MenuItem>]
          }
          return curr
        })

      }).catch((error) => {
        //handle error
      });
    
  }


  useEffect(()=>{
    getTemplate()
  },[])




  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Pages />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload Your Invoice
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="ID"
                label="ID"
                name="ID"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              
              >
              Upload File
              <input
                id="inputFile"
                type="file"
                style={{ display: "none" }}
                onChange = {
                  (event)=>
                  {

                    setselectedFile(event.target.files[0])

                   
                  }
                
                }
              />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
            <br/>
            <Link href="#" >
                  {selectedFile == null?"Select A File":selectedFile.name}
            </Link>
              
  
            </Grid>




            <Grid item xs={12}>
            <TextField className={classes.select} id="select" label="Template"  select onClick={(event)=>{
              console.log(event.target.value)
              setselectedTemplate(event.target.value)
              
              }}>
              {
               totalTemplate
              }
            </TextField>
            </Grid>


            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I accept the Terms And Conditions"
              />
            </Grid>
          </Grid>

          {
            loading && <div className={classes.spinner} > 
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                //timeout={3000} //3 secs
            />
        </div>
          }
          {
            !loading && <Button
            //type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={async ()=>{
              uploadHandler();
            
            }}
          >
            Upload and Submit
          </Button>
          }


            
          <Grid container justify="flex-end">
            <Grid item>
            <ReactLink to="/templatenew">
              <Link href="#" variant="body2">
                  Create New Template 
              </Link>
            </ReactLink>
            </Grid>
          </Grid>
        </form>
      </div>
     
    </Container>
  );
}