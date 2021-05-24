import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [studentInfo, setStudentInfo] = useState({
    email: '', name: ''
  });

  const [studentList, setStudentList] = useState([]);

  const [error, setError] = useState('');

  useEffect(() => {
    const func = async () => {
      const res = await axios.get('/students');
      //needs to be checked once DB is setup
      setStudentList([...res.data]);
    }

    func()
  }, []);

  const onChange = (e) => setStudentInfo({...studentInfo, [e.target.name]: e.target.value});

  const onSubmit = async () => {

    const info = {...studentInfo};

    if(info.name === '' || info.email === '') {
      setError('Please enter all the fields');
      return;
    }

    const regexLaurier = /^[\w.+\-]+@mylaurier\.ca$/;
    const regexWaterloo = /^[\w.+\-]+@uwaterloo\.ca$/;
    if (!regexLaurier.test(info.email) && !regexWaterloo.test(info.email)) {
      setError('Please enter your valid university email');
      return;
    }

    try {
      const res = await axios.post('/students', info);
    } catch(err) {
      console.log(err.response.data);
    }
    
    setStudentList([...studentList, info]);
  };

  return (
    <div className="App">

      <input 
        className='input'
        type='text'
        name='email'
        placeholder='Student Email'
        value={studentInfo.email}
        onChange={e => onChange(e)}/>
      <input 
        className='input'
        type='text'
        name='name'
        placeholder='Full Name'
        value={studentInfo.name}
        onChange={e => onChange(e)}/>
      <button className="btn" onClick={onSubmit} >Submit</button>
      <br/>
      {(error!=='') && <span>{error}</span>}
      <br/>
      <br/>
      <ul>
      {
        studentList.map(student => <li>{student.name}</li>)
      }
      </ul>
    </div>
  );
}

export default App;
