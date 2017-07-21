import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom';
import Header from './Header'


/*
  This is Profile Component shown inside a card.
  It shows firstname, lastname, and email of the user who is logged-in
*/
class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login:false,
      token: '',
      firstname:'',
      lastname:'',
      email:''
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
      this.setState({login:true,token:token})
      fetch('/api/profile',{
        method:"POST",
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(result =>
          (result.success)
            ? (
                this.setState(
                {
                  firstname:result.firstname,
                  lastname:result.lastname,
                  email:result.email
                })
             )
            :(
                  this.setState({errmsg:result.errmsg})
             )
           )
        .catch(function(err){
          console.log(err);
        });
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

          <div className="w3-margin w3-round-large w3-col w3-padding l8 m9 s11 w3-card-4">
              <h3 className="w3-col s12"><strong>Your Details:</strong></h3>
              <hr/>
              <h4 className="w3-col s12 w3-text-blue"><strong>Firstname : </strong>{this.state.firstname}</h4>
              <h4 className="w3-col s12 w3-text-blue"><strong>Lastname : </strong>{this.state.lastname}</h4>
              <h4 className="w3-col s12 w3-text-blue"><strong>Email : </strong>{this.state.email}</h4>
          </div>
        </div>
      )
      :(
        <Redirect to="/auth"/>
      )
    );
  }
}

export default Profile
