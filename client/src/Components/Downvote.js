import React,{Component} from 'react'

/*
  Downvote Component is a button Component which is being used with each answer to downvote(dislike) it.
  It also shows the no of total times the particular answer is downvoted.
  This White in colour initially and becomes green if some downvotes that answer.
*/
class Downvote extends Component{
  constructor(props) {
    super(props);
    this.state = {
      downstat:false,
      quan:this.props.quan
    };
    this.downvote = this.downvote.bind(this);
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      ansid:this.props.ansid
    };
    fetch('../api/downstat',{
      method:"POST",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp =>
        this.setState({downstat:resp.downcon})
    );
  }

  downvote(){
    const token = localStorage.getItem('token');
    var data={
      token: token,
      ansid:this.props.ansid
    };
    fetch('../api/downvote',{
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
          this.setState({downstat:resp.downvoted,quan:resp.quan})
        )
        :(
          console.log('downvote failed')
        )
      )
  }

  render(){
    if(this.state.downstat){
      return(
        /* if already downvoted */
        <strong><button onClick={this.downvote} className="w3-col l2 m3 s6 w3-green w3-button w3-round-large w3-margin-right">Downvoted | {this.state.quan}</button></strong>
      );
    }
    else{
      return(
        /* if still not downvoted */
        <strong><button onClick={this.downvote} className="w3-col l2 m3 s6 w3-grayscale w3-button w3-sand w3-border w3-round-large w3-margin-right">Downvote | {this.state.quan}</button></strong>
      );
    }
  }
}

export default Downvote
