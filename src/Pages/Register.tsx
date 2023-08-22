import React, { useState } from 'react'
import { inputHelper } from '../Helper';
import { SD_Roles } from '../Utility/SD';
import { MainLoader } from '../Components/Page/Common';
import { useRegisterUserMutation } from '../Apis/authApi';
import { apiResponse } from '../Interfaces';
import toastNotify from '../Helper/toastNotify';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    name: "",
    lastName: ""
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      name: userInput.name,
      lastName: userInput.lastName,
      password: userInput.password,
    });
    if (response.data) {
      console.log(response.data);
      toastNotify("Registeration successful! Please login to continue.");
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error.data.message, "error");
    }
    
    setLoading(false);
  };

  return (
    <div className="container text-center">
    {loading && <MainLoader />}
    <form method="post" onSubmit={handleSubmit}>
      <h1 className="mt-5">Register</h1>
      <div className="mt-5">
        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            required
            name="userName"
            value={userInput.userName}
            onChange={handleUserInput}
          />
        </div>
        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            required
            name="name"
            value={userInput.name}
            onChange={handleUserInput}
          />
        </div>
        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="LastName"
            required
            name="lastName"
            value={userInput.lastName}
            onChange={handleUserInput}
          />
        </div>
        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            required
            name="password"
            value={userInput.password}
            onChange={handleUserInput}
          />
        </div>
      </div>
      <div className="mt-5">
        <button type="submit" className="btn btn-success" disabled={loading}>
          Register
        </button>
      </div>
    </form>
  </div>
  )
}

export default Register