import styled from 'styled-components/macro';
import Vercel from '../../assets/powered-by-vercel.svg';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { report } from '../../ga';
import { scrollToTop } from '../../helpers/window';
import { desktop, mobile } from '../../Me/styles/shared/devices';
import { Mentor } from '../../types/models';
import Filter from '../Filter/Filter';
import ModalContent from '../Modal/ModalContent';
import SocialLinks from '../SocialLinks/SocialLinks';

const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  @media ${desktop} {
    left: 0;
    position: fixed;
    max-width: var(--filter-width);
  }

  @media ${mobile} {
    overflow-y: auto;
  }
`;

const SidebarNav = styled.nav`
  list-style: none;
  padding-left: 20px;
  position: fixed;
  bottom: 0;

  @media ${mobile} {
    display: none;
  }

  li {
    margin-bottom: 10px;
    color: var(--link-color);
    text-decoration: none;
    cursor: pointer;

    @media ${mobile} {
      margin-bottom: 5px;
    }
  }
`;
const VercelStyle = styled.a`
  display: block;
  width: 10px;
  margin: 20px 0 10px;
`;

const PatreonLink = styled.a`
  display: block;
  margin: 20px auto 0;
  width: 150px;

  @media ${mobile} {
    width: 130px;
    margin: 5px auto 10px;
  }

  img {
    max-width: 100%;
  }
`;

type SidebarProps = {
  mentors: Mentor[];
  handleModal: (title: string, content: string) => void;
};

export const Sidebar = ({ mentors, handleModal }: SidebarProps) => {
  const [filters, setFilters] = useFilters();
  const openModal = (title: string, content: string) =>
    handleModal(title, content);

  const toggleSwitch = async (showFavorite: boolean) => {
    await scrollToTop();
    setFilters({
      type: 'showFavorites',
      payload: showFavorite,
    });
    report('Show Favorite', 'switch', `${showFavorite}`);
  };

  return (
    <SidebarContainer>
      <Filter
        onToggleSwitch={toggleSwitch}
        mentorCount={mentors.length}
        mentors={mentors}
        showFavorite={filters.showFavorites}
      />
      <SocialLinks />
      <SidebarNav>
        <ModalContent
          policyTitle={'Cookies policy'}
          content={'cookies-policy'}
          handleModal={openModal}
        />
        <ModalContent
          policyTitle={'Code of Conduct'}
          content={'code-conduct'}
          handleModal={openModal}
        />
        <ModalContent
          policyTitle={'Terms & Conditions'}
          content={'terms-conditions'}
          handleModal={openModal}
        />
        <ModalContent
          policyTitle={'Privacy Statement'}
          content={'privacy-policy'}
          handleModal={openModal}
        />
        <VercelStyle
          href="https://vercel.com/?utm_source=[coding-coach]&utm_campaign=oss"
          className="vercel-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Vercel />
        </VercelStyle>
      </SidebarNav>

      <PatreonLink
        href="https://www.patreon.com/codingcoach_io"
        className="patreon-link"
        aria-label="Become a Patreon. A Patreon is a person who helps economically a project he or she believes in."
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/images/coding-coach-patron-button.jpg`}
          alt="Become a Patron"
        />
      </PatreonLink>
    </SidebarContainer>
  );
};
