import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import UserContext from '../../context/userContext/UserContext';
import { useModal } from '../../context/modalContext/ModalContext';
import Card from '../components/Card';
import EditMentorDetails from '../Modals/EditMentorDetails';
import {
  updateMentor,
  getCurrentUser,
  clearCurrentUser,
} from '../../api/index';
import messages from '../../messages';
import ISO6391 from 'iso-639-1';
import { getName } from 'country-list';

import { ReactComponent as EmailIcon } from '../../assets/me/icon-email.svg';
import { ReactComponent as SpokenLanguagesIcon } from '../../assets/me/icon-spokenLanguages.svg';
import { ReactComponent as CountryIcon } from '../../assets/me/icon-country.svg';
import { ReactComponent as TitleIcon } from '../../assets/me/icon-title.svg';
import { ReactComponent as TagsIcon } from '../../assets/me/icon-tags.svg';
import { ReactComponent as AvailableIcon } from '../../assets/me/icon-available.svg';
import { ReactComponent as UnavailableIcon } from '../../assets/me/icon-unavailable.svg';
import { ReactComponent as DescriptionIcon } from '../../assets/me/icon-description.svg';

// Object w/ keyed SVG Components
const Components = {
  email: EmailIcon,
  spokenLanguages: SpokenLanguagesIcon,
  country: CountryIcon,
  title: TitleIcon,
  tags: TagsIcon,
  available: AvailableIcon,
  unavailable: UnavailableIcon,
  description: DescriptionIcon,
};

// Styled Components
const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: 40px auto;
  margin-top: 5px;
`;

const ProfileIcon = styled.div`
  width: 24px;
  height: 100%;
  margin-right: 20px;
`;

const ProfileText = styled.div`
  padding-top: 4px;
`;

// UPDATE THIS ACTION FOR EDIT PROFILE LINK ONCE EDIT PROFILE COMPONENT IS CREATED //
const handleUpdateMentor = async (updatedUserInfo, updateUser, closeModal) => {
  try {
    const updateMentorResult = await updateMentor(updatedUserInfo);
    if (updateMentorResult) {
      clearCurrentUser();
      toast.success(messages.EDIT_DETAILS_MENTOR_SUCCESS);
      const updatedUserDetails = await getCurrentUser();
      updateUser(updatedUserDetails);
      closeModal();
    } else {
      toast.error(messages.GENERIC_ERROR);
    }
  } catch (error) {
    toast.error(messages.GENERIC_ERROR);
  }
};

//--- Container for Profile Data ---//
const ProfileData = props => {
  const profileLines = Object.entries(props).map(([type, lineVal]) => (
    <ProfileLine type={type} val={lineVal} key={type} />
  ));
  return <div>{profileLines}</div>;
};

//--- Profile Line Items - SVG & Text ---//
const ProfileLine = props => {
  // variables for svg component and text values
  let TagName = Components[props.type];
  let lineText = '';

  // join array properties, and set availability svg to check or x
  switch (props.type) {
    case 'spokenLanguages':
      var languagesSpoken = [];
      props.val.map(language =>
        languagesSpoken.push(ISO6391.getName(language))
      );
      lineText = languagesSpoken.join(', ');
      break;
    case 'tags':
      lineText = props.val.join(', ');
      break;
    case 'available':
      TagName =
        props.val === true ? Components.available : Components.unavailable;
      lineText = props.val === true ? 'available' : 'unavailable';
      break;
    case 'country':
      lineText = getName(props.val);
      break;
    default:
      lineText = props.val;
      break;
  }

  return (
    <ProfileRow>
      <ProfileIcon>
        <TagName />
      </ProfileIcon>
      <ProfileText>{lineText}</ProfileText>
    </ProfileRow>
  );
};

//--- Profile Component ---//
const Profile = () => {
  // get user from context
  const { currentUser } = useContext(UserContext);

  const [openModal] = useModal(
    <EditMentorDetails
      userDetails={currentUser}
      updateMentor={handleUpdateMentor}
    />
  );

  return (
    <Card title="Mentor Profile" onEdit={openModal}>
      {currentUser && (
        <>
          <ProfileData
            email={currentUser.email}
            spokenLanguages={currentUser.spokenLanguages}
            country={currentUser.country}
            title={currentUser.title}
            tags={currentUser.tags}
            available={currentUser.available}
            description={currentUser.description}
          />
        </>
      )}
    </Card>
  );
};

export default Profile;
