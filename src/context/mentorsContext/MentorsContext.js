import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { report } from '../../ga';
import { useUser } from '../userContext/UserContext';
import { useApi } from '../apiContext/ApiContext';
import {
  toggleFavMentor,
  get as getFavorites,
  readFavMentorsFromLocalStorage,
  updateFavMentorsForUser,
} from '../../favoriteManager';
import { useFilters } from '../../context/filtersContext/FiltersContext';

const initialState = {
  favorites: [],
  mentors: [],
  addFavorite: () => {},
  isLoading: true,
};

export const MentorsContext = createContext(initialState);

export const MentorsProvider = (props) => {
  const { children } = props;

  const [favorites, setFavorites] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [contextState, setContextState] = useState(initialState);

  const { currentUser } = useUser();
  const api = useApi();

  const initialize = useCallback(async () => {
    const favMentorsFromLocalStorage = readFavMentorsFromLocalStorage();

    await Promise.all([
      currentUser &&
        getFavorites(api).then((favorites) => {
          if (
            Array.isArray(favMentorsFromLocalStorage) &&
            favMentorsFromLocalStorage.length > 0
          ) {
            const mentors = favMentorsFromLocalStorage.filter(
              (m) => !favorites.includes(m)
            );
            if (mentors.length > 0) updateFavMentorsForUser(mentors);
          }
          setFavorites([
            ...new Set([...favMentorsFromLocalStorage, ...favorites]),
          ]);
        }),
      api
        .getMentors()
        .then((data) => {
          setMentors(data);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        }),
    ]);
    setContextState((state) => ({
      ...state,
      isLoading: false,
    }));
  }, [currentUser, api]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [filters] = useFilters();

  const filterMentors = useCallback(
    (mentor) => {
      const { tag, country, name, language, showFavorites } = filters;
      return (
        (!tag || mentor.tags.includes(tag)) &&
        (!country || mentor.country === country) &&
        (!name || mentor.name === name) &&
        (!language ||
          (mentor.spokenLanguages &&
            mentor.spokenLanguages.includes(language))) &&
        (!showFavorites || favorites.indexOf(mentor._id) > -1)
      );
    },
    [favorites, filters]
  );

  const filteredMentors = useMemo(
    () => mentors.filter(filterMentors),
    [mentors, filterMentors]
  );

  useEffect(() => {
    const addFavorite = async (mentor) => {
      const newFavorites = toggleFavMentor(api, mentor, [...favorites]);
      setFavorites(newFavorites);
      report('Favorite');
    };
    setContextState((contextState) => ({
      ...contextState,
      mentors: filteredMentors,
      favorites,
      addFavorite,
    }));
  }, [favorites, filteredMentors, api]);

  return (
    <MentorsContext.Provider value={contextState}>
      {children}
    </MentorsContext.Provider>
  );
};

export function useMentors() {
  const context = useContext(MentorsContext);
  return context;
}
