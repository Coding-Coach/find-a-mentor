import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { report } from '../../ga';
import { useUser } from '../userContext/UserContext';
import { useApi } from '../apiContext/ApiContext';
import {
    toggleFavMentor,
    get as getFavorites,
    readFavMentorsFromLocalStorage,
    updateFavMentorsForUser,
  } from '../../favoriteManager';

const initialState = {
  favorites: [],
  mentors: undefined,
  addFavorite: () => {}
}

export const MentorsContext = createContext(initialState);

export const MentorsProvider = (props) => {
    const { children } = props

    const [favorites, setFavorites] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [contextState, setContextState] = useState(initialState)

    const { currentUser } = useUser();
    const api = useApi()

    const initialize = useCallback(async () => {
        const favMentorsFromLocalStorage = readFavMentorsFromLocalStorage();

        Promise.all([
          currentUser &&
            getFavorites(api).then(favorites => {
              if (
                Array.isArray(favMentorsFromLocalStorage) &&
                favMentorsFromLocalStorage.length > 0
              ) {
                const mentors = favMentorsFromLocalStorage.filter(
                  m => !favorites.includes(m)
                );
                if (mentors.length > 0) updateFavMentorsForUser(mentors);
              }
              setFavorites([
                ...new Set([...favMentorsFromLocalStorage, ...favorites]),
              ]);
            }),
            api.getMentors()
            .then(data => {
              setMentors(data)
            })
            .catch(e => {
              // eslint-disable-next-line no-console
              console.error(e);
            }),
        ]).then(() => {
          
        });
      }, [currentUser, api]);

      useEffect(() => {
          initialize();
      }, [initialize])

      useEffect(() => {
        const addFavorite = async mentor => {
          const newFavorites = toggleFavMentor(mentor, [...favorites]);
          setFavorites(newFavorites);
          report('Favorite');
        };
        setContextState({
          mentors,
          favorites,
          addFavorite,
        })
      }, [mentors, favorites])
    
    return <MentorsContext.Provider value={contextState}>{children}</MentorsContext.Provider>
};

export function useMentors() {
  const context = useContext(MentorsContext);
  return context;
}
