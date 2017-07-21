import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'
import Upvote from './Upvote'
import Downvote from './Downvote'


/*
  EachAns Component shows the answers of a particular question.
  With answers it all show who answered the question and when.
  User can Upvote and Downvote the answers if he wants.
*/
class EachAns extends Component{
  constructor(props) {
    super(props);
    this.state = {
      upstat:false,
      downstat:false,
      u:''
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      uid:this.props.sample.userid
    };
    fetch('../api/udetail',{
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
    return(
      <div>
        <h6><p>Answered By : {this.state.u.firstname} {this.state.u.lastname} ( on {this.props.sample.date.slice(8,10)}/{this.props.sample.date.slice(5,7)}/{this.props.sample.date.slice(0,4)} )</p></h6>
        <h4><p><strong>{this.props.sample.ans}</strong></p></h4>
        <p className="w3-row">
        <Upvote ansid={this.props.sample._id} quan={this.props.sample.up.length}/>
        <Downvote ansid={this.props.sample._id} quan={this.props.sample.down.length}/>
        </p>
        <hr/>
      </div>
    );
  }
}

/*
  Question Component will show the particular question and its answers.
*/
class Question extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      q:'',
      answers:[],
      ansid:[],
      views:[],
      up:5,
      link:'',
      ans:''
    };
    this.logout = this.logout.bind(this);
  }

  /* Check if Token is already set */
  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      id:this.props.match.params.id
    };
    if(token){
      this.setState({login:true,token:token});
      fetch('../api/qdetail',{
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
            this.setState({q:resp.q,ansid:resp.q.ansid}),
            this.state.ansid.map(id =>
              fetch('../api/adetail',{
                method:"POST",
                headers: {
                  'Accept':'application/json',
                  'Content-Type':'application/json'
                },
                body: JSON.stringify( {token: token,aid:id} )
              }).then(res2 => res2.json())
                .then(resp2 =>
                  this.setState({answers:[...this.state.answers,resp2.a]})
                )
            ),
            this.setState({link:"Upvote | "+this.state.up})
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

        <div className="w3-round-large w3-white w3-container w3-content w3-padding-large  w3-col l10 s10 w3-margin">
          <h6>Question asked</h6>
          <h2><strong>{this.state.q.question}</strong></h2>
          <h7 className="w3-text-grey">{this.state.answers.length} Answers</h7>
          <hr/>
            {this.state.answers.map(sample =>
              <EachAns key={sample._id} sample={sample} />
            )}
        </div>
        </div>
      )
      :(
        <Redirect to="/"/>
      )
    );
  }
}

export default Question
