/* importing everything needed */
import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'

/* This is Question component.
  It will be displayed in a card containing questions asked by resistered user himself
*/
class Question extends Component{
  constructor(props) {
    super(props);
    this.state = {
      id:this.props.id,
      link:"/question/"+this.props.id
    };
  }

  render(){
    return(
      <div className="w3-round-large w3-white w3-container w3-padding-large w3-card-2 w3-col l5 s11 w3-margin">
        <h5><strong>{this.props.question}</strong></h5>
        <hr/>
        <h7 className="w3-text-grey">Total Answers: {this.props.answers}</h7>
        <p>
          <a href={this.state.link} className="w3-col l4 m3 s4 w3-button w3-block w3-grayscale w3-blue w3-round-xlarge"><strong>Details</strong> </a>
        </p>
      </div>
    );
  }
}

/*  This is Activity component displays all the Question components.
    Basically it contains all the questions of asked by user at some time
*/
class Activity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      tot:0,
      ques:[]
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
      fetch('/api/quesactivity',{
        method:"POST",
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(ress =>
          this.setState({tot:(ress.result)?(ress.result.length):(0),ques:ress.result})
        );
    }
  }


  logout(){
    localStorage.removeItem('token')
    this.setState({login:false})
  }

  render(){
    if(this.state.tot>0){
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
            <div className="w3-row">
              <p><a href="/activityans" className="w3-button w3-block w3-grayscale w3-blue w3-round-xlarge w3-col l4 m5 s8 w3-margin"><strong>See all the Answers by you</strong> </a></p>
            </div>
            <h4 className="w3-margin-left">All the questions asked by you:</h4>
            {this.state.ques.map(user =>
              <Question key={user.id} id={user.id} question={user.question} answers={user.answers}/>
            )}
          </div>
        )
        :(
          <Redirect to="/auth"/>
        )
      );
    }
    else {
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
            <div className="w3-row">
              <p><a href="/activityans" className="w3-button w3-block w3-grayscale w3-blue w3-round-xlarge w3-col l4 m5 s8 w3-margin"><strong>See all the Answers by you</strong> </a></p>
            </div>
            <h4 className="w3-margin">No questions asked yet.</h4>
          </div>
        )
        :(
          <Redirect to="/auth"/>
        )
      );
    }
  }
}

export default Activity
