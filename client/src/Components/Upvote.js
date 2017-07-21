import React,{Component} from 'react'

/*
  Upvote Component is a button Component which is being used with each answer to upvote(like) it.
  It also shows the no of total times the particular answer is upvoted.
  This Blue in colour initially and becomes green if some upvotes that answer.
*/
class Upvote extends Component{
  constructor(props) {
    super(props);
    this.state = {
      upstat:false,
      quan:this.props.quan
    };
    this.upvote = this.upvote.bind(this);
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    var data={
      token: token,
      ansid:this.props.ansid
    };
    fetch('../api/upstat',{
      method:"POST",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp =>
        this.setState({upstat:resp.upcon})
    );
  }

  upvote(prevState){
    const token = localStorage.getItem('token');
    var data={
      token: token,
      ansid:this.props.ansid
    };
    fetch('../api/upvote',{
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
          this.setState({upstat:resp.upvoted,quan:resp.quan})
        )
        :(
          console.log('upvote failed')
        )
      )
  }

  render(){
    if(this.state.upstat){
      return(
        /* if already upvoted */
        <strong><button onClick={this.upvote} className="w3-col l2 m3 s6 w3-green w3-button  w3-round-large w3-margin-right">Upvoted | {this.state.quan}</button></strong>
      );
    }
    else{
      return(
        /* if still not upvoted */
        <strong><button onClick={this.upvote} className="w3-col l2 m3 s6 w3-grayscale w3-button w3-blue w3-round-large w3-margin-right">Upvote | {this.state.quan}</button></strong>
      );
    }
  }
}

export default Upvote
