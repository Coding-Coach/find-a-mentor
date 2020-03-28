import React, { useContext } from "react";

import UserContext from '../../context/userContext/UserContext';
import Card from '../components/Card/index';

import { ReactComponent as EmailIcon } from '../../assets/me/icon-email.svg';
import { ReactComponent as SpokenLanguagesIcon } from '../../assets/me/icon-spokenLanguages.svg';
import { ReactComponent as CountryIcon } from '../../assets/me/icon-country.svg';
import { ReactComponent as TitleIcon } from '../../assets/me/icon-title.svg';
import { ReactComponent as TagsIcon } from '../../assets/me/icon-tags.svg';
import { ReactComponent as AvailableIcon } from '../../assets/me/icon-available.svg';
import { ReactComponent as UnavailableIcon } from '../../assets/me/icon-unavailable.svg';
import { ReactComponent as DescriptionIcon } from '../../assets/me/icon-description.svg';

import "./Profile.css";

// Object w/ keyed SVG Components
const Components = {
    email: EmailIcon,
    spokenLanguages: SpokenLanguagesIcon,
    country: CountryIcon,
    title: TitleIcon,
    tags: TagsIcon,
    available: AvailableIcon,
    unavailable: UnavailableIcon,
    description: DescriptionIcon
}

//--- Container for Profile Data ---//
const ProfileData = (props) => {
    const profileLines = Object.entries(props).map(p => <ProfileLine type={p[0]} val={p[1]} />);
    return (
        < div className="profileData">
            {profileLines}
        </div >
    )
}

//--- Profile Line Items - SVG & Text ---//
const ProfileLine = (props) => {
    // variables for svg component and text values
    let TagName = Components[props.type];
    let lineText = "";

    // join array properties, and set availability svg to check or x
    switch (props.type) {
        case "spokenLanguages":
        case "tags":
            lineText = props.val.join(", ");
            break;
        case "available":
            TagName = (props.val == true) ? Components.available : Components.unavailable;
            lineText = (props.val == true) ? "available" : "unavailable";
            break;
        default:
            lineText = props.val;
            break
    }

    return (
        <div className="profileLine">
            <div className="profileIcon">
                <TagName />
            </div>
            <div className="profileText">{lineText}</div>
        </div>
    )
}

//--- Profile Component ---//
const Profile = () => {
    // get user from context
    const user = useContext(UserContext);

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

