//----------TO DOS-----------//
// 1. Format SVG size, padding
// 2. Loop through...
//      a. spokenLanguages
//      b. tags
// 3. Conditionally render availability svg
// 4. Hook up edit link

import React, { useContext } from "react";

import UserContext from '../../context/userContext/UserContext';
import Card from '../components/Card/index';

import { ReactComponent as EmailIcon } from '../../assets/me/icon-email.svg';
import { ReactComponent as SpokenLanguagesIcon } from '../../assets/me/icon-spokenLanguages.svg';
import { ReactComponent as CountryIcon } from '../../assets/me/icon-country.svg';
import { ReactComponent as TitleIcon } from '../../assets/me/icon-title.svg';
import { ReactComponent as TagsIcon } from '../../assets/me/icon-tags.svg';
import { ReactComponent as AvailableIcon } from '../../assets/me/icon-available.svg';
import { ReactComponent as DescriptionIcon } from '../../assets/me/icon-description.svg';

// Object w/ keyed SVG Components
const Components = {
    email: EmailIcon,
    spokenLanguages: SpokenLanguagesIcon,
    country: CountryIcon,
    title: TitleIcon,
    tags: TagsIcon,
    available: AvailableIcon,
    description: DescriptionIcon
}

// Container for Profile Data
const ProfileData = (props) => {
    const profileLines = Object.entries(props).map(p => <ProfileLine type={p[0]} val={p[1]} />);
    return (
        < div >
            {profileLines}
        </div >
    )
}

// Profile Line Items - SVG and value
const ProfileLine = (props) => {
    const TagName = Components[props.type];
    return (
        <div>
            <TagName />
            <span>{props.val}</span>
        </div>
    )
}

const Profile = () => {
    const user = useContext(UserContext);
    console.log(user.currentUser);
    return (
        <Card title="Mentor Profile" onEdit="test">
            {user.currentUser &&
                < ProfileData
                    email={user.currentUser.email}
                    spokenLanguages={user.currentUser.spokenLanguages}
                    country={user.currentUser.country}
                    title={user.currentUser.title}
                    tags={user.currentUser.tags}
                    available={user.currentUser.available}
                    description={user.currentUser.description}
                />
            }

        </Card>
    )
}


export default Profile;

