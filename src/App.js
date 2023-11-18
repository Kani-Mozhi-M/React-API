
import './App.css';
import {useEffect,useState} from 'react';
import { EditableText ,Button , InputGroup,Toaster} from '@blueprintjs/core'

const AppToaster=Toaster.create({
  position: "top"
})

function App() {
 const [users, setUsers] = useState([])
 const [newName, setNewName] = useState("")
 const [newEmail, setNewEmail] = useState("")
 const [newWebsite, setNewWebsite] = useState("")

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=>response.json())
    .then((json)=>setUsers(json))
  }, [])
  
  function addUser() {
    const name=newName.trim();
    const email=newEmail.trim();
    const website=newWebsite.trim();

    if(name && email && website){
      fetch('https://jsonplaceholder.typicode.com/users',
      {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            website
        }),
        headers: {
          "content-type" :"application/json; charset=UTF-8"
        }
        
      }).then((response)=>response.json())
      .then(jsondata=>{
        setUsers([...users,jsondata])
        AppToaster.show({
           message: "user added successfully",
           intent: 'success',
           timeout: 3000
        })
      })

      setNewName('')
      setNewEmail('')
      setNewWebsite('')

    }
  }

  function handleEdit(id,key,value) {
    
    setUsers((prevUsers)=>{
      return prevUsers.map(user=>{
        return user.id === id ? {...user,[key]:value} : user;
      })
    })
  }

  function editUser(id){
    const user =users.find((user)=> user.id === id );
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
    {
      method: "PUT" ,
      body: JSON.stringify(user),
      headers: {
        "content-type" :"application/json; charset=UTF-8"
      }
    }).then((res)=>res.json)
    .then(jsondata=>{
      AppToaster.show({
        message:"user updated" ,
        intent:'success',
        timeout:3000
      })
    })
  }

  function deleteUser(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,{
       method:"DELETE",
    }).then((response)=>response.json)
    .then(jsondata=>{
      setUsers((users)=>{
        return users.filter((user)=>user.id !== id)
      })
      AppToaster.show({
        message:'user deleted',
        intent: "success",
        timeout: 1000
      })
    })
  }

  return (
    <div className="App">
      <table>
         <thead>
             <th>id</th>
             <th>name</th>
             <th>email</th>
             <th>website</th>
             <th>action</th>

         </thead>
         <tbody>
          {users.map(user=>
              <tr key={user.id} >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td><EditableText  onChange={getValue=>handleEdit(user.id, 'email' ,getValue)} value={user.email}></EditableText></td>
                <td><EditableText onChange={getValue=>handleEdit(user.id , 'website' ,getValue)} value={user.website} ></EditableText></td>
                <td>
                  <Button intent='primary' onClick={()=>editUser(user.id)}>edit</Button>
                  &nbsp;
                  <Button intent='danger' onClick={()=>deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>
          )}
         </tbody>
         <tfoot>
           <tr>
             <td></td>
             <td>
               <InputGroup
                value={newName}
                onChange={(e)=>setNewName(e.target.value)}
                placeholder='enter name......'/>
             </td>
             <td>
                <InputGroup
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value) }
                    placeholder='Enter Email...'
                />
            </td>
            <td>
                <InputGroup
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value) }
                    placeholder='Enter Website...'
                />
            </td>
            <td>
              <Button intent='primary' onClick={addUser}>Add user</Button>
            </td>
           </tr>
         </tfoot>
      </table>
    </div>
  );
}

export default App;
