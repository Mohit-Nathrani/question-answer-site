import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'
import Upvote from './Upvote'
import Downvote from './Downvote'

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
  Feed Component shows the best answer selected by Base Component as feed.
  On each Feed any user can click on question to see it in detail with all it answers.
*/
class Feed extends Component{
  constructor(props) {
    super(props);
    this.state = {
      q:'',
      u:'',
      panel:false,
      answer:'',
      success:false,
      err:false,
      link:"/question/"+this.props.feed.quesid
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
     id:this.state.q._id,
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


  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      id:this.props.feed.quesid,
      uid:this.props.feed.userid
    };
    fetch('api/qdetail',{
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
          this.setState({q:resp.q})
        )
        :(
          console.log('wrong id provided..')
        )
      );
      fetch('api/udetail',{
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
            this.setState({u:resp.u})
          )
          :(
            console.log('wrong id provided..')
          )
        );
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
              <Upvote ansid={this.props.feed._id} quan={this.props.feed.up.length}/>
              <Downvote ansid={this.props.feed._id} quan={this.props.feed.down.length}/>
              <strong><button onClick={this.answer} className="w3-col l3 m4 s6 w3-grayscale w3-button w3-blue w3-round-large w3-margin-right">Answer this question</button></strong>
              </p> ;
    }

    return(
      <div>
        <div className="w3-round-large w3-white w3-container w3-content w3-padding w3-card-2">
          Question
          <h3><strong><a href={this.state.link} className="w3-hover-text-blue">{this.state.q.question}</a></strong></h3><hr/>
          <h6 className="w3-text-grey">Answered by: {this.state.u.firstname} {this.state.u.lastname} ( on {this.props.feed.date.slice(8,10)}/{this.props.feed.date.slice(5,7)}/{this.props.feed.date.slice(0,4)} )</h6>
          <h5><p>
             {this.props.feed.ans}
          </p><hr/></h5>
          {panel}
        </div>
        <br/>
      </div>
    );
  }
}

/*
  Base Component is the main Component.
  This is where users see all feeds (new answers which are being upvoted the most).
  It render top 15 feeds for users
*/
class Base extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      feeds:[]
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
      fetch('./api/feeds',{
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
            this.setState({feeds:resp.feeds})
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
          <BrowserRouter>
            <Header logout={this.logout}/>
          </BrowserRouter>

          <div className="">
            <div className="w3-light-grey">
              <br/>
              <br/>
              <br/>
              <br/>
              <div className="w3-row w3-padding">
                <div className="w3-col l2 w3-hide-small w3-hide-medium w3-container">
                  <div className="w3-card-2 w3-padding w3-white w3-round-large">
                    <h3><strong>Question Anything..</strong></h3>
                  </div>
                </div>
                <div className="w3-col l10 s12">
                  <div className="w3-round-large w3-white w3-container w3-content w3-padding-large w3-card-2">
                    <h5><a href="/ask" className="w3-button w3-grayscale w3-blue w3-round-large"><strong>What is your question?</strong> </a></h5>
                  </div>
                  <br/>

                  {this.state.feeds.map(feed =>
                    <Feed key={feed._id} feed={feed}/>
                  )}
                  <br/>
                  <br/>
                  <br/>
                </div>
              </div>
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
export default Base
