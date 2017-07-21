import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'


/*
  This is a kind of form component where user can ask a question.
*/
class Ask extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      success:false,
      question: '',
      errors:[],
      error:'',
      token:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  // Check if Token is already set
  componentWillMount() {
    const token = localStorage.getItem('token');
    if(token){
      this.setState({login:true,token:token});
    }
  }

  handleSubmit(event) {
   var data={
     question:this.state.question,
     token:this.state.token
   };
   event.preventDefault();
   fetch('/api/asking',{
     method:"POST",
     headers: {
       'Accept':'application/json',
       'Content-Type':'application/json'
     },
     body: JSON.stringify(data)
   })
   .then(res => res.json())
   .then(result =>
     (result.asked)
       ? (
           this.setState({success:true}),
           alert("Cool.Your Question is live now.")
        )
       :(
             this.setState({errors:result.errors,error:result.error})
        )
      )
    .catch(function(err){
      console.log(err);
   });
 }

  handleChange(event) {
    this.setState({question: event.target.value});
  }

  logout(){
    localStorage.removeItem('token')
    this.setState({login:false})
  }

  render(){
    return(
      (this.state.login&&(!(this.state.success)))
      ?(
        <div>
          <BrowserRouter>
            <Header logout={this.logout}/>
          </BrowserRouter>

          <div className="w3-large">
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <div className="w3-row w3-padding">
                <div className="w3-col l12 s12">
                  <form className="w3-round-large w3-white w3-container w3-content w3-padding-large w3-card-2" onSubmit={this.handleSubmit}>
                    <h5><strong>What is your question</strong></h5>
                    <input type="text" className="w3-input" value={this.state.question} onChange={this.handleChange}/>
                    <p className="w3-round-small w3-red ">
                       {this.state.error}
                    </p>
                    <p className="w3-row">
                    <input type="submit" className="w3-col s6 m3 l2 w3-button w3-grayscale w3-blue w3-round-large w3-margin" value="Ask"/>
                    <a href="/" className="w3-col s6 m3 l2 w3-button w3-grayscale w3-blue w3-round-large w3-margin">Cancel</a>
                    </p>
                  </form>
                </div>
              </div>
          </div>
        </div>
      )
      :(
        (this.state.success)
          ?(<Redirect to="/"/>)
          :(<Redirect to="/auth"/>)
      )
    );
  }
}

export default Ask
