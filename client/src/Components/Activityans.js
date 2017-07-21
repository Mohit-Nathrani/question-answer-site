import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'

/* This is Answer component.
  It will be displayed in a card containing answers asked by resistered user himself.
*/
class Answers extends Component{
  constructor(props) {
    super(props);
    this.state = {
      id:this.props.sample.id,
      link:"/question/"+this.props.sample.quesid,
      q:'',
      eachanswer:0
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      id:this.props.sample.quesid
    };
    fetch('/api/qdetail',{
      method:"POST",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(ress =>
        this.setState({q:ress.q,eachanswer:ress.q.ansid.length})
      );
  }
  render(){
    return(
      <div className="w3-round-large w3-white w3-container w3-padding-large w3-card-2 w3-col l5 s11 w3-margin">
        <h4><strong>{this.state.q.question}</strong></h4>
        <h7 className="w3-text-grey">Total Answers: {this.state.eachanswer}</h7><hr/>
        <div className="w3-text-grey">
        Your Answer:
        <h5><p>{this.props.sample.answer}</p></h5>
        </div>
        <p>
          <a href={this.state.link} className="w3-col l5 m4 s6 w3-button w3-block w3-grayscale w3-blue w3-round-xlarge"><strong>See All the answers</strong> </a>
        </p>
      </div>
    );
  }
}

/*
    This is Activityans component displays all the Answer components.
    Basically it contains all the answers answered by user at some time.
    This is similar to Activity Component.
    But shows Answer instead of Question.
*/
class Activityans extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      tot:0,
      ans:[]
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
      fetch('/api/ansactivity',{
        method:"POST",
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
          .then(ress =>
          this.setState({tot:ress.result.length,ans:ress.result})
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
              <p><a href="/activity" className="w3-button w3-block w3-grayscale w3-blue w3-round-xlarge w3-col l4 m5 s8 w3-margin"><strong>See all the Questions by you</strong> </a></p>
            </div>
            <h4 className="w3-margin-left">All the answers submitted by you:</h4>
            {this.state.ans.map(sample =>
              <Answers key={sample.id} sample={sample}/>
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
              <p><a href="/activity" className="w3-button w3-block w3-grayscale w3-blue w3-round-xlarge w3-col l4 m5 s8 w3-margin"><strong>See all the Questions by you</strong> </a></p>
            </div>
            <h4 className="w3-margin">No Answer given yet.</h4>
          </div>
        )
        :(
          <Redirect to="/auth"/>
        )
      );
    }
  }
}

export default Activityans
