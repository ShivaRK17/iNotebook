import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [cred, setcred] = useState({email:"",password:""})
    let navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login',{
            method:"POST",
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
            body:JSON.stringify({email:cred.email,password:cred.password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success===true){
            //Redirect to home  
            localStorage.setItem('token',json.authToken)
            props.showAlert("Login Successful","success")
            navigate("/")
        }
        else{
            // alert("Invalid Creds")
            props.showAlert("Invalid Credentials","danger")
        }
    }

    const onChange = (e)=>{
        setcred({...cred,[e.target.name]:e.target.value})
    }

    return (
        <div>
            <h2 className='my-4'>Login to Continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" onChange={onChange} className="form-control" id="email" value={cred.email} name='email' aria-describedby="emailHelp"/>
                        <div id="emailHelp" style={{color:"#222222"}} className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={onChange} className="form-control" value={cred.password} name='password' id="password"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login