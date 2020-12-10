import React from 'react';
import List from '../Me/components/List';
import Card from '../Me/components/Card';

import { StoriesContainer } from './StoriesContainer';

export default { title: 'Profile List and List Item' };

//looking for 
// email
// country
// tags - programming skills
// available

export const ListA = () => {
    const items = [
        {
            type: 'email',
            value: 'myemail@codecoache.com',
        },
        {
            type: 'spokenLanguages',
            value: ['EN'],
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
            value: ['front-end', 'reactjs', 'css', 'html'],
        },
        {
            type: 'available',
            value: true,
        },
        {
            type: 'description',
            value: 'If you are up for more than once a week exploration.',
        }


    ];



    return (
        <StoriesContainer>
            <Card title="Mentor List Example" onEdit={() => console.log("Edit is Clicked!")}>
                <List items={items} >

                    <h1>this is a child</h1>
                    <div>So is this so intersting</div>
                </List>
            </Card>
        </StoriesContainer>
    );
};