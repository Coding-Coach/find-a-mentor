import React from 'react';
import List from '../Me/components/List';
import Card from '../Me/components/Card';
//import ListItem from '../Me/components/ListItem'

import { StoriesContainer } from './StoriesContainer';

export default { title: 'List and List Item' };

// List Component takes value as string or number - see example below
export const ListProfile = () => {
    const items = [
        {
            type: 'email',
            value: 'myemail@codecoache.com',
        },
        {
            type: 'spokenLanguages',
            value: 'EN',
        },
        {
            type: 'country',
            value: 'US',
        },
        {
            type: 'title',
            value: 'Sharing of Knowledge, regular weekly meetings',
        },
        {
            type: 'tags',
            value: 'front-end, reactjs, css, html, ninja',
        },
        {
            type: 'unavailable',
            value: 'unavailable',
        },
        {
            type: 'description',
            value: 'If you are up for more than once a week exploration.',
        }


    ];



    return (
        <StoriesContainer>
            <p>Profile takes key/value - value as string or number only These are dumb componets</p>
            <Card title="Mentor List Example" onEdit={() => console.log("Edit is Clicked!")}>
                <List items={items} >

                </List>
            </Card>
        </StoriesContainer>
    );
};



// List takes children of type children
export const ListGeneric = () => {


    return (
        <StoriesContainer>
            <Card title="List Example" onEdit={() => console.log("Edit is Clicked!")}>
                <List>
                    <div> A list passed as children</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>

                </List>
            </Card>
        </StoriesContainer>
    );
};