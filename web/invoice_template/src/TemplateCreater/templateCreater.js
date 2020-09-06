
import React ,{useState, useEffect , Spinner}from "react"
import ReactImageAnnotate from "react-image-annotate"
import { makeStyles } from '@material-ui/core/styles';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import { useLocation } from "react-router-dom";

import FormData from "form-data";
import axios from "axios"
import {  useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  spinner:{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
}));


const TemplateCreater = () => {
  const classes = useStyles();

  const location = useLocation();

    useEffect(() => {
       console.log(location.state.detail);
    }, [location]);

  const [annotator , setAnon] = useState( 
  
        <div className={classes.spinner} > 
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
        </div>
 
 )

 let history = useHistory();
 const uploadHandler = (regions_select)=> {

  axios.post("http://localhost:4000/newtemplate", {
    
    fname : location.state.name,
    regions : regions_select
  })
    .then((response) => {

      console.log(response)
      history.push({
          pathname: '/templateuploader',
      });


    }).catch((error) => {
      //handle error
    });
  
}



  useEffect(()=>{
    setTimeout(()=>{

      console.log("setting fg2")

      setAnon(
      
      <ReactImageAnnotate
        //selectedImage="https://example.com/image1.png"
        taskDescription="# Draw region around each face\n\nInclude chin and hair."
        images={[{ src: require("./../preprocessed/sample_0.png"), name: "Create New Template : " + location.state.name}]}
        regionClsList={[...Array(50).keys()]}
        onExit = { async ({images})=>{
    
          console.log(JSON.stringify(images[0].regions))
    
          uploadHandler(images[0].regions);
    
        }}
        />
        
        )


    },2000)
  },[])


    return annotator

  
}

const handleSaveToPC = jsonData => {
  const fileData = JSON.stringify(jsonData);
  const blob = new Blob([fileData], {type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'filename.json';
  link.href = url;
  link.click();
}


export default TemplateCreater