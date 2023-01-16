import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const [cred, setcred] = useState({name:"",email:"",password:"",cpassword:""})
    let navigate = useNavigate()

    const {name,email,password,cpassword} = cred
    const handleSubmit = async (e)=>{
        if(password!==cpassword){
            props.showAlert("Passwords dont match","danger")
            return;
        }
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/createUser',{
            method:"POST",
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
            body:JSON.stringify({name,email,password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //Redirect to home  
            localStorage.setItem('token',json.authToken)
            navigate("/")
            props.showAlert("Created New Account Successfully","success")  
        }
        else{
            // alert("Invalid Creds")
            props.showAlert("Invalid Details","danger")  
        }
    }

    const onchange = (e)=>{
        setcred({...cred,[e.target.name]:e.target.value})
    }
    return (
        <div>
            <div className="container m-3">

            <h2>Create an Account to Continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="name" className="form-control" name='name' id="name" onChange={onchange} aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' id="email" onChange={onchange} aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onchange} name='password' id="password"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onchange} name='cpassword' id="cpassword"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            </div>
        </div>
    )
}

export default Signup