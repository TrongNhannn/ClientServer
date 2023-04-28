import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';


import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "../css/index.scss";
import Alert from './alert';
import Confirm from './confirm';
import { Login, SignUp, SignOut } from './auth';
import { Home, Projects, SuProjects, SuProject, SuUsers, SuUser, EditUser, Version, TableInput, APIPostInput, APIPutInput } from './client';
import DataClient from './client/version/data-client';
import APIFetching from './client/version/api-fetching';

function App() {
    const dispatch = useDispatch()
    const { proxy, unique_string } = useSelector( state => state );
    const { _token, credential_string } = useSelector( state => state.auth );

    useEffect(() => {
        const specialURLs = [ "/login", "/signup", "/signout" ]
        const url = window.location.pathname;

        if( specialURLs.indexOf(url) === -1 ){
            if( !_token ){
                window.location = '/login'
            }
        }

        fetch(`${ proxy() }/api/${ unique_string }/user/getall/${ credential_string }`).then( res => res.json() )
        .then( (data) => {
            const info = data.data[0];

            dispatch({
                type: "initializedUserInfo",
                payload: {
                    info
                }
            })
        })

        const fetchData = async () => {
            try {
              const response = await axios.get('/dipe-configs/ui.json');
              dispatch({
                  type: "setUIPages",
                  payload: { pages: response.data.pages }
              })     
              
            } catch (error) {
              console.error('Error fetching data:', error);
            }    
              
          };
      
          fetchData();

    }, [])


  return (
      <React.StrictMode>
        <Router>
            <Routes>
                <Route exac path="/login" element={ <Login /> } />
                <Route exac path="/signup" element={ <SignUp /> } />
                <Route exac path="/signout" element={ <SignOut /> } />
                <Route exac path="/" element = { <Home /> } />
                <Route exac path="/projects" element = { <Projects /> } />
                <Route exac path="/su/projects" element = { <SuProjects /> } />
                <Route exac path="/su/project/:project_id" element = { <SuProject /> } />
                <Route exac path="/su/users" element = { <SuUsers /> } />
                <Route exac path="/su/user/edit/:credential_string" element = { <EditUser /> } />
                <Route exac path="/su/user/:credential_string" element = { <SuUser /> } />
                <Route exac path="/su/project/:project_id/version/:version_id" element = { <Version /> } />
                <Route exac path="/su/project/:project_id/version/:version_id/table/:table_id/input" element = { <TableInput /> } />
                <Route exac path="/su/api/post/input/:id_str" element={ <APIPostInput /> } />
                <Route exac path="/fetch/:page_param" element={ <APIFetching /> } />
                <Route exac path="/data" element={ <DataClient /> } />
                <Route path="/su/api/put/input/:id_str/*" element={ <APIPutInput /> } />
            </Routes>
        </Router>
        <Alert/>
        <Confirm/>
    </React.StrictMode>
  );
}

export default App;
