import React, { useState } from "react";
import '../userCss/loginPage.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate(); // useNavigate 초기화
  const [position,setPosition] = useState();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 이메일과 비밀번호를 서버로 보내는 요청
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      // 서버에서 응답을 받으면 원하는 동작을 수행할 수 있습니다.
      console.log("로그인 성공:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token); // 토큰 발행
        console.log("Saved token:", localStorage.getItem("token")); // 확인용

        // 예를 들어, 회원 가입이 성공했을 때 MyPage로 이동할 수 있습니다
        const position = response.data.positionId;
        setPosition(position); // 예시로 상태에 저장하는 방법
        
        if(position === 1){
          navigate('../master');
        }
        if(position === 2){
          console.log('매니저입니다.');
        }
        if(position === 3){
          navigate('../profile');
        }
        
        

      } else {
        throw new Error("토큰이 없습니다.");
      }
    } catch (error) {
      // 오류 처리
      console.error("error:", error);
    }
  };

  return (
    <form className="loginBox" 
    onSubmit={handleSubmit}>
      <input
      className="inputStyle"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email"
      />
      <input
      className="inputStyle"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="password"
      />
      <button className="buttonStyle" 
      type="submit">로그인</button>
    </form>
  );
};

export default Login;
