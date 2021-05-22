import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [studentInfo, setStudentInfo] = useState({
<<<<<<< HEAD
    email: '', name: ''
=======
    studentEmail: '', studentName: ''
>>>>>>> 8de9310... frontend created
  });

  const [studentList, setStudentList] = useState([]);

<<<<<<< HEAD
  useEffect(() => {
    const func = async () => {
      const res = await axios.get('/students');
      //needs to be checked once DB is setup
      setStudentList([...res.data]);
    }

    func()
  }, []);
=======
  // useEffect(() => {
  //   const func = async () => {
  //     const res = await axios.get('/students');
  //     //needs to be checked once DB is setup
  //     setStudentList([...res.data]);
  //   }

  //   func()
  // }, []);
>>>>>>> 8de9310... frontend created

  const onChange = (e) => setStudentInfo({...studentInfo, [e.target.name]: e.target.value});

  const onSubmit = async () => {

    const info = {...studentInfo};

<<<<<<< HEAD
    try {
      const res = await axios.post('/students', info);
    } catch(err) {
      console.log(err.response.data);
    }
=======
    // try {
    //   const res = await axios.post('/students', info);
    // } catch(err) {
    //   console.log(err.response.data);
    // }
>>>>>>> 8de9310... frontend created
    setStudentList([...studentList, info]);
  };

  return (
    <div className="App">

      <input 
        className='input'
        type='text'
<<<<<<< HEAD
        name='email'
        placeholder='Student Email'
        value={studentInfo.email}
=======
        name='studentEmail'
        placeholder='Student Email'
        value={studentInfo.studentEmail}
>>>>>>> 8de9310... frontend created
        onChange={e => onChange(e)}/>
      <input 
        className='input'
        type='text'
<<<<<<< HEAD
        name='name'
        placeholder='Full Name'
        value={studentInfo.name}
=======
        name='studentName'
        placeholder='Full Name'
        value={studentInfo.studentName}
>>>>>>> 8de9310... frontend created
        onChange={e => onChange(e)}/>
      <button className="btn" onClick={onSubmit} >Submit</button>
      <br/>
      <br/>
      <ul>
      {
<<<<<<< HEAD
        studentList.map(student => <li>{student.name}</li>)
=======
        studentList.map(student => <li>{student.studentName}</li>)
>>>>>>> 8de9310... frontend created
      }
      </ul>
    </div>
  );
}

export default App;
