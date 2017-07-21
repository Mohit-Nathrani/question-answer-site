import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'

function Err(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="w3-text-red">
      <h6>Empty Answer is not allowed to submit</h6>
    </div>
  );
}

/*
 This is component displayed in a card containing unanswered questions which anyone can answer.
*/
class UnAns extends Component{
  constructor(props) {
    super(props);
    this.state = {
      panel:false,
      answer:'',
      success:false,
      err:false
    };
    this.answer = this.answer.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  answer(event){
      event.preventDefault();
      this.setState({panel:true});
  }

  cancel(event){
      event.preventDefault();
      this.setState({panel:false});
  }

  handleChange(event) {
   this.setState({answer: event.target.value});
  }

 handleSubmit(event) {
   const token = localStorage.getItem('token');
   var data={
     token:token,
     id:this.props.sample._id,
     ans:this.state.answer
   };
   fetch('/api/answer',{
     method:"POST",
     headers: {
       'Accept':'application/json',
       'Content-Type':'application/json'
     },
     body: JSON.stringify(data)
   })
   .then(res => res.json())
   .then(result =>
     (result.success)
       ? (
           this.setState({success:true,panel:false}),
           alert("Cool,You Answer is submitted")
        )
       :(
             this.setState({err:true})
        )
      )
    .catch(function(err){
      console.log(err);
   });
  }


  render(){
      let panel = null;
      if (this.state.panel) {
        panel = <div>
                <Err warn={this.state.err}/>
                <h5><textarea value={this.state.answer} onChange={this.handleChange} className="w3-col w3-round-large" rows="10"/></h5>
                <p className="w3-row">
                  <strong><button onClick={this.handleSubmit} className="w3-col l2 m3 s4 w3-grayscale w3-button w3-blue w3-round-large w3-margin">Sumbit</button></strong>
                  <strong><button onClick={this.cancel} className="w3-col l2 m3 s4 w3-grayscale w3-button w3-round-large w3-border w3-margin">Cancel</button></strong>
                </p>
                </div>;
      } else {
        panel = <p className="w3-row">
                <strong><button onClick={this.answer} className="w3-col l2 m3 s4 w3-grayscale w3-button w3-blue w3-round-large w3-margin-right">Answer</button></strong>
                </p> ;
      }

      if(this.state.success){
        return(
          <Redirect to="/answer"/>
        );
      }
      else{
      return(
        <div>
          <div className="w3-round-large w3-white w3-container w3-content w3-padding w3-card-2">
            <h6>Question</h6>
            <h4><strong>{this.props.sample.question}</strong></h4>
            {panel}
          </div>
          <br/>
        </div>
      );
    }
  }
}

/*  This is Answer component displays all the UnAns components.
    Basically it contains all the unanswered questions which anyone can answer.
*/
class Answer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      unanswered:[]
    };
    this.logout = this.logout.bind(this);
  }

  // Check if Token is already set
  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token
    };
    if(token){
      this.setState({login:true,token:token});
      fetch('./api/unanswered',{
        method:"POST",
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(resp =>
          (resp.success)
          ?(
            this.setState({unanswered:resp.unanswered})
          )
          :(
            console.log('wrong id provided..')
          )
        )
    }
  }


  logout(){
    localStorage.removeItem('token')
    this.setState({login:false})
  }

  render(){
    return(
      (this.state.login)
      ?(
        <div>
        <br/>
        <br/>
        <br/>
        <br/>

          <BrowserRouter>
            <Header logout={this.logout}/>
          </BrowserRouter>

          <div className="w3-row w3-padding">
            <div className="w3-col l10 s12">
              <h5><strong>Some of the unanswered questions:</strong></h5>
              {this.state.unanswered.map(sample =>
                <UnAns key={sample._id} sample={sample}/>
              )}

            </div>
          </div>
        </div>
      )
      :(
        <Redirect to="/auth"/>
      )
    );
  }
}

export default Answer
