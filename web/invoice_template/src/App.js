

import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignInSide from "./LoginPage/loginpage"
import TemplateCreater from "./TemplateCreater/templateCreater"
import TemplateUploader from "./template_upload/template_uploader"
import TemplateNew from "./TemplateCreater/templatenew";
 const App = () => {

  return (
  <Router >

    <Route exact path="/" component={SignInSide} /> 
    <Route exact path="/newtemplate" component={TemplateCreater} />
    <Route exact path="/templateuploader" component={TemplateUploader} />
    <Route exact path="/templatenew" component={TemplateNew} />

  </Router>
)

 }

export default App