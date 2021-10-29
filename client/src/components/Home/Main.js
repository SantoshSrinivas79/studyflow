import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function Main() {
    const { currentUser, userDB, surveyResponse } = useAuth()
    const search = useLocation().search
    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`

    const checkTodoist = async () => {
        if (!userDB.todoistCode){
            const code = new URLSearchParams(search).get('code');
            const state = new URLSearchParams(search).get('state');
            if (code && state === todoistSecret){
                console.log('adding todoistcode to user')
                await fetch(`/api/users/todoistcode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })
            }
        }
    }

    useEffect(() => {
        checkTodoist()
        console.log(userDB.todoistcode)
    })

    return (
        <div>
            <h4 style={{margin: '20px'}}>{currentUser.displayName} | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                <Card style={{ width: '300px', margin: '15px' }}>
                    <Card.Header as="h5">Next Steps</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {userDB.todoistcode ?
                                <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through'}}>1. Connect Todoist Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>1. Connect Todoist Account</span><a href={todoistURL}><Button variant="danger">go</Button></a></div>
                            }       
                        </Card.Text>    
                        <Card.Text>
                            {userDB.onedrivecode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>2. Connect OneDrive Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>2. Connect OneDrive Account</span><a href={todoistURL}><Button variant="info">go</Button></a></div>
                            }       
                        </Card.Text>    
                        <Card.Text>
                            {userDB.notioncode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>3. Connect Notion Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>3. Connect Notion Account</span><a href={todoistURL}><Button variant="dark">go</Button></a></div>
                            }       
                        </Card.Text>    
                    </Card.Body>
                </Card>
            </div>
            <Card style={{ width: '300px' }}>
                <Card.Header as="h5">Your Classes</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {surveyResponse.classesarray.map((c, i) => {
                            return <p>{c}</p>
                        })}
                    </Card.Text>    
                </Card.Body>
            </Card>
        </div>
    )
}