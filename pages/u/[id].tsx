import App from '../../src/components/App/App';
import { UserProfile } from '../../src/components/UserProfile/UserProfile';

function UserPage() {
    return (
      <App>
        <UserProfile favorites={favorites} onFavMentor={onFavMentor} />
      </App>
    )
  }
  
  export default UserPage