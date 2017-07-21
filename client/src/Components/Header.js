import React,{Component} from 'react'

/*
  This is Header Component being put on top of every page.
  It is also responsive like other components.
  It contains  logo-(QnA) And Buttons-(Read,Answer,Activity,Profile,Logout).
  Logo will not be shown on small devices(mobiles).
*/
class Header extends Component{
  constructor(props) {
    super(props);
    this.handleout = this.handleout.bind(this);
  }

  handleout(event){
    this.props.logout();
  }

  render(){
    return(
    <div>
      <div className="w3-top">
        <div className="w3-row w3-padding w3-white w3-card">
          <div className="w3-col m2 s12 w3-hide-small w3-padding-16">
            <div className="w3-col m2">
            <a className="w3-block w3-text-blue w3-center">QnA</a>
            </div>
          </div>
          <div className="w3-col m2 s6 w3-padding">
            <a href="/" className="w3-button w3-block w3-grayscale w3-blue w3-round-xlarge"><strong>Read</strong> </a>
          </div>
          <div className="w3-col m2 s6 w3-padding">
            <a href="/answer" className="w3-button w3-grayscale w3-blue w3-block w3-round-xlarge"><strong>Answer</strong></a>
          </div>
          <div className="w3-col m2 s4 w3-padding">
            <a href="/activity" className="w3-button w3-grayscale w3-blue w3-block w3-round-xlarge"><strong>Activity</strong></a>
          </div>
          <div className="w3-col m2 s4 w3-padding">
            <a href="/profile" className="w3-button w3-grayscale w3-blue w3-block w3-round-xlarge"><strong>Profile</strong></a>
          </div>
          <div className="w3-col m2 s4 w3-padding">
            <strong><input type="button" className="w3-button w3-grayscale w3-blue w3-block w3-round-xlarge" value="Logout" onClick={this.handleout}/></strong>
          </div>
        </div>
      </div>
      <div className="w3-hide-medium w3-hide-large">
        <br/>
        <br/>
      </div>
    </div>
    );
  }
}

export default Header
