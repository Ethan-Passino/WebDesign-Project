import React from 'react';
import './Login.css';


function Login(){
    return(
        <div className="Login">

            <header className="Login-header" >
                <pre className="Login-head-text">
                    Login placeholder page <br/>
                    This is just a placeholer page <br/>
                </pre>
            </header>

            <div className="login-form">
                <form className="login-form"><label>First name:</label><br/><input type="text"/><br/><label>Last
                    name:</label><br/><input type="text"/><br/><br/><input type="submit" value="Submit"/></form>

            </div>
        </div>
    )
}

export default Login;